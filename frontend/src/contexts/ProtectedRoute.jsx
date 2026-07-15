import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Wait until AuthContext finishes loading

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Removed the onboarding redirect to allow immediate Dashboard access for new users
  // if (profile && !profile.has_completed_onboarding && location.pathname !== '/onboarding') {
  //   return <Navigate to="/onboarding" replace />;
  // }

  return children;
};
