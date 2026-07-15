import React from 'react';
import { motion } from 'framer-motion';

export const TextReveal = ({ children, delay = 0, style = {}, className = '' }) => {
  // Ensure we safely extract text
  let text = '';
  if (typeof children === 'string') {
    text = children;
  } else if (Array.isArray(children)) {
    text = children.map(child => (typeof child === 'string' ? child : '')).join('');
  } else {
    // Fallback if it's a complex element
    return <div style={style} className={className}>{children}</div>;
  }

  const words = text.split(' ');

  return (
    <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25em', ...style }} className={className}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-flex', overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
          <motion.span
            initial={{ y: '120%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + (i * 0.04)
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
};
