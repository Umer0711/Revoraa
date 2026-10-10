/**
 * Revoraa Python Execution Engine (Pyodide Worker Runner)
 * 
 * Manages worker lifecycle, timeout bounds, cancellation, and stdout/stderr capture.
 * Ensures long-running execution (e.g. infinite loops) is terminated cleanly without
 * blocking the browser UI thread.
 */

class PyodideRunner {
  constructor() {
    this.worker = null;
    this.runCounter = 0;
    this.activeRunId = null;
    this.activeReject = null;
    this.activeResolve = null;
    this.timeoutHandle = null;
    this.statusListeners = new Set();
    this.currentStatus = { state: 'uninitialized', message: 'Idle' };
  }

  getWorker() {
    if (!this.worker) {
      // Create classic web worker pointing to public worker script
      this.worker = new Worker('/pyodide.worker.js');
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
      this.worker.onerror = this.handleWorkerError.bind(this);
      this.updateStatus('ready', 'Python environment ready');
    }
    return this.worker;
  }

  updateStatus(state, message) {
    this.currentStatus = { state, message };
    this.statusListeners.forEach(fn => fn(this.currentStatus));
  }

  subscribeStatus(listener) {
    this.statusListeners.add(listener);
    listener(this.currentStatus);
    return () => this.statusListeners.delete(listener);
  }

  handleWorkerMessage(event) {
    const data = event.data || {};
    const { type, runId, status, message, stdout, stderr, durationMs, error } = data;

    if (type === 'STATUS') {
      this.updateStatus(status, message);
      return;
    }

    if (type === 'READY') {
      this.updateStatus('ready', 'Python virtual machine ready');
      return;
    }

    if (type === 'INIT_ERROR') {
      this.updateStatus('error', error);
      if (this.activeReject) {
        this.activeReject(new Error(error));
        this.cleanupRun();
      }
      return;
    }

    // Ignore messages from cancelled or superseded runs
    if (runId !== this.activeRunId) {
      return;
    }

    if (type === 'RUN_SUCCESS') {
      this.updateStatus('ready', 'Execution complete');
      if (this.activeResolve) {
        this.activeResolve({
          success: true,
          stdout: stdout || '',
          stderr: stderr || '',
          durationMs: durationMs || 0
        });
      }
      this.cleanupRun();
      return;
    }

    if (type === 'RUN_ERROR') {
      this.updateStatus('ready', 'Execution returned error');
      if (this.activeResolve) {
        this.activeResolve({
          success: false,
          stdout: stdout || '',
          stderr: stderr || error || 'Unknown runtime error',
          durationMs: durationMs || 0
        });
      }
      this.cleanupRun();
    }
  }

  handleWorkerError(err) {
    console.error('[PyodideRunner] Worker uncaught error:', err);
    this.updateStatus('error', 'Worker thread crashed');
    if (this.activeResolve) {
      this.activeResolve({
        success: false,
        stdout: '',
        stderr: `Worker thread error: ${err.message || 'Worker runtime crashed'}`,
        durationMs: 0
      });
    }
    this.terminateAndReset();
  }

  cleanupRun() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = null;
    }
    this.activeRunId = null;
    this.activeResolve = null;
    this.activeReject = null;
  }

  terminateAndReset() {
    this.cleanupRun();
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (e) {
        console.warn('Worker terminate error:', e);
      }
      this.worker = null;
    }
    this.updateStatus('idle', 'Runtime terminated and reset');
  }

  /**
   * Run Python source code inside isolated worker.
   * Automatically bounds execution to `timeoutMs` to prevent infinite loops.
   */
  async runCode(code, { timeoutMs = 8000 } = {}) {
    // If a previous execution is still running, terminate worker and reset
    if (this.activeRunId !== null) {
      this.terminateAndReset();
    }

    this.runCounter += 1;
    const runId = this.runCounter;
    this.activeRunId = runId;

    const worker = this.getWorker();
    this.updateStatus('running', 'Executing Python code...');

    return new Promise((resolve, reject) => {
      this.activeResolve = resolve;
      this.activeReject = reject;

      // Arm execution timeout to terminate infinite loops
      this.timeoutHandle = setTimeout(() => {
        if (this.activeRunId === runId) {
          console.warn(`[PyodideRunner] Run ${runId} timed out after ${timeoutMs}ms. Terminating worker.`);
          this.terminateAndReset();
          resolve({
            success: false,
            stdout: '',
            stderr: `Execution timed out after ${Math.round(timeoutMs / 1000)}s.\nInfinite loop or computation stopped by execution guard.`,
            durationMs: timeoutMs,
            timedOut: true
          });
        }
      }, timeoutMs);

      // Post execution command to worker
      worker.postMessage({
        type: 'RUN',
        runId,
        code
      });
    });
  }

  /**
   * Explicitly stop currently running execution.
   */
  stopExecution() {
    if (this.activeRunId !== null) {
      const runId = this.activeRunId;
      this.terminateAndReset();
      return { stopped: true, runId };
    }
    return { stopped: false };
  }
}

export const pyodideRunner = new PyodideRunner();
