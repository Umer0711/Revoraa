/**
 * Revoraa Adaptive Performance System — Device Classifier
 * 
 * Performs privacy-preserving, non-blocking device capability detection
 * and lightweight rendering-responsiveness assessment.
 * 
 * Profiles:
 *  - 'efficiency': Constrained devices (budget phones, battery-saver, slow frame dispatch, low RAM/cores)
 *  - 'balanced': Default baseline for intermediate capabilities (4-8 cores, 4-8GB RAM, normal browsers)
 *  - 'high-quality': High-performance devices (8+ cores, high RAM, fast GPU, smooth frame dispatch)
 */

export const PERFORMANCE_ALGORITHM_VERSION = 1;

export const PERFORMANCE_MODES = {
  EFFICIENCY: 'efficiency',
  BALANCED: 'balanced',
  HIGH_QUALITY: 'high-quality'
};

const DEVICE_ID_KEY = 'revoraa_device_id';

/**
 * Generate or retrieve an opaque, random per-browser/device profile identifier.
 * Non-identifying UUID stored in localStorage.
 */
export function getOrCreateDeviceId() {
  if (typeof window === 'undefined') return 'server_device';
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id || id.length < 16) {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        id = 'dev_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
      }
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (err) {
    return 'fallback_device_' + Date.now().toString(36);
  }
}

/**
 * Detect general operating platform safely using navigator hints and progressive enhancement.
 */
export function detectPlatform() {
  if (typeof window === 'undefined') return { os: 'unknown', isMobile: false, isTouch: false };

  const ua = (navigator.userAgent || '').toLowerCase();
  const maxTouch = navigator.maxTouchPoints || 0;
  const isTouch = maxTouch > 0 || (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);

  let os = 'other';
  if (/ipad|iphone|ipod/.test(ua) || (navigator.platform === 'MacIntel' && maxTouch > 1)) {
    os = 'ios';
  } else if (/android/.test(ua)) {
    os = 'android';
  } else if (/macintosh|mac os x/.test(ua)) {
    os = 'macos';
  } else if (/windows|win32|win64/.test(ua)) {
    os = 'windows';
  } else if (/linux/.test(ua)) {
    os = 'linux';
  }

  const isMobile = os === 'ios' || os === 'android' || (isTouch && window.innerWidth <= 1024);

  return { os, isMobile, isTouch };
}

/**
 * Collect raw device signals safely without blocking or throwing.
 */
export function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      cores: 4,
      memoryGB: null,
      pixelRatio: 1,
      isTouch: false,
      isMobile: false,
      platform: 'unknown',
      saveData: false,
      reducedMotion: false,
      screenResolution: { width: 1920, height: 1080 }
    };
  }

  const platformInfo = detectPlatform();
  const cores = navigator.hardwareConcurrency || 4;
  const memoryGB = typeof navigator.deviceMemory === 'number' ? navigator.deviceMemory : null;
  const pixelRatio = window.devicePixelRatio || 1;
  const reducedMotion = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection?.saveData);
  const effectiveType = navigator.connection?.effectiveType || 'unknown';

  return {
    cores,
    memoryGB,
    pixelRatio,
    isTouch: platformInfo.isTouch,
    isMobile: platformInfo.isMobile,
    platform: platformInfo.os,
    saveData,
    effectiveType,
    reducedMotion,
    screenResolution: {
      width: window.screen?.width || window.innerWidth,
      height: window.screen?.height || window.innerHeight
    }
  };
}

/**
 * Non-blocking rendering responsiveness probe.
 * Measures 5 frame intervals during idle time to detect high scheduling jitter.
 * Total time: ~80ms-120ms during browser idle time.
 */
export async function measureFrameResponsiveness() {
  if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') {
    return { avgInterval: 16.6, maxInterval: 16.6, jitter: 0, droppedFrames: 0 };
  }

  return new Promise((resolve) => {
    const frameTimes = [];
    let lastTime = performance.now();
    let frameCount = 0;
    const targetFrames = 5;

    function onFrame(currentTime) {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      if (frameCount > 0) {
        frameTimes.push(delta);
      }
      frameCount++;

      if (frameCount <= targetFrames) {
        requestAnimationFrame(onFrame);
      } else {
        if (frameTimes.length === 0) {
          resolve({ avgInterval: 16.6, maxInterval: 16.6, jitter: 0, droppedFrames: 0 });
          return;
        }

        const sum = frameTimes.reduce((acc, t) => acc + t, 0);
        const avg = sum / frameTimes.length;
        const max = Math.max(...frameTimes);
        const jitter = Math.abs(max - avg);
        const dropped = frameTimes.filter(t => t > 26).length; // >26ms = dropped below 38fps

        resolve({
          avgInterval: Math.round(avg * 10) / 10,
          maxInterval: Math.round(max * 10) / 10,
          jitter: Math.round(jitter * 10) / 10,
          droppedFrames: dropped
        });
      }
    }

    // Schedule during idle or next tick so it never blocks UI interactions
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(() => requestAnimationFrame(onFrame), { timeout: 300 });
    } else {
      setTimeout(() => requestAnimationFrame(onFrame), 16);
    }
  });
}

