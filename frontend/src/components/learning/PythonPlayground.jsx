import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Square, RotateCcw, Copy, Check, Terminal, 
  AlertTriangle, Clock, Sparkles, CheckCircle2 
} from 'lucide-react';
import { pyodideRunner } from '../../lib/pyodideRunner';

export function PythonPlayground({ 
  initialCode = '', 
  title = 'Interactive Python Playground',
  exercisePrompt = null,
  expectedOutput = null
}) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState('');
  const [errorOutput, setErrorOutput] = useState('');
  const [executionTime, setExecutionTime] = useState(null);
  const [runnerStatus, setRunnerStatus] = useState({ state: 'idle', message: 'Ready' });
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  useEffect(() => {
    const unsubscribe = pyodideRunner.subscribeStatus((status) => {
      setRunnerStatus(status);
    });
    return unsubscribe;
  }, []);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setErrorOutput('');
    setOutput('');
    setExecutionTime(null);

    try {
      const result = await pyodideRunner.runCode(code, { timeoutMs: 8000 });
      setOutput(result.stdout || '');
      setErrorOutput(result.stderr || '');
      setExecutionTime(result.durationMs);
    } catch (err) {
      setErrorOutput(`Runtime error: ${err.message || 'Execution failed'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    pyodideRunner.stopExecution();
    setIsRunning(false);
    setErrorOutput('Execution stopped by user.');
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setErrorOutput('');
    setExecutionTime(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to run; Tab key inserts 4 spaces
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const newCode = code.substring(0, start) + spaces + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const isMatchingExpected = expectedOutput && output.trim() === expectedOutput.trim();

  return (
    <div style={{
      background: '#18181b',
      borderRadius: 'var(--radius-lg, 12px)',
      border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))',
      overflow: 'hidden',
      margin: '1.75rem 0',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
    }}>
      {/* Playground Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        background: '#27272a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        {/* Terminal Mac Dots & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary, #f4f4f5)' }}>
            {title}
          </span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            fontWeight: 500
          }}>
            Python 3.12 (Pyodide WebAssembly)
          </span>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.775rem',
              minHeight: '32px',
              gap: '0.35rem'
            }}
            title="Copy Code"
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.775rem',
              minHeight: '32px',
              gap: '0.35rem'
            }}
            title="Reset to starter code"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>

          {isRunning ? (
            <button
              onClick={handleStop}
              className="btn"
              style={{
                background: '#dc2626',
                color: '#fff',
                padding: '0.35rem 0.85rem',
                fontSize: '0.775rem',
                minHeight: '32px',
                gap: '0.35rem',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              title="Stop running execution"
            >
              <Square size={13} fill="#fff" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleRun}
              className="btn btn-primary"
              style={{
                padding: '0.35rem 0.95rem',
                fontSize: '0.775rem',
                minHeight: '32px',
                gap: '0.4rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none'
              }}
              title="Run Code (Cmd/Ctrl + Enter)"
            >
              <Play size={13} fill="#fff" />
              <span>Run Code</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Exercise Prompt Banner */}
      {exercisePrompt && (
        <div style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(59, 130, 246, 0.08)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem'
        }}>
          <Sparkles size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.825rem', color: '#bfdbfe', lineHeight: 1.5 }}>
            <strong>Practice Exercise: </strong>{exercisePrompt}
          </div>
        </div>
      )}

      {/* Editor & Console Split / Stack */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr)',
        background: '#1e1e1e'
      }}>
        {/* Code Editor Area */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            aria-label="Python code editor"
            style={{
              width: '100%',
              minHeight: '220px',
              padding: '1rem 1.25rem',
              background: '#1e1e1e',
              color: '#f8fafc',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              border: 'none',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            fontSize: '0.7rem',
            color: '#64748b',
            pointerEvents: 'none'
          }}>
            Press <kbd style={{ background: '#334155', padding: '1px 4px', borderRadius: '3px', color: '#cbd5e1' }}>Ctrl/Cmd + Enter</kbd> to run
          </div>
        </div>

        {/* Output Console */}
        <div style={{
          background: '#121214',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1rem 1.25rem'
        }}>
          {/* Console Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.6rem',
            fontSize: '0.75rem',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={14} color="#38bdf8" />
              <span style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Standard Output
              </span>
              {isRunning && (
                <span style={{ color: '#f59e0b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  • {runnerStatus.message || 'Executing...'}
                </span>
              )}
            </div>

            {executionTime !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b' }}>
                <Clock size={12} />
                <span>{executionTime}ms</span>
              </div>
            )}
          </div>

          {/* Console Output Screen */}
          <div style={{
            minHeight: '80px',
            maxHeight: '260px',
            overflowY: 'auto',
            background: '#09090b',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.05)',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '0.825rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {isRunning && !output && !errorOutput && (
              <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                Running Python script in WebAssembly worker...
              </div>
            )}

            {!isRunning && !output && !errorOutput && (
              <div style={{ color: '#52525b', fontStyle: 'italic' }}>
                Program output will appear here. Click "Run Code" above.
              </div>
            )}

            {output && (
              <div style={{ color: '#a7f3d0' }}>
                {output}
              </div>
            )}

            {errorOutput && (
              <div style={{ 
                color: '#f87171', 
                marginTop: output ? '0.5rem' : '0', 
                padding: '0.5rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                borderRadius: '4px',
                borderLeft: '3px solid #ef4444'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  <AlertTriangle size={14} />
                  <span>Execution Traceback</span>
                </div>
                {errorOutput}
              </div>
            )}

            {isMatchingExpected && (
              <div style={{
                marginTop: '0.6rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.775rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={14} />
                <span>Output matches expected exercise goal!</span>
              </div>
            )}
          </div>

          {/* Sandbox Security Footer Note */}
          <div style={{
            marginTop: '0.6rem',
            fontSize: '0.7rem',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Code executes inside a client-side WebAssembly sandbox. Host tokens and files are isolated.</span>
            <span>Timeout limit: 8s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
