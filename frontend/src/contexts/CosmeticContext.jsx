import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { getEquippedItems, equipShopItem, unequipShopItem } from '../lib/dataService';

const CosmeticContext = createContext({});

// Default colors for themes to override CSS custom properties
const THEME_COLORS = {
  'Amber Elite': { '--color-primary': '#f59e0b', '--color-primary-rgb': '245, 158, 11' },
  'Midnight Blue': { '--color-primary': '#1e3a5f', '--color-primary-rgb': '30, 58, 95' },
  'Forest Emerald': { '--color-primary': '#065f46', '--color-primary-rgb': '6, 95, 70' },
  'Purple Nebula': { '--color-primary': '#581c87', '--color-primary-rgb': '88, 28, 135' },
  'Ruby Red': { '--color-primary': '#991b1b', '--color-primary-rgb': '153, 27, 27' },
  'Carbon': { '--color-primary': '#262626', '--color-primary-rgb': '38, 38, 38' },
  'Minimal White': { '--color-primary': '#f8fafc', '--color-primary-rgb': '248, 250, 252' },
  // Default is classic amber
  'default': { '--color-primary': '#f59e0b', '--color-primary-rgb': '245, 158, 11' }
};

const SIDEBAR_COLORS = {
  'Amber': '#f59e0b',
  'Carbon': '#333333',
  'Purple': '#7c3aed',
  'Ocean': '#0284c7',
  'Emerald': '#059669',
  'Crimson': '#dc2626',
  'default': '#f59e0b'
};

export const CosmeticProvider = ({ children }) => {
  const { user } = useAuth();
  const [equippedItems, setEquippedItems] = useState({});
  const [loadingCosmetics, setLoadingCosmetics] = useState(true);

  const fetchCosmetics = useCallback(async () => {
    if (!user) {
      setEquippedItems({});
      setLoadingCosmetics(false);
      return;
    }
    
    try {
      const items = await getEquippedItems(user.id);
      setEquippedItems(items);
      applyThemeStyles(items);
    } catch (err) {
      console.error('Failed to load cosmetics:', err);
    } finally {
      setLoadingCosmetics(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCosmetics();
  }, [fetchCosmetics]);

  // Realtime subscription to inventory changes (equip/unequip)
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase.channel(`inventory_changes_${user.id}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'user_inventory', 
        filter: `user_id=eq.${user.id}` 
      }, () => {
        // Simple re-fetch on any equip/unequip change
        fetchCosmetics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchCosmetics]);

  // Particle cursor effect handling
  useEffect(() => {
    let cursorEffect = equippedItems['cursor_effects'];
    if (!cursorEffect) return;

    // Simple particle implementation
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    let mouseX = -100;
    let mouseY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      particles.push({
        x: mouseX,
        y: mouseY,
        life: 1.0,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const color = cursorEffect.color || '#f59e0b';
      
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = p.life;
          ctx.fill();
        }
      }

      // Remove dead particles
      while(particles.length > 0 && particles[0].life <= 0) {
        particles.shift();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    };
  }, [equippedItems]);

  const applyThemeStyles = (items) => {
    // Apply Dashboard Theme
    const dashboardTheme = items['dashboard_themes'];
    const themeColors = dashboardTheme ? THEME_COLORS[dashboardTheme.name] || THEME_COLORS['default'] : THEME_COLORS['default'];
    
    Object.entries(themeColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // Apply Sidebar Theme
    const sidebarTheme = items['sidebar_themes'];
    const sidebarColor = sidebarTheme ? SIDEBAR_COLORS[sidebarTheme.name] || SIDEBAR_COLORS['default'] : SIDEBAR_COLORS['default'];
    // Assuming sidebar uses --color-primary, we might need a specific var if it diverges, 
    // but for now setting it on the document root if we want it isolated, or just overriding primary in a specific scope.
    // Let's set a specific variable for sidebar so Sidebar.jsx can consume it.
    document.documentElement.style.setProperty('--sidebar-accent', sidebarColor);
  };

  const equip = async (itemId) => {
    if (!user || !itemId) return;
    try {
      await equipShopItem(user.id, itemId);
      await fetchCosmetics();
    } catch (err) {
      console.warn('[Cosmetics] Failed to equip item:', err.message);
      throw err;
    }
  };

  const unequip = async (itemId) => {
    if (!user || !itemId) return;
    try {
      await unequipShopItem(user.id, itemId);
      await fetchCosmetics();
    } catch (err) {
      console.warn('[Cosmetics] Failed to unequip item:', err.message);
      throw err;
    }
  };

  const value = {
    equippedItems,
    loadingCosmetics,
    equip,
    unequip
  };

  return (
    <CosmeticContext.Provider value={value}>
      {children}
    </CosmeticContext.Provider>
  );
};

export const useCosmetics = () => useContext(CosmeticContext);
