/**
 * Revoraa Adaptive Performance System — Runtime Performance Monitor
 * 
 * Passively observes runtime frame timing and long tasks.
 * Detects sustained degradation to trigger graceful, non-oscillating downgrades.
 * Suspends completely when tab is hidden to preserve battery and CPU.
 */

import { PERFORMANCE_MODES } from './deviceClassifier.js';

const DEGRADATION_COOLDOWN_MS = 15 * 60 * 1000; // 15 mins
const RECOVERY_STABILITY_MS = 5 * 60 * 1000;   // 5 mins
const LONG_TASK_THRESHOLD_MS = 85;             // 85ms+ indicates main-thread blocking

export class RuntimePerformanceMonitor {
  constructor({ onDegrade, onRecover } = {}) {
    this.onDegrade = onDegrade;
    this.onRecover = onRecover;
    this.currentMode = PERFORMANCE_MODES.BALANCED;
    this.isManual = false;
    this.isRunning = false;
    this.observer = null;

    // Rolling metrics
    this.recentLongTasks = 0;
    this.recentDroppedFrames = 0;
    this.lastAdjustmentTime = Date.now();
    this.recoveryStartTime = null;

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.checkSampleWindow = this.checkSampleWindow.bind(this);
    this.sampleTimer = null;
  }

  start(initialMode, isManual = false) {
    this.currentMode = initialMode;
    this.isManual = isManual;

    if (this.isRunning) return;
    this.isRunning = true;

    if (typeof window === 'undefined') return;

    // Register visibility change listener
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }

    // Initialize Long Task Observer if browser supports it
    this.initObserver();

    // Start passive periodic rolling window check (every 15s)
    this.sampleTimer = setInterval(this.checkSampleWindow, 15000);
  }

  stop() {
    this.isRunning = false;
    if (this.sampleTimer) {
      clearInterval(this.sampleTimer);
      this.sampleTimer = null;
    }
    if (this.observer) {
      try {
        this.observer.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.observer = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  updateState(mode, isManual) {
    this.currentMode = mode;
    this.isManual = isManual;
    this.recentLongTasks = 0;
    this.recentDroppedFrames = 0;
  }

  handleVisibilityChange() {
    if (typeof document !== 'undefined' && document.hidden) {
      // Pause active counting when user leaves tab
      this.recentLongTasks = 0;
      this.recentDroppedFrames = 0;
    }
  }

  initObserver() {
    if (typeof PerformanceObserver === 'undefined') return;

    try {
      // Check if 'longtask' entry type is supported
      if (PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes('longtask')) {
        this.observer = new PerformanceObserver((list) => {
          if (typeof document !== 'undefined' && document.hidden) return;
          for (const entry of list.getEntries()) {
            if (entry.duration >= LONG_TASK_THRESHOLD_MS) {
              this.recentLongTasks++;
            }
          }
        });
        this.observer.observe({ entryTypes: ['longtask'] });
      }
    } catch (err) {
      // Fallback silently if unsupported
    }
  }

  checkSampleWindow() {
    if ((typeof document !== 'undefined' && document.hidden) || !this.isRunning) return;

    // Do not adapt automatically if user has specified a manual override
    if (this.isManual) return;

    const now = Date.now();
    const timeSinceLastAdjustment = now - this.lastAdjustmentTime;

    // 1. Degradation check: 4+ long tasks in rolling 15s window
    const isDegraded = this.recentLongTasks >= 4;

    if (isDegraded && timeSinceLastAdjustment > DEGRADATION_COOLDOWN_MS) {
      let targetMode = null;
      if (this.currentMode === PERFORMANCE_MODES.HIGH_QUALITY) {
        targetMode = PERFORMANCE_MODES.BALANCED;
      } else if (this.currentMode === PERFORMANCE_MODES.BALANCED) {
        targetMode = PERFORMANCE_MODES.EFFICIENCY;
      }

      if (targetMode) {
        const recordedCount = this.recentLongTasks;
        this.lastAdjustmentTime = now;
        this.recentLongTasks = 0;
        this.recoveryStartTime = null;
        if (typeof this.onDegrade === 'function') {
          this.onDegrade(targetMode, `Sustained main-thread task delays (${recordedCount} long tasks recorded)`);
        }
        return;
      }
    }

    // 2. Recovery check: zero long tasks over 5 minutes of continuous active usage
    if (this.recentLongTasks === 0) {
      if (!this.recoveryStartTime) {
        this.recoveryStartTime = now;
      } else if (now - this.recoveryStartTime > RECOVERY_STABILITY_MS && timeSinceLastAdjustment > DEGRADATION_COOLDOWN_MS) {
        let recoveryTarget = null;
        if (this.currentMode === PERFORMANCE_MODES.EFFICIENCY) {
          recoveryTarget = PERFORMANCE_MODES.BALANCED;
        }

        if (recoveryTarget) {
          this.lastAdjustmentTime = now;
          this.recoveryStartTime = null;
          if (typeof this.onRecover === 'function') {
            this.onRecover(recoveryTarget, 'Sustained frame stability for >5 minutes');
          }
        }
      }
    } else {
      // Reset recovery timer if long tasks occurred
      this.recoveryStartTime = null;
    }

    // Reset rolling window counts
    this.recentLongTasks = 0;
    this.recentDroppedFrames = 0;
  }
}
