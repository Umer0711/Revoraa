/**
 * Revoraa Dedicated Pyodide Web Worker
 * 
 * Executes Python code in a sandboxed WebAssembly runtime isolated from the main UI thread.
 * Disallows access to DOM, host application tokens, and external credentials.
 * Standard library execution only.
 */

/* eslint-disable no-restricted-globals */

let pyodideInstance = null;
let isInitializing = false;
const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';

async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 100));
    }
    return pyodideInstance;
  }

  isInitializing = true;
  try {
    self.postMessage({ type: 'STATUS', status: 'downloading', message: 'Loading Python WebAssembly runtime...' });
    
    // Load Pyodide script from CDN
    self.importScripts(PYODIDE_CDN);

    self.postMessage({ type: 'STATUS', status: 'compiling', message: 'Initializing Python virtual machine...' });
    
    pyodideInstance = await self.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    });

    // Configure standard environment: setup clean stdout/stderr capture buffer
    await pyodideInstance.runPythonAsync(`
import sys
import io

class _OutputBuffer:
    def __init__(self, max_lines=300, max_bytes=65536):
        self.buffer = []
        self.total_bytes = 0
        self.max_lines = max_lines
        self.max_bytes = max_bytes
        self.truncated = False

    def write(self, s):
        if not s or self.truncated:
            return
        if self.total_bytes + len(s) > self.max_bytes or len(self.buffer) >= self.max_lines:
            self.truncated = True
            self.buffer.append("\\n[Output truncated: exceeded 300 lines or 64KB limit]")
            return
        self.total_bytes += len(s)
        self.buffer.append(s)

    def flush(self):
        pass

    def get_value(self):
        return "".join(self.buffer)
`);

    self.postMessage({ type: 'READY' });
    isInitializing = false;
    return pyodideInstance;
  } catch (err) {
    isInitializing = false;
    self.postMessage({ 
      type: 'INIT_ERROR', 
      error: `Failed to initialize Python runtime: ${err.message || String(err)}` 
    });
    throw err;
  }
}

self.onmessage = async (event) => {
  const { type, runId, code } = event.data || {};

  if (type === 'INIT') {
    try {
      await initPyodide();
    } catch {
      // Handled via INIT_ERROR message
    }
    return;
  }

  if (type === 'RUN') {
    const startTime = performance.now();
    try {
      const py = await initPyodide();
      
      // Setup capture harness in Python namespace
      const setupScript = `
_out_stream = _OutputBuffer()
_err_stream = _OutputBuffer()
_old_stdout = sys.stdout
_old_stderr = sys.stderr
sys.stdout = _out_stream
sys.stderr = _err_stream
`;
      await py.runPythonAsync(setupScript);

      let executionError = null;
      try {
        await py.runPythonAsync(code);
      } catch (err) {
        executionError = err;
      }

      // Restore streams & retrieve buffer
      const teardownScript = `
sys.stdout = _old_stdout
sys.stderr = _old_stderr
_captured_stdout = _out_stream.get_value()
_captured_stderr = _err_stream.get_value()
`;
      await py.runPythonAsync(teardownScript);

      const stdout = py.globals.get('_captured_stdout') || '';
      const stderr = py.globals.get('_captured_stderr') || '';
      const durationMs = Math.round(performance.now() - startTime);

      if (executionError) {
        // Format clean error message by stripping internal Pyodide Javascript stack wrappers
        let cleanErr = executionError.message || String(executionError);
        if (cleanErr.includes('Traceback (most recent call last):')) {
          const tbIdx = cleanErr.indexOf('Traceback (most recent call last):');
          cleanErr = cleanErr.slice(tbIdx);
        }
        
        self.postMessage({
          type: 'RUN_ERROR',
          runId,
          stdout,
          stderr: stderr ? `${stderr}\n${cleanErr}` : cleanErr,
          durationMs
        });
      } else {
        self.postMessage({
          type: 'RUN_SUCCESS',
          runId,
          stdout,
          stderr,
          durationMs
        });
      }
    } catch (unexpectedErr) {
      const durationMs = Math.round(performance.now() - startTime);
      self.postMessage({
        type: 'RUN_ERROR',
        runId,
        stdout: '',
        stderr: unexpectedErr.message || 'Fatal execution error inside Python runtime.',
        durationMs
      });
    }
  }
};
