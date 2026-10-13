import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  PERFORMANCE_MODES,
  getOrCreateDeviceId,
  getDeviceCapabilities,
  classifyDevice,
  loadCachedProfile,
  saveCachedProfile,
  fetchRemoteDeviceProfile,
  persistDeviceProfileToRemote,
  RuntimePerformanceMonitor,
  getRemotionAdaptivePreviewConfig
} from '../lib/performance';

const AdaptivePerformanceContext = createContext(null);

export function AdaptivePerformanceProvider({ children }) {
  const { user } = useAuth();
  const deviceIdRef = useRef(getOrCreateDeviceId());
  const deviceId = deviceIdRef.current;

  // 1. Initial fast synchronous boot from local cache
  const initialCache = useMemo(() => loadCachedProfile(deviceId), [deviceId]);

  const [mode, setMode] = useState(initialCache.mode || PERFORMANCE_MODES.BALANCED);
  const [manualMode, setManualModeState] = useState(initialCache.manualOverride || 'automatic');
  const [capabilities, setCapabilities] = useState(initialCache.capabilities || null);
  const [classificationReason, setClassificationReason] = useState(initialCache.reason || 'Initial assessment');
  const [isAssessing, setIsAssessing] = useState(false);

  // 2. Track OS-level reduced motion accessibility preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Effective reduced motion: true if OS requests it OR if Efficiency mode is active
  const effectiveReducedMotion = prefersReducedMotion || mode === PERFORMANCE_MODES.EFFICIENCY;

  // 3. Keep DOM root attributes in sync immediately
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-perf-mode', mode);
    document.documentElement.setAttribute('data-reduced-motion', effectiveReducedMotion ? 'true' : 'false');
  }, [mode, effectiveReducedMotion]);

  // 4. Listen for OS prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 5. Profiling function: assesses hardware and saves results
  const performAssessment = useCallback(async (forced = false) => {
    setIsAssessing(true);
    try {
      const caps = getDeviceCapabilities();
      setCapabilities(caps);

      const result = await classifyDevice(caps, false);
      
      const newAutoMode = result.mode;
      const currentManual = manualMode;
      const effectiveMode = (currentManual && currentManual !== 'automatic') ? currentManual : newAutoMode;

      setMode(effectiveMode);
      setClassificationReason(result.reason);

      const profilePayload = {
        deviceId,
        mode: effectiveMode,
        autoMode: newAutoMode,
        manualOverride: currentManual,
        capabilities: caps,
        reason: result.reason,
        lastAssessedAt: Date.now()
      };

      // Save locally
      saveCachedProfile(profilePayload);

      // Persist to Supabase if authenticated
      if (user?.id) {
        await persistDeviceProfileToRemote(user.id, profilePayload);
      }
    } catch (err) {
      console.warn('[Revoraa Perf] Profiling assessment error:', err);
    } finally {
      setIsAssessing(false);
    }
  }, [deviceId, manualMode, user?.id]);

  // 6. First visit or stale profile check on mount
  useEffect(() => {
    if (!initialCache.isCached || initialCache.isStale) {
      // Run lightweight classification during idle time
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => performAssessment(false), { timeout: 1500 });
      } else {
        setTimeout(() => performAssessment(false), 200);
      }
    }
  }, [initialCache.isCached, initialCache.isStale, performAssessment]);

  // 7. Sync with authenticated user cloud profile on login / session change
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;
    async function syncCloudProfile() {
      try {
        const remoteProfile = await fetchRemoteDeviceProfile(user.id, deviceId);
        if (!isMounted) return;

        if (remoteProfile) {
          const remoteManual = remoteProfile.manualOverride || 'automatic';
          const effectiveMode = (remoteManual !== 'automatic') ? remoteManual : remoteProfile.mode;

          setManualModeState(remoteManual);
          setMode(effectiveMode);
          if (remoteProfile.capabilities) setCapabilities(remoteProfile.capabilities);
          if (remoteProfile.reason) setClassificationReason(remoteProfile.reason);

          // Update local cache
          saveCachedProfile({
            deviceId,
            mode: effectiveMode,
            autoMode: remoteProfile.mode,
            manualOverride: remoteManual,
            capabilities: remoteProfile.capabilities,
            reason: remoteProfile.reason,
            lastAssessedAt: remoteProfile.lastAssessedAt
          });
        } else {
          // No cloud record yet for this device: save current local profile to cloud
          const currentLocal = loadCachedProfile(deviceId);
          await persistDeviceProfileToRemote(user.id, {
            deviceId,
            mode: currentLocal.mode,
            autoMode: currentLocal.autoMode || currentLocal.mode,
            manualOverride: currentLocal.manualOverride || 'automatic',
            capabilities: currentLocal.capabilities || getDeviceCapabilities(),
            reason: currentLocal.reason || 'Local profile sync on login',
            lastAssessedAt: currentLocal.lastAssessedAt || Date.now()
          });
        }
      } catch (err) {
        console.warn('[Revoraa Perf] Cloud profile sync error:', err);
      }
    }

    syncCloudProfile();
    return () => { isMounted = false; };
  }, [user?.id, deviceId]);

  // 8. Runtime performance adaptation monitor
  useEffect(() => {
    const monitor = new RuntimePerformanceMonitor({
      onDegrade: (downgradeMode, reason) => {
        console.info(`[Revoraa Perf] Runtime degradation detected -> Downgrading to ${downgradeMode}: ${reason}`);
        setMode(downgradeMode);
        setClassificationReason(reason);
        saveCachedProfile({
          deviceId,
          mode: downgradeMode,
          autoMode: downgradeMode,
          manualOverride: manualMode,
          capabilities,
          reason,
          lastAssessedAt: Date.now()
        });
        if (user?.id) {
          persistDeviceProfileToRemote(user.id, {
            deviceId,
            mode: downgradeMode,
            autoMode: downgradeMode,
            manualOverride: manualMode,
            capabilities,
            reason,
            lastAssessedAt: Date.now()
          });
        }
      },
      onRecover: (recoveryMode, reason) => {
        console.info(`[Revoraa Perf] Runtime performance recovered -> Stepping up to ${recoveryMode}: ${reason}`);
        setMode(recoveryMode);
        setClassificationReason(reason);
        saveCachedProfile({
          deviceId,
          mode: recoveryMode,
          autoMode: recoveryMode,
          manualOverride: manualMode,
          capabilities,
          reason,
          lastAssessedAt: Date.now()
        });
        if (user?.id) {
          persistDeviceProfileToRemote(user.id, {
            deviceId,
            mode: recoveryMode,
            autoMode: recoveryMode,
            manualOverride: manualMode,
            capabilities,
            reason,
            lastAssessedAt: Date.now()
          });
        }
      }
    });

    monitor.start(mode, manualMode !== 'automatic');

    return () => {
      monitor.stop();
    };
  }, [mode, manualMode, deviceId, capabilities, user?.id]);

  // 9. Manual override handler
  const setManualMode = useCallback(async (newMode) => {
    setManualModeState(newMode);
    
    let targetEffectiveMode = newMode;
    if (newMode === 'automatic') {
      // Revert to detected auto mode or recalibrate
      const cached = loadCachedProfile(deviceId);
      targetEffectiveMode = cached.autoMode || PERFORMANCE_MODES.BALANCED;
    }

    setMode(targetEffectiveMode);

    const updatedProfile = {
      deviceId,
      mode: targetEffectiveMode,
      autoMode: initialCache.autoMode || PERFORMANCE_MODES.BALANCED,
      manualOverride: newMode,
      capabilities: capabilities || getDeviceCapabilities(),
      reason: newMode === 'automatic' ? 'User reset to Automatic classification' : `Manual user override: ${newMode}`,
      lastAssessedAt: Date.now()
    };

    saveCachedProfile(updatedProfile);

    if (user?.id) {
      await persistDeviceProfileToRemote(user.id, updatedProfile);
    }
  }, [deviceId, initialCache.autoMode, capabilities, user?.id]);

  // 10. Recalibrate action (explicit user trigger in settings)
  const recalibrate = useCallback(async () => {
    return performAssessment(true);
  }, [performAssessment]);

  // 11. Centralized computed UI effect tokens
  const effects = useMemo(() => {
    const isEfficiency = mode === PERFORMANCE_MODES.EFFICIENCY;
    const isHighQuality = mode === PERFORMANCE_MODES.HIGH_QUALITY;

    return {
      blurLevel: isEfficiency ? 'none' : isHighQuality ? 'full' : 'subtle',
      shadowLevel: isEfficiency ? 'none' : isHighQuality ? 'full' : 'subtle',
      particlesCount: isEfficiency ? 0 : isHighQuality ? 30 : 10,
      confettiCount: isEfficiency ? 15 : isHighQuality ? 80 : 35,
      staggerDelay: isEfficiency ? 0 : isHighQuality ? 0.08 : 0.04,
      hoverAnimations: !isEfficiency && !effectiveReducedMotion,
      pageTransition: isEfficiency || effectiveReducedMotion ? 'fade' : 'spring',
      renderConcurrency: isEfficiency ? 1 : isHighQuality ? 4 : 2,
      previewScale: isEfficiency ? 0.5 : isHighQuality ? 1.0 : 0.75
    };
  }, [mode, effectiveReducedMotion]);

  // Remotion preview config for active mode
  const remotion = useMemo(() => {
    return getRemotionAdaptivePreviewConfig(mode);
  }, [mode]);

  const value = useMemo(() => ({
    mode,
    manualMode,
    isAutomatic: manualMode === 'automatic',
    isEfficiency: mode === PERFORMANCE_MODES.EFFICIENCY,
    isBalanced: mode === PERFORMANCE_MODES.BALANCED,
    isHighQuality: mode === PERFORMANCE_MODES.HIGH_QUALITY,
    capabilities: capabilities || getDeviceCapabilities(),
    classificationReason,
    isAssessing,
    reducedMotion: effectiveReducedMotion,
    effects,
    remotion,
    deviceId,
    setManualMode,
    recalibrate
  }), [
    mode,
    manualMode,
    capabilities,
    classificationReason,
    isAssessing,
    effectiveReducedMotion,
    effects,
    remotion,
    deviceId,
    setManualMode,
    recalibrate
  ]);

  return (
    <AdaptivePerformanceContext.Provider value={value}>
      {children}
    </AdaptivePerformanceContext.Provider>
  );
}

export function useAdaptivePerformance() {
  const context = useContext(AdaptivePerformanceContext);
  if (!context) {
    // Graceful fallback if used outside provider
    const caps = getDeviceCapabilities();
    return {
      mode: PERFORMANCE_MODES.BALANCED,
      manualMode: 'automatic',
      isAutomatic: true,
      isEfficiency: false,
      isBalanced: true,
      isHighQuality: false,
      capabilities: caps,
      classificationReason: 'Fallback context',
      isAssessing: false,
      reducedMotion: false,
      effects: {
        blurLevel: 'subtle',
        shadowLevel: 'subtle',
        particlesCount: 10,
        confettiCount: 35,
        staggerDelay: 0.04,
        hoverAnimations: true,
        pageTransition: 'spring',
        renderConcurrency: 2,
        previewScale: 0.75
      },
      remotion: getRemotionAdaptivePreviewConfig(PERFORMANCE_MODES.BALANCED),
      deviceId: 'fallback_device',
      setManualMode: () => {},
      recalibrate: async () => {}
    };
  }
  return context;
}
