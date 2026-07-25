import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RealtimeProvider } from './contexts/RealtimeContext';
import { ProtectedRoute } from './contexts/ProtectedRoute';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalCelebrations } from './components/ui/GlobalCelebrations';
import { WelcomeCelebration } from './components/ui/WelcomeCelebration';
import { FEATURES } from './lib/features';

const Dashboard       = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const ProblemLibrary  = lazy(() => import('./pages/ProblemLibrary').then(module => ({ default: module.ProblemLibrary })));
const ProblemDetail   = lazy(() => import('./pages/ProblemDetail').then(module => ({ default: module.ProblemDetail })));
const Analytics       = lazy(() => import('./pages/Analytics').then(module => ({ default: module.Analytics })));
const Revision        = lazy(() => import('./pages/Revision').then(module => ({ default: module.Revision })));
const Profile         = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const AddProblem      = lazy(() => import('./pages/AddProblem').then(module => ({ default: module.AddProblem })));
const Notifications   = lazy(() => import('./pages/Notifications').then(module => ({ default: module.Notifications })));
const Settings        = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Shop            = lazy(() => import('./pages/Shop').then(module => ({ default: module.Shop })));
const Roadmap         = lazy(() => import('./pages/Roadmap').then(module => ({ default: module.Roadmap })));
const DSAAtlas        = lazy(() => import('./pages/DSAAtlas').then(module => ({ default: module.DSAAtlas })));
const Readiness       = lazy(() => import('./pages/Readiness').then(module => ({ default: module.Readiness })));
const Patterns        = lazy(() => import('./pages/Patterns').then(module => ({ default: module.Patterns })));
const Mistakes        = lazy(() => import('./pages/Mistakes').then(module => ({ default: module.Mistakes })));
const Achievements    = lazy(() => import('./pages/Achievements').then(module => ({ default: module.Achievements })));
const Levels          = lazy(() => import('./pages/Levels').then(module => ({ default: module.Levels })));
const Missions        = lazy(() => import('./pages/Missions').then(module => ({ default: module.Missions })));
const Support         = lazy(() => import('./pages/Support').then(module => ({ default: module.Support })));
const Pricing         = lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminMonitoring = lazy(() => import('./pages/AdminMonitoring').then(module => ({ default: module.AdminMonitoring })));

