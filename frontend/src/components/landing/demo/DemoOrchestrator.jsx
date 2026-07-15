import React, { useState, useEffect, useRef } from 'react';
import { DesktopShell } from './DesktopShell';
import { DemoProvider } from './DemoContext';

import { DashboardView } from './views/DashboardView';
import { LibraryView } from './views/LibraryView';
import { RevisionView } from './views/RevisionView';
import { AnalyticsView } from './views/AnalyticsView';
import { ReadinessView } from './views/ReadinessView';
import { AchievementsView } from './views/AchievementsView';

export const DemoOrchestrator = ({ onStateChange }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [viewStep, setViewStep] = useState(0); 
  const [cursorTarget, setCursorTarget] = useState(null);
  
  const cursorResolver = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // Notify parent (LandingProductTour) so it can change the text on the left
  useEffect(() => {
    if (onStateChange) onStateChange(activeView);
  }, [activeView, onStateChange]);

  const clickTarget = (id) => {
    return new Promise((resolve) => {
      cursorResolver.current = resolve;
      setCursorTarget(id);
    });
  };

  const handleCursorComplete = () => {
    if (cursorResolver.current) {
      const resolve = cursorResolver.current;
      cursorResolver.current = null;
      setCursorTarget(null);
      resolve();
    }
  };

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  useEffect(() => {
    // Adding a slight initial delay before starting the loop
    const startLoop = async () => {
      await wait(1000);
      if (!isMountedRef.current) return;

      while (isMountedRef.current) {
        // --- DASHBOARD ---
        setActiveView('dashboard');
        setViewStep(0);
        await wait(2000);
        if (!isMountedRef.current) break;
        
        await clickTarget('nav-library');
        if (!isMountedRef.current) break;

        // --- LIBRARY ---
        setActiveView('library');
        setViewStep(0);
        await wait(1000);
        if (!isMountedRef.current) break;

        await clickTarget('btn-add-problem');
        if (!isMountedRef.current) break;
        
        setViewStep(1); // Triggers popup and typing in LibraryView
        await wait(2500); // Wait for typing to finish
        if (!isMountedRef.current) break;

        await clickTarget('nav-revision');
        if (!isMountedRef.current) break;

        // --- REVISION ---
        setActiveView('revision');
        setViewStep(0);
        await wait(1000);
        if (!isMountedRef.current) break;

        await clickTarget('node-graph');
        if (!isMountedRef.current) break;
        
        setViewStep(1); // Node expands/shows details
        await wait(2500);
        if (!isMountedRef.current) break;

        await clickTarget('nav-analytics');
        if (!isMountedRef.current) break;

        // --- ANALYTICS ---
        setActiveView('analytics');
        setViewStep(0); // Starts chart population automatically
        await wait(3500); // Wait for charts to populate
        if (!isMountedRef.current) break;

        await clickTarget('nav-readiness');
        if (!isMountedRef.current) break;

        // --- READINESS ---
        setActiveView('readiness');
        setViewStep(0);
        await wait(1000);
        if (!isMountedRef.current) break;

        await clickTarget('btn-weak-topics');
        if (!isMountedRef.current) break;
        
        setViewStep(1); // Shows weak topics popout
        await wait(2500);
        if (!isMountedRef.current) break;

        await clickTarget('nav-gamification');
        if (!isMountedRef.current) break;

        // --- GAMIFICATION ---
        setActiveView('gamification');
        setViewStep(0);
        await wait(1000);
        if (!isMountedRef.current) break;

        await clickTarget('btn-claim-reward');
        if (!isMountedRef.current) break;
        
        setViewStep(1); // Triggers XP fill and level up
        await wait(3500);
        if (!isMountedRef.current) break;

        await clickTarget('nav-dashboard');
        if (!isMountedRef.current) break;
      }
    };

    startLoop();
  }, []);

  return (
    <DemoProvider>
      <DesktopShell 
        activeTab={activeView} 
        activeTargetId={cursorTarget} 
        onCursorActionComplete={handleCursorComplete}
      >
        {activeView === 'dashboard' && <DashboardView step={viewStep} />}
        {activeView === 'library' && <LibraryView step={viewStep} />}
        {activeView === 'revision' && <RevisionView step={viewStep} />}
        {activeView === 'analytics' && <AnalyticsView step={viewStep} />}
        {activeView === 'readiness' && <ReadinessView step={viewStep} />}
        {activeView === 'gamification' && <AchievementsView step={viewStep} />}
      </DesktopShell>
    </DemoProvider>
  );
};
