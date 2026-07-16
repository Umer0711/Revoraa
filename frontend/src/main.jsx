import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { RealtimeProvider } from './contexts/RealtimeContext.jsx'
import { CosmeticProvider } from './contexts/CosmeticContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import * as Sentry from '@sentry/react'
import posthog from 'posthog-js'
import { telemetryConfig } from './lib/config.js'

// Initialize Sentry
if (telemetryConfig.sentryDsn) {
  Sentry.init({
    dsn: telemetryConfig.sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

// Initialize PostHog
if (telemetryConfig.posthogKey) {
  posthog.init(telemetryConfig.posthogKey, {
    api_host: telemetryConfig.posthogHost,
    autocapture: true,
    capture_pageview: true,
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <CosmeticProvider>
          <RealtimeProvider>
            <App />
          </RealtimeProvider>
        </CosmeticProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
