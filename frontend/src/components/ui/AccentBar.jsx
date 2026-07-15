import React from 'react';

export const AccentBar = ({ color }) => (
  <div style={{
    position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem',
    height: '1px', background: `linear-gradient(to right, transparent, ${color}, transparent)`, opacity: 0.55,
  }} />
);
