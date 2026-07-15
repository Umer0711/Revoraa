import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Award, Sparkles, Palette, Crown, Coins, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { getShopData, purchaseShopItem } from '../lib/dataService';
import { supabase } from '../lib/supabaseClient';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

const TABS = [
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'decorations', label: 'Decorations', icon: Sparkles },
  { id: 'titles', label: 'Titles', icon: Crown },
  { id: 'themes', label: 'Themes', icon: Palette },
];

export function Shop() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('badges');
  const [coins, setCoins] = useState(0);
  const [items, setItems] = useState({ badges: [], decorations: [], titles: [], themes: [] });
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  const fetchShopAndCoins = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [shopData, { data: stats }] = await Promise.all([
        getShopData(user.id),
        supabase.from('user_stats').select('coins').eq('user_id', user.id).single()
      ]);

      setCoins(stats?.coins || 0);

      const categorized = { badges: [], decorations: [], titles: [], themes: [] };
      shopData.forEach(prod => {
        if (categorized[prod.category]) {
          categorized[prod.category].push(prod);
        }
      });
      setItems(categorized);
    } catch (err) {
      console.error("Failed to load shop", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchShopAndCoins();

    // Subscribe to realtime coin changes
    if (user) {
      const sub = supabase.channel('shop-coins')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_stats', filter: `user_id=eq.${user.id}` }, (payload) => {
          if (payload.new && payload.new.coins !== undefined) {
            setCoins(payload.new.coins);
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(sub); };
    }
  }, [user, fetchShopAndCoins]);

  const handlePurchase = async (category, product) => {
    if (coins >= product.price) {
      try {
        setPurchasing(product.id);
        await purchaseShopItem(user.id, product.id, product.price);
        
        // Optimistically update
        setCoins(prev => prev - product.price);
        setItems(prev => ({
          ...prev,
          [category]: prev[category].map(i => i.id === product.id ? { ...i, owned: true } : i)
        }));

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
        });
      } catch (err) {
        alert("Purchase failed: " + err.message);
      } finally {
        setPurchasing(null);
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 size={36} className="spinner" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <ShoppingCart size={24} color="var(--color-primary)" />
            <h1 style={{ marginBottom: 0 }}>Coin Shop</h1>
          </div>
          <p className="text-secondary">Spend your hard-earned coins on cosmetics and themes.</p>
        </div>
        <div className="bento-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'color-mix(in srgb, var(--color-revision) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-revision) 20%, transparent)' }}>
          <Coins size={20} color="var(--color-revision)" />
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-revision)' }}>{coins.toLocaleString()}</span>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-bg-surface)',
              color: activeTab === tab.id ? '#fff' : 'var(--color-text-secondary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
              display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '9999px', padding: '0.5rem 1rem'
            }}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show" key={activeTab}>
        {items[activeTab]?.length > 0 ? items[activeTab].map((product) => (
          <motion.div key={product.id} variants={item} className="bento-card col-span-1" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 120, borderRadius: 'var(--radius-sm)', background: `linear-gradient(135deg, color-mix(in srgb, ${product.color || '#fff'} 20%, transparent), transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: `1px solid color-mix(in srgb, ${product.color || '#fff'} 20%, transparent)` }}>
              {activeTab === 'badges' && <Award size={48} color={product.color} />}
              {activeTab === 'decorations' && <Sparkles size={48} color={product.color} />}
              {activeTab === 'titles' && <Crown size={48} color={product.color} />}
              {activeTab === 'themes' && <Palette size={48} color={product.color} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.05rem' }}>{product.name}</h3>
                {product.owned ? (
                  <CheckCircle2 size={18} color="var(--color-strong)" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-revision)', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Coins size={14} />
                    <span>{product.price}</span>
                  </div>
                )}
              </div>
              <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>{product.description}</p>
            </div>
            <button 
              className="btn"
              disabled={product.owned || coins < product.price || purchasing === product.id}
              onClick={() => handlePurchase(activeTab, product)}
              style={{
                width: '100%',
                background: product.owned ? 'var(--color-bg-surface)' : (coins >= product.price ? 'var(--color-primary)' : 'var(--color-bg-surface)'),
                color: product.owned ? 'var(--color-strong)' : (coins >= product.price ? '#fff' : 'var(--color-text-muted)'),
                border: `1px solid ${product.owned ? 'var(--color-strong)' : 'transparent'}`,
                cursor: product.owned ? 'default' : (coins >= product.price ? 'pointer' : 'not-allowed')
              }}
            >
              {purchasing === product.id ? <Loader2 size={16} className="spinner" /> : product.owned ? 'Equipped' : (coins >= product.price ? 'Unlock' : 'Not enough coins')}
            </button>
          </motion.div>
        )) : (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No items available in this category.
          </div>
        )}
      </motion.div>
    </div>
  );
}
