import { useAuth } from '../contexts/AuthContext';
import { supabase } from './supabaseClient';
import { FEATURES } from './features';

/**
 * Validates if the user's role grants them a specific permission.
 * Never purely rely on this for security; backend must strictly enforce limits.
 */
export function hasPermission(subscriptionData, permission) {
  const isPremium = subscriptionData?.status === 'active';
  
  if (isPremium) return true; // Premium has all permissions for now
  
  // Free-Only Mode bypass
  if (!FEATURES.PREMIUM) return true;

  // Free users permissions
  const permissions = {
    unlimitedProblems: false,
    advancedAnalytics: false,
    emailReports: false,
    exportData: false,
    premiumBadge: false,
    premiumSettings: false,
    companyReadiness: false,
    customRevisionRules: false,
    billingHistory: false
  };
  
  return !!permissions[permission];
}

/**
 * React Hook for easily checking permissions in components.
 */
export function usePermissions() {
  const { subscriptionData } = useAuth();
  
  const isPro = subscriptionData?.status === 'active';

  return {
    isPro,
    isProPlus: isPro && subscriptionData?.plan_id?.includes('Yearly'),
    canUseUnlimitedProblems: hasPermission(subscriptionData, 'unlimitedProblems'),
    canAccessAdvancedAnalytics: hasPermission(subscriptionData, 'advancedAnalytics'),
    canUseEmailReports: hasPermission(subscriptionData, 'emailReports'),
    canExportData: hasPermission(subscriptionData, 'exportData'),
    canAccessPremiumSettings: hasPermission(subscriptionData, 'premiumSettings'),
    canAccessCompanyReadiness: hasPermission(subscriptionData, 'companyReadiness'),
    canUseCustomRevisionRules: hasPermission(subscriptionData, 'customRevisionRules'),
    canAccessBillingHistory: hasPermission(subscriptionData, 'billingHistory'),
  };
}
