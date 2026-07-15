import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useDemoContext } from './DemoContext';

export const SmartCursor = ({ targetId, onActionComplete }) => {
  const { refs, containerRef } = useDemoContext();
  const [isClicking, setIsClicking] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const isVisible = useMotionValue(0);

  const isMountedRef = useRef(true);
  const initialPositionSet = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!targetId || !containerRef || !refs[targetId]) return;
    
    // Wait a tick for layout shifts from view swapping
    let timeoutId = setTimeout(async () => {
      if (!isMountedRef.current) return;
      
      const targetNode = refs[targetId];
      const containerRect = containerRef.getBoundingClientRect();
      const targetRect = targetNode.getBoundingClientRect();
      
      const targetX = targetRect.left - containerRect.left + (targetRect.width / 2);
      const targetY = targetRect.top - containerRect.top + (targetRect.height / 2);
      
      // If it's the very first movement, snap to a starting position near center
      if (!initialPositionSet.current) {
        x.set(containerRect.width / 2 + 100);
        y.set(containerRect.height / 2 + 100);
        initialPositionSet.current = true;
      }

      // Fade in cursor if not visible
      if (isVisible.get() === 0) {
        animate(isVisible, 1, { duration: 0.3 });
      }
      
      // Natural Spring Movement
      await Promise.all([
        animate(x, targetX, { type: 'spring', stiffness: 100, damping: 25, mass: 1 }),
        animate(y, targetY, { type: 'spring', stiffness: 100, damping: 25, mass: 1 })
      ]);
      
      if (!isMountedRef.current) return;

      // Natural pause over target
      await animate(x, targetX, { duration: 0.15 }); 
      if (!isMountedRef.current) return;
      
      // Click simulation
      setIsClicking(true);
      await animate(x, targetX, { duration: 0.12 });
      setIsClicking(false);
      
      // Tiny pause after click release
      await animate(x, targetX, { duration: 0.1 });
      if (!isMountedRef.current) return;

      onActionComplete();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [targetId, refs, containerRef, x, y, isVisible, onActionComplete]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        x,
        y,
        opacity: isVisible,
        width: 32,
        height: 32,
        pointerEvents: 'none',
        zIndex: 9999,
        marginLeft: -4,
        marginTop: -4,
      }}
      animate={{ scale: isClicking ? 0.9 : 1 }}
      transition={{ duration: 0.1 }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.5 5.5L22.5 17.5L16.5 18.5L20 25.5L17.5 27L14 20L9.5 24.5V5.5Z"
          fill="rgba(0, 0, 0, 0.9)"
          stroke="white"
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.4))' }}
        />
      </svg>
      {/* Click Ripple Effect */}
      {isClicking && (
        <motion.div
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: 4,
            left: 4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.div>
  );
};
