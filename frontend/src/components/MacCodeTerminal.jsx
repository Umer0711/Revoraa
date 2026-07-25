import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function MacCodeTerminal({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#1E1E1E',
      borderRadius: '8px',
      border: '1px solid var(--color-border-subtle)',
      overflow: 'hidden',
      marginTop: '1rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Mac Terminal Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        background: '#2D2D2D',
        borderBottom: '1px solid #3d3d3d'
      }}>
        {/* Mac Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }}></div>
        </div>

        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: copied ? '#27C93F' : '#858585',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          title="Copy Code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <div style={{ margin: 0, padding: 0 }}>
        <SyntaxHighlighter 
          language={language} 
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: '#1E1E1E',
            fontSize: '0.85rem',
            borderRadius: '0 0 8px 8px',
            lineHeight: '1.5'
          }}
        >
          {code || '// No visual example provided.'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
