import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Coins, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import * as Icons from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { useCosmetics } from '../contexts/CosmeticContext';
import { getShopData, purchaseShopItem, equipShopItem, unequipShopItem, getUserInventory } from '../lib/dataService';
import { supabase } from '../lib/supabaseClient';
import { SEO } from '../components/SEO';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } } };

const CATEGORIES = [
  { id: 'badges', label: 'Badges', icon: 'Award' },
  { id: 'titles', label: 'Titles', icon: 'Crown' },
  { id: 'profile_frames', label: 'Frames', icon: 'Square' },
  { id: 'dashboard_themes', label: 'Dash Themes', icon: 'LayoutTemplate' },
  { id: 'sidebar_themes', label: 'Side Themes', icon: 'LayoutSidebar' },
  { id: 'cursor_effects', label: 'Cursors', icon: 'MousePointer2' },
  { id: 'card_styles', label: 'Cards', icon: 'Layers' },
  { id: 'name_colors', label: 'Name Colors', icon: 'Type' },
  { id: 'decorations', label: 'Decorations', icon: 'Sparkles' },
  { id: 'seasonal', label: 'Seasonal', icon: 'PartyPopper' },
];

const RARITY_COLORS = {
  common: 'var(--color-border-subtle)',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#fbbf24',
  mythic: '#ef4444'
};

const RARITY_LABELS = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic'
};

