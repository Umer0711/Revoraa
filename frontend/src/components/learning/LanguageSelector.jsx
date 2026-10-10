import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLearningLanguage } from '../../contexts/LearningLanguageContext';

export function LanguageSelector({ isFallback = false, compact = false }) {
  const { language, setLanguage, supportedLanguages } = useLearningLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentMeta = supportedLanguages.find(l => l.code === language) || supportedLanguages[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: compact ? '0.3rem 0.6rem' : '0.4rem 0.8rem',
          fontSize: '0.8rem',
          minHeight: compact ? '30px' : '34px',
          borderRadius: 'var(--radius-sm, 6px)',
          background: 'var(--color-bg-surface, #27272a)',
          border: isFallback ? '1px solid #f59e0b' : '1px solid var(--color-border-subtle, rgba(255,255,255,0.1))',
          color: 'var(--color-text-primary, #f4f4f5)',
          cursor: 'pointer'
        }}
        title="Change learning language"
        aria-label="Select learning language"
        aria-expanded={isOpen}
      >
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currentMeta.flag}</span>
        <span style={{ fontWeight: 600 }}>{currentMeta.name}</span>
        {isFallback && (
          <span style={{
            fontSize: '0.65rem',
            padding: '1px 5px',
            borderRadius: '4px',
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#f59e0b',
            marginLeft: '2px'
          }}>
            Fallback
          </span>
        )}
        <ChevronDown size={14} style={{ opacity: 0.7, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          zIndex: 100,
          minWidth: '200px',
          background: '#18181b',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          padding: '0.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem'
        }}>
          <div style={{
            padding: '0.4rem 0.6rem',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Learning Language
          </div>

          {supportedLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.5rem 0.65rem',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: 'none',
                  color: isSelected ? '#60a5fa' : 'var(--color-text-primary, #f4f4f5)',
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem' }}>{lang.flag}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{lang.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{lang.nativeName}</div>
                  </div>
                </div>

                {isSelected && <Check size={14} color="#60a5fa" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
