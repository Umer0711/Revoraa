import { useAuth } from '../contexts/AuthContext';
import { supabase } from './supabaseClient';

export const ROLES = {
  FREE: 'free',
  PRO_MONTHLY: 'pro_monthly',
  PRO_YEARLY: 'pro_yearly',
};

// Define permissions structure
const rolePermissions = {
  [ROLES.FREE]: {
    unlimitedProblems: false,
    advancedAnalytics: false,
    emailReports: false,
    exportData: false,
    premiumBadge: false,
  },
  [ROLES.PRO_MONTHLY]: {
    unlimitedProblems: true,
    advancedAnalytics: true,
    emailReports: true,
    exportData: true,
    premiumBadge: true,
  },
  [ROLES.PRO_YEARLY]: {
    unlimitedProblems: true,
    advancedAnalytics: true,
    emailReports: true,
    exportData: true,
    premiumBadge: true,
  },
};

/**
 * Validates if the user's role grants them a specific permission.
 * Never purely rely on this for security; backend must strictly enforce limits.
 */
export function hasPermission(role, permission) {
  const userRole = role || ROLES.FREE;
  const permissions = rolePermissions[userRole];
  if (!permissions) return false;
  return !!permissions[permission];
}

/**
 * React Hook for easily checking permissions in components.
 */
export function usePermissions() {
  const { profile } = useAuth(); // Assuming profile is injected into auth context
  
  const role = profile?.role || ROLES.FREE;

  return {
    isPro: role === ROLES.PRO_MONTHLY || role === ROLES.PRO_YEARLY,
    isProPlus: role === ROLES.PRO_YEARLY,
    canUseUnlimitedProblems: hasPermission(role, 'unlimitedProblems'),
    canAccessAdvancedAnalytics: hasPermission(role, 'advancedAnalytics'),
    canUseEmailReports: hasPermission(role, 'emailReports'),
    canExportData: hasPermission(role, 'exportData'),
  };
}