export function Shop() {
  const { user } = useAuth();
  const { equip, unequip } = useCosmetics();
  
  const [activeTab, setActiveTab] = useState('badges');
  const [viewMode, setViewMode] = useState('shop'); // 'shop' | 'inventory'
  
  const [coins, setCoins] = useState(0);
  const [shopItems, setShopItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchShopAndCoins = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [data, invData, { data: profile }] = await Promise.all([
        getShopData(user.id),
        getUserInventory(user.id),
        supabase.from('profiles').select('coins_balance').eq('auth_id', user.id).single()
      ]);

      setCoins(profile?.coins_balance || 0);
      setShopItems(data);
      setInventoryItems(invData);
    } catch (err) {
      console.error("Failed to load shop", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchShopAndCoins();

    if (user) {
      const sub = supabase.channel('shop-coins')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `auth_id=eq.${user.id}` }, (payload) => {
          if (payload.new && payload.new.coins_balance !== undefined) {
            setCoins(payload.new.coins_balance);
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(sub); };
    }
  }, [user, fetchShopAndCoins]);

  const handlePurchase = async (product) => {
    if (coins >= product.price) {
      try {
        setProcessing(product.id);
        const res = await purchaseShopItem(user.id, product.id);
        
        // Optimistically update
        setCoins(res.coins_remaining);
        
        setShopItems(prev => prev.map(i => i.id === product.id ? { ...i, owned: true } : i));
        setInventoryItems(prev => [{ ...product, is_equipped: false, purchased_at: new Date().toISOString() }, ...prev]);

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: [product.color || '#f59e0b', '#3b82f6', '#10b981']
        });
      } catch (err) {
        alert("Purchase failed: " + err.message);
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleEquip = async (product) => {
    try {
      setProcessing(product.id);
      if (product.equipped || (viewMode === 'inventory' && product.is_equipped)) {
        await unequip(product.id || product.shop_item_id);
        // Optimistic update
        setShopItems(prev => prev.map(i => i.id === product.id ? { ...i, equipped: false } : i));
        setInventoryItems(prev => prev.map(i => i.shop_item_id === product.shop_item_id ? { ...i, is_equipped: false } : i));
      } else {
        await equip(product.id || product.shop_item_id);
        // Optimistic update
        setShopItems(prev => prev.map(i => {
          if (i.category === product.category) return { ...i, equipped: i.id === product.id };
          return i;
        }));
        setInventoryItems(prev => prev.map(i => {
          if (i.category === product.category) return { ...i, is_equipped: i.shop_item_id === product.shop_item_id };
          return i;
        }));
      }
    } catch (err) {
      alert("Failed to change equip state: " + err.message);
    } finally {
      setProcessing(null);
    }
  };

  const displayedItems = useMemo(() => {
    if (viewMode === 'inventory') {
      return inventoryItems.filter(i => i.category === activeTab);
    }
    return shopItems.filter(i => i.category === activeTab);
  }, [shopItems, inventoryItems, activeTab, viewMode]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <SEO title="Shop" url="https://revoraa.com/shop" />
        <Loader2 size={36} className="spinner" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <SEO title="Coin Shop" url="https://revoraa.com/shop" />
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <ShoppingCart size={24} color="var(--color-primary)" />
            <h1 style={{ marginBottom: 0 }}>Coin Shop</h1>
          </div>
          <p className="text-secondary">Unlock premium cosmetics and customize your experience.</p>
        </div>
        <div className="bento-card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'color-mix(in srgb, var(--color-revision) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-revision) 20%, transparent)' }}>
          <Coins size={20} color="var(--color-revision)" />
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-revision)' }}>{coins.toLocaleString()}</span>
        </div>
      </header>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn" onClick={() => setViewMode('shop')} style={{ background: viewMode === 'shop' ? 'var(--color-bg-surface-hover)' : 'transparent', color: viewMode === 'shop' ? 'var(--color-strong)' : 'var(--color-text-muted)' }}>
          Shop
        </button>
        <button className="btn" onClick={() => setViewMode('inventory')} style={{ background: viewMode === 'inventory' ? 'var(--color-bg-surface-hover)' : 'transparent', color: viewMode === 'inventory' ? 'var(--color-strong)' : 'var(--color-text-muted)' }}>
          My Inventory
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
        {CATEGORIES.map(tab => {
          const TabIcon = Icons[tab.icon] || Icons.HelpCircle;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="btn"
              style={{
                background: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: activeTab === tab.id ? '#fff' : 'var(--color-text-secondary)',
                border: `1px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border-subtle)'}`,
                display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '9999px', padding: '0.5rem 1rem',
                whiteSpace: 'nowrap'
              }}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <motion.div className="bento-grid" variants={container} initial="hidden" animate="show" key={`${activeTab}-${viewMode}`}>
        {displayedItems.length > 0 ? displayedItems.map((product) => {
          const isOwned = viewMode === 'inventory' || product.owned;
          const isEquipped = viewMode === 'inventory' ? product.is_equipped : product.equipped;
          const ItemIcon = Icons[product.icon_name] || Icons.Sparkles;
          const rarityColor = RARITY_COLORS[product.rarity] || RARITY_COLORS.common;
          const isProcessing = processing === (product.id || product.shop_item_id);

          return (
            <motion.div key={product.id || product.shop_item_id} variants={item} className="bento-card col-span-1" style={{ 
              display: 'flex', flexDirection: 'column',
              borderColor: product.rarity !== 'common' ? `color-mix(in srgb, ${rarityColor} 40%, var(--color-border-subtle))` : 'var(--color-border-subtle)',
              boxShadow: product.rarity !== 'common' ? `0 4px 20px color-mix(in srgb, ${rarityColor} 10%, transparent)` : 'none'
            }}>
              <div style={{ 
                height: 120, borderRadius: 'var(--radius-sm)', 
                background: `linear-gradient(135deg, color-mix(in srgb, ${product.color || rarityColor} 20%, transparent), transparent)`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', 
                border: `1px solid color-mix(in srgb, ${product.color || rarityColor} 30%, transparent)`,
                position: 'relative'
              }}>
                <ItemIcon size={48} color={product.color || rarityColor} />
                
                {/* Rarity Badge */}
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em',
                  padding: '0.15rem 0.4rem', borderRadius: '4px',
                  background: `color-mix(in srgb, ${rarityColor} 20%, transparent)`,
                  color: rarityColor,
                  border: `1px solid color-mix(in srgb, ${rarityColor} 30%, transparent)`
                }}>
                  {RARITY_LABELS[product.rarity] || 'Common'}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', color: product.color || 'var(--color-strong)' }}>{product.name}</h3>
                  {isOwned ? (
                    <CheckCircle2 size={18} color="var(--color-strong)" style={{ opacity: 0.5 }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: coins >= product.price ? 'var(--color-revision)' : 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
                      <Coins size={14} />
                      <span>{product.price}</span>
                    </div>
                  )}
                </div>
                <p className="text-muted text-sm" style={{ marginBottom: '1.5rem' }}>{product.description}</p>
              </div>

              {viewMode === 'shop' && !product.owned && product.is_active && (
                <button 
                  className="btn"
                  disabled={coins < product.price || isProcessing}
                  onClick={() => handlePurchase(product)}
                  style={{
                    width: '100%',
                    background: coins >= product.price ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                    color: coins >= product.price ? '#fff' : 'var(--color-text-muted)',
                    border: `1px solid transparent`,
                    cursor: coins >= product.price ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isProcessing ? <Loader2 size={16} className="spinner" /> : coins >= product.price ? 'Unlock' : 'Not enough coins'}
                </button>
              )}

              {viewMode === 'shop' && !product.owned && !product.is_active && (
                 <button className="btn" disabled style={{ width: '100%', background: 'var(--color-bg-surface)', color: 'var(--color-text-muted)' }}>
                   Coming Soon
                 </button>
              )}

              {isOwned && (
                <button 
                  className="btn"
                  disabled={isProcessing}
                  onClick={() => handleEquip(product)}
                  style={{
                    width: '100%',
                    background: isEquipped ? 'transparent' : 'var(--color-bg-surface-hover)',
                    color: isEquipped ? 'var(--color-strong)' : 'var(--color-text)',
                    border: `1px solid ${isEquipped ? 'var(--color-strong)' : 'var(--color-border-subtle)'}`
                  }}
                >
                  {isProcessing ? <Loader2 size={16} className="spinner" /> : isEquipped ? 'Unequip' : 'Equip'}
                </button>
              )}

            </motion.div>
          );
        }) : (
          <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)' }}>
            <Sparkles size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
              {viewMode === 'inventory' ? "You don't own any items in this category yet." : "No items available in this category."}
            </h3>
            {viewMode === 'inventory' && (
              <button className="btn btn-primary" onClick={() => setViewMode('shop')} style={{ marginTop: '1rem' }}>
                Browse Shop
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