// ─── Auth & Public Pages ──────────────────────────────────────────────────────
const Landing         = lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })));
const Login           = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const SignUp          = lazy(() => import('./pages/SignUp').then(module => ({ default: module.SignUp })));
const ForgotPassword  = lazy(() => import('./pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword   = lazy(() => import('./pages/ResetPassword').then(module => ({ default: module.ResetPassword })));
const Onboarding      = lazy(() => import('./pages/Onboarding').then(module => ({ default: module.Onboarding })));
const OAuthLoading    = lazy(() => import('./pages/OAuthLoading').then(module => ({ default: module.OAuthLoading })));
const OAuthCallback   = lazy(() => import('./pages/OAuthCallback').then(module => ({ default: module.OAuthCallback })));
const OAuthFailed     = lazy(() => import('./pages/OAuthFailed').then(module => ({ default: module.OAuthFailed })));

// ─── Page Transition Wrapper ─────────────────────────────────────────────────
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -8, scale: 0.99 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);

// ─── Accent Bar helper ────────────────────────────────────────────────────────
const AccentBar = ({ color }) => (
  <div style={{
    position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem',
    height: '1px', background: `linear-gradient(to right, transparent, ${color}, transparent)`, opacity: 0.55,
  }} />
);

// ─── Admin Route ─────────────────────────────────────────────────────────────
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  if (!user || (user.email !== 'umer221107@gmai.com' && user.email !== 'umer221107@gmail.com')) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── 404 ─────────────────────────────────────────────────────────────────────
const NotFound = () => (
  <PageWrapper>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
        <p style={{ fontSize: '6rem', fontWeight: 800, letterSpacing: '-0.06em', color: 'var(--color-text-muted)' }}>404</p>
        <h2 style={{ marginBottom: '0.5rem' }}>Page not found</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>The page you're looking for doesn't exist or was moved.</p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Return Home</Link>
      </motion.div>
    </div>
  </PageWrapper>
);

// ─── Animated Routes ──────────────────────────────────────────────────────────
// ─── Global Suspense Fallback ────────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary-subtle)', border: '2px solid var(--color-primary)' }}
    />
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAuthRoute = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/onboarding', '/auth/loading', '/auth/callback', '/auth/error'].includes(location.pathname);

  const content = (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          {/* Public / Auth Routes */}
          <Route path="/"              element={<PageWrapper><Landing /></PageWrapper>} />
          <Route path="/login"         element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/signup"        element={<PageWrapper><SignUp /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/reset-password"  element={<PageWrapper><ResetPassword /></PageWrapper>} />
          <Route path="/onboarding"    element={<PageWrapper><Onboarding /></PageWrapper>} />
          <Route path="/auth/loading"  element={<PageWrapper><OAuthLoading /></PageWrapper>} />
          <Route path="/auth/callback" element={<PageWrapper><OAuthCallback /></PageWrapper>} />
          <Route path="/auth/error"    element={<PageWrapper><OAuthFailed /></PageWrapper>} />

          {/* Dashboard Routes */}
          <Route path="/dashboard"     element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/library"       element={<ProtectedRoute><PageWrapper><ProblemLibrary /></PageWrapper></ProtectedRoute>} />
          <Route path="/library/:id"   element={<ProtectedRoute><PageWrapper><ProblemDetail /></PageWrapper></ProtectedRoute>} />
          <Route path="/add-problem"   element={<ProtectedRoute><PageWrapper><AddProblem /></PageWrapper></ProtectedRoute>} />
          <Route path="/revision"      element={<ProtectedRoute><PageWrapper><Revision /></PageWrapper></ProtectedRoute>} />
          <Route path="/analytics"     element={<ProtectedRoute><PageWrapper><Analytics /></PageWrapper></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />
          <Route path="/roadmap"       element={<ProtectedRoute><PageWrapper><Roadmap /></PageWrapper></ProtectedRoute>} />
          <Route path="/dsa-atlas"     element={<ProtectedRoute><PageWrapper><DSAAtlas /></PageWrapper></ProtectedRoute>} />
          <Route path="/readiness"     element={<ProtectedRoute><PageWrapper><Readiness /></PageWrapper></ProtectedRoute>} />
          <Route path="/patterns"      element={<ProtectedRoute><PageWrapper><Patterns /></PageWrapper></ProtectedRoute>} />
          <Route path="/mistakes"      element={<ProtectedRoute><PageWrapper><Mistakes /></PageWrapper></ProtectedRoute>} />
          <Route path="/achievements"  element={<ProtectedRoute><PageWrapper><Achievements /></PageWrapper></ProtectedRoute>} />
          <Route path="/shop"          element={<ProtectedRoute><PageWrapper><Shop /></PageWrapper></ProtectedRoute>} />
          <Route path="/levels"        element={<ProtectedRoute><PageWrapper><Levels /></PageWrapper></ProtectedRoute>} />
          <Route path="/missions"      element={<ProtectedRoute><PageWrapper><Missions /></PageWrapper></ProtectedRoute>} />
          <Route path="/settings"      element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
          <Route path="/support"       element={<ProtectedRoute><PageWrapper><Support /></PageWrapper></ProtectedRoute>} />
          {FEATURES.PREMIUM && (
            <Route path="/pricing"       element={<ProtectedRoute><PageWrapper><Pricing /></PageWrapper></ProtectedRoute>} />
          )}
          <Route path="/admin"         element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
          <Route path="/admin/monitoring" element={<AdminRoute><PageWrapper><AdminMonitoring /></PageWrapper></AdminRoute>} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );

  return isAuthRoute ? content : <Layout>{content}</Layout>;
};

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <GlobalCelebrations />
      <WelcomeCelebration />
      <AnimatedRoutes />
    </Router>
  );
}