/**
 * Classify device based on hardware signals + measured frame responsiveness.
 * Conservative heuristic: default to 'balanced' when uncertain.
 */
export async function classifyDevice(providedCapabilities = null, skipFrameMeasurement = false) {
  const caps = providedCapabilities || getDeviceCapabilities();
  
  let frameMetrics = { avgInterval: 16.6, maxInterval: 16.6, jitter: 0, droppedFrames: 0 };
  if (!skipFrameMeasurement) {
    try {
      frameMetrics = await measureFrameResponsiveness();
    } catch {
      // Fallback silently if rAF measurement fails
    }
  }

  let mode = PERFORMANCE_MODES.BALANCED;
  let reason = 'Standard balanced baseline for device specifications';

  // 1. Data-saver mode: immediate efficiency
  if (caps.saveData) {
    return {
      mode: PERFORMANCE_MODES.EFFICIENCY,
      reason: 'User has Data-Saver / Save-Data enabled',
      capabilities: caps,
      frameMetrics,
      algorithmVersion: PERFORMANCE_ALGORITHM_VERSION
    };
  }

  // 2. Battery status check if API supported
  let isBatteryConstrained = false;
  if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
    try {
      const battery = await navigator.getBattery();
      if (battery && battery.charging === false && battery.level <= 0.20) {
        isBatteryConstrained = true;
      }
    } catch {
      // Ignore battery API errors
    }
  }

  if (isBatteryConstrained) {
    return {
      mode: PERFORMANCE_MODES.EFFICIENCY,
      reason: 'Battery level <= 20% on battery power (low-power preservation)',
      capabilities: caps,
      frameMetrics,
      algorithmVersion: PERFORMANCE_ALGORITHM_VERSION
    };
  }

  // 3. Low-end constraints assessment
  const isSeverelyConstrainedCores = caps.cores <= 2;
  const isConstrainedMobileCores = caps.isMobile && caps.cores <= 4 && (frameMetrics.jitter > 12 || frameMetrics.droppedFrames >= 2);
  const isLowMemory = caps.memoryGB !== null && caps.memoryGB <= 3;
  const isHighJitter = frameMetrics.jitter > 18 || frameMetrics.avgInterval > 32;

  if (isSeverelyConstrainedCores || isLowMemory || isConstrainedMobileCores || isHighJitter) {
    mode = PERFORMANCE_MODES.EFFICIENCY;
    if (isLowMemory) {
      reason = `Constrained system memory (${caps.memoryGB} GB reported)`;
    } else if (isSeverelyConstrainedCores) {
      reason = `Constrained CPU cores (${caps.cores} logical cores)`;
    } else if (isHighJitter) {
      reason = `Measured high frame timing jitter (${frameMetrics.jitter}ms) during responsiveness check`;
    } else {
      reason = 'Budget mobile profile with high rendering variance';
    }
  }
  // 4. High-performance assessment
  else if (
    caps.cores >= 8 &&
    (caps.memoryGB === null || caps.memoryGB >= 8) &&
    frameMetrics.jitter <= 8 &&
    frameMetrics.droppedFrames === 0 &&
    !caps.isMobile
  ) {
    mode = PERFORMANCE_MODES.HIGH_QUALITY;
    reason = `High-capability desktop environment (${caps.cores} cores, fast frame dispatch)`;
  }
  // 5. High-end Apple Silicon or desktop Mac
  else if (
    caps.platform === 'macos' &&
    caps.cores >= 8 &&
    frameMetrics.jitter <= 6 &&
    frameMetrics.droppedFrames === 0
  ) {
    mode = PERFORMANCE_MODES.HIGH_QUALITY;
    reason = `Apple Silicon / High-performance macOS system (${caps.cores} cores, stable 60fps)`;
  }
  // 6. Otherwise Balanced
  else {
    mode = PERFORMANCE_MODES.BALANCED;
    reason = `Balanced profile (${caps.cores} cores, standard rendering responsiveness)`;
  }

  return {
    mode,
    reason,
    capabilities: caps,
    frameMetrics,
    algorithmVersion: PERFORMANCE_ALGORITHM_VERSION
  };
}
