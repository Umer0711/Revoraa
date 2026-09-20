import React, { useState } from 'react';
import { Check, Copy, Code } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function MacCodeTerminal({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);

  // Check if code is valid (not empty and not fake placeholder like "Example logic for ...")
  const isValidCode = Boolean(
    code &&
    typeof code === 'string' &&
    code.trim().length > 0 &&
    !code.trim().startsWith('Example logic for')
  );

  const handleCopy = () => {
    if (!isValidCode) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isValidCode) {
    return (
      <div style={{
        background: 'var(--color-bg-surface, #18181b)',
        borderRadius: '12px',
        border: '1px dashed var(--color-border-subtle, rgba(255,255,255,0.12))',
        padding: '1.5rem',
        marginTop: '0.75rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: 'var(--color-text-muted, #9ca3af)',
        fontSize: '0.9rem'
      }}>
        <Code size={18} />
        <span>Example coming soon</span>
      </div>
    );
  }

  return (
    <div style={{
      background: '#1E1E1E',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      overflow: 'hidden',
      marginTop: '0.75rem',
      marginBottom: '1.25rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Mac Terminal Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.6rem 1rem',
        background: '#252526',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Mac Dots & Language Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9cdcfe', textTransform: 'capitalize' }}>
            {language}
          </span>
        </div>

        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          style={{
            background: copied ? 'rgba(39, 201, 63, 0.15)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${copied ? 'rgba(39, 201, 63, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: copied ? '#4af667' : '#cccccc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.75rem',
            minHeight: '36px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check size={14} color="#4af667" />
              <span>Copied ✓</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighted Code Container with Controlled Scroll */}
      <div style={{ 
        maxHeight: '380px', 
        overflowY: 'auto', 
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <SyntaxHighlighter 
          language={language} 
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem 1.25rem',
            background: '#1E1E1E',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
            minWidth: '100%'
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
