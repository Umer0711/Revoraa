import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LandingPricing } from '../components/landing/LandingPricing';
import { RevoraaLogo } from '../components/RevoraaLogo';
import { SEO } from '../components/SEO';


export const Pricing = () => {
  const { user, subscriptionData, usageData } = useAuth();
  
  const isPremium = subscriptionData && subscriptionData.status === 'active';
  const planName = subscriptionData?.plan_id?.includes('Yearly') ? 'Pro Yearly' : (subscriptionData?.plan_id?.includes('Monthly') ? 'Pro Monthly' : 'Free Plan');
  const usageLimit = usageData?.monthly_problem_limit || 15;
  const usageCurrent = usageData?.problems_added_this_month || 0;
  const usageRemaining = Math.max(0, usageLimit - usageCurrent);
  
  const resetDate = usageData?.usage_reset_date 
    ? new Date(usageData.usage_reset_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const renewalDate = subscriptionData?.current_period_end 
    ? new Date(subscriptionData.current_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
      <SEO title="Pricing" url="https://revoraa.com/pricing" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Subscription & Billing</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your plan, billing history, and usage limits.</p>
      </motion.div>

      {/* Current Plan Overview */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
        style={{ 
          background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', 
          borderRadius: '1.5rem', padding: '2rem', marginBottom: '3rem',
          display: 'flex', flexDirection: 'column', gap: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.5rem', background: isPremium ? 'rgba(255,171,0,0.1)' : 'var(--color-bg-light)', borderRadius: '0.75rem' }}>
                <Zap size={24} color={isPremium ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Current Plan</h3>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: isPremium ? 'var(--color-primary)' : 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {planName}
                  {isPremium && <CheckCircle2 size={20} color="var(--color-strong)" />}
                </h2>
              </div>
            </div>
            
            {isPremium ? (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                Your plan is currently <span style={{ color: 'var(--color-strong)', fontWeight: 600 }}>Active</span> and will renew on {renewalDate}.
              </p>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                You are currently on the Free Tier with limited problems tracking.
              </p>
            )}
          </div>

          {/* Usage Stats */}
          <div style={{ minWidth: '250px', flex: 1, maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Monthly Usage</span>
              <span style={{ fontWeight: 700, color: isPremium ? 'var(--color-primary)' : (usageCurrent >= usageLimit ? 'var(--color-mistakes)' : 'var(--color-text-primary)') }}>
                {isPremium ? 'Unlimited' : `${usageCurrent} / ${usageLimit}`}
              </span>
            </div>
            
            {!isPremium && (
              <>
                <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-light)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${Math.min(100, (usageCurrent / usageLimit) * 100)}%` }} 
                    style={{ height: '100%', background: usageCurrent >= usageLimit ? 'var(--color-mistakes)' : 'var(--color-primary)', borderRadius: '4px' }} 
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>{usageRemaining} {usageRemaining === 1 ? 'problem' : 'problems'} remaining</span>
                  <span>Resets on {resetDate}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {isPremium ? (
            <button style={{ background: 'var(--color-bg-light)', border: '1px solid var(--color-border)', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'not-allowed', opacity: 0.5 }}>
              <CreditCard size={18} /> Manage Billing (Coming Soon)
            </button>
          ) : (
            <a href="#upgrade-section" style={{ background: 'var(--color-primary)', color: '#000', textDecoration: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} /> Upgrade to Pro
            </a>
          )}
        </div>
      </motion.div>

      {/* Embedded Landing Pricing if they are not premium, or they want to upgrade */}
      {!isPremium && (
        <motion.div id="upgrade-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Choose the Right Plan for You</h2>
          <LandingPricing />
        </motion.div>
      )}
    </div>
  );
};
