import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowRight, Tag } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

export const LandingPricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'GLITCHIVY') {
      setCouponApplied(true);
    } else {
      setCouponApplied(false);
    }
  };

  
  const handleUpgrade = async () => {
    if (!user) {
      navigate('/signup?redirect=pricing');
      return;
    }
    
    try {
      setLoading(true);
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay-create-order', {
        body: { 
          planId: billingCycle === 'yearly' ? 'Yearly Pro' : 'Monthly Pro',
          interval: billingCycle === 'yearly' ? 'year' : 'month',
          couponCode: couponApplied ? 'GLITCHIVY' : null
        }
      });
      
      if (orderError) {
        let err = orderError.message;
        try {
          if (orderError.context && typeof orderError.context.json === 'function') {
            const res = await orderError.context.json();
            if (res.error) err = res.error;
          }
        } catch(e) {}
        if (err === 'Unauthorized' || err?.includes('Unauthorized')) {
          await supabase.auth.signOut();
          alert('Your session has expired. Please log in again to continue.');
          window.location.href = '/login?redirect=pricing';
          return;
        }
        throw new Error(err || 'Failed to create order');
      }
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Revoraa',
        description: `Pro ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const { error: verifyError } = await supabase.functions.invoke('razorpay-verify', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planInterval: billingCycle === 'yearly' ? 'year' : 'month',
                finalPrice: orderData.finalPrice,
                couponId: orderData.couponId,
                couponCode: couponApplied ? 'GLITCHIVY' : null
              }
            });
            if (verifyError) {
              let err = verifyError.message;
              try {
                if (verifyError.context && typeof verifyError.context.json === 'function') {
                  const res = await verifyError.context.json();
                  if (res.error) err = res.error;
                }
              } catch (e) {}
              
              if (err === 'Unauthorized' || err?.includes('Unauthorized')) {
                await supabase.auth.signOut();
                alert('Session expired. Please log in again.');
                window.location.href = '/login';
                return;
              }
              throw new Error(err || 'Failed to verify payment');
            }
            
            await refreshProfile();
            navigate('/dashboard');
          } catch (err) {
            alert('Payment verification failed: ' + err.message);
          }
        },
        prefill: {
          email: user.email
        },
        theme: {
          color: '#FFAB00'
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Error initializing checkout: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getMonthlyPrice = () => couponApplied ? 99 : 149;
  const getYearlyPrice = () => couponApplied ? 999 : 1499;

  return (
    <section id="pricing" style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--color-primary)', filter: 'blur(120px)', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'var(--color-secondary)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 171, 0, 0.1)', color: 'var(--color-primary)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem', border: '1px solid rgba(255, 171, 0, 0.2)' }}
          >
            <Sparkles size={14} /> Premium Access
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a0a0a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Invest in your career
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}
          >
            Unlock the full potential of Revoraa and master data structures and algorithms faster than ever.
          </motion.p>
        </div>

        {/* Toggle & Coupon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-bg-elevated)', padding: '0.35rem', borderRadius: '2rem', border: '1px solid var(--color-border)' }}>
            <button 
              onClick={() => setBillingCycle('monthly')}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '1.5rem', fontSize: '0.9rem', fontWeight: 600, color: billingCycle === 'monthly' ? '#fff' : 'var(--color-text-muted)', background: billingCycle === 'monthly' ? 'var(--color-bg-light)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '1.5rem', fontSize: '0.9rem', fontWeight: 600, color: billingCycle === 'yearly' ? '#fff' : 'var(--color-text-muted)', background: billingCycle === 'yearly' ? 'var(--color-bg-light)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease' }}
            >
              Yearly <span style={{ background: 'var(--color-primary)', color: '#000', fontSize: '0.7rem', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontWeight: 700 }}>Save 16%</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
            <Tag size={16} color="var(--color-text-muted)" style={{ marginLeft: '0.5rem' }}/>
            <input 
              type="text" 
              placeholder="Coupon Code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '0.9rem', width: '120px' }}
            />
            <button 
              onClick={handleApplyCoupon}
              style={{ padding: '0.5rem 1rem', background: couponApplied ? 'var(--color-strong)' : 'var(--color-bg-light)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              {couponApplied ? 'Applied ✓' : 'Apply'}
            </button>
          </div>
          {couponApplied && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 500, marginTop: '-0.5rem' }}>
              Launch Offer unlocked! Pricing updated.
            </motion.p>
          )}
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          
          {/* Free Tier */}
          <motion.div
            whileHover={{ y: -5 }}
            style={{ background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)', borderRadius: '1.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Free</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Everything you need to get started.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginRight: '0.2rem' }}>₹</span>0<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, alignSelf: 'flex-end', marginBottom: '0.8rem' }}>/forever</span>
            </div>
            
            <button onClick={handleUpgrade} disabled={loading} style={{ background: 'var(--color-bg-elevated)', color: '#fff', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginBottom: '2rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.target.style.background = 'var(--color-bg-elevated)'}>
              Get Started for Free
            </button>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {[
                '10,000 Coins Signup Bonus',
                '15 new problems per month',
                'Unlimited revisions',
                'Basic analytics & roadmap',
                'Achievements, XP, and Streak',
                'Daily missions',
              ].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <Check size={16} color="var(--color-text-muted)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  {feat}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pro Tier (Popular) */}
          <motion.div
            whileHover={{ y: -5 }}
            style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-primary)', borderRadius: '1.5rem', padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 40px rgba(255, 171, 0, 0.05)' }}
          >
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--color-primary)', color: '#000', padding: '0.4rem 1.5rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Zap size={14}/> {billingCycle === 'yearly' ? 'Best Value' : 'Most Popular'}
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Pro {billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>For serious developers aiming high.</p>
            
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', marginTop: '0.5rem', marginRight: '0.2rem' }}>₹</span>
              <AnimatePresence mode="wait">
                <motion.span key={billingCycle + couponApplied} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  {billingCycle === 'monthly' ? getMonthlyPrice() : getYearlyPrice()}
                </motion.span>
              </AnimatePresence>
              <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500, alignSelf: 'flex-end', marginBottom: '0.8rem' }}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            
            <button onClick={handleUpgrade} disabled={loading} style={{ background: 'var(--color-primary)', color: '#000', border: 'none', padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 14px rgba(255,171,0,0.3)' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(255,171,0,0.4)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(255,171,0,0.3)'; }}>
              Upgrade to Pro <ArrowRight size={16} style={{ display: 'inline', marginLeft: '0.5rem' }}/>
            </button>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                <Check size={16} color="var(--color-primary)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                Everything in Free, plus:
              </li>
              {[
                billingCycle === 'yearly' ? '50,000 Coins Yearly Bonus' : '20,000 Coins Monthly Bonus',
                'Unlimited Problems',
                'Unlimited Revisions',
                'Advanced Analytics',
                'Premium Themes',
                'Priority Support',
                'Early Access to Upcoming Features',
                'Future AI Features',
                'Exclusive Shop Cosmetics',
                'Priority Feature Access',
                'Export data to CSV/JSON',
              ].map((feat, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <Check size={16} color="var(--color-primary)" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  {feat}
                </li>
              ))}
            </ul>
            
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
              Your subscription includes early access to all upcoming premium features.
            </p>
          </motion.div>
        </div>

        {/* Secure Payments Footer */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '4rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <Shield size={16} /> Secure payments powered by Razorpay. Cancel anytime.
        </div>
      </div>
    </section>
  );
};
