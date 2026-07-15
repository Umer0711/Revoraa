import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { RealtimeProvider } from './contexts/RealtimeContext.jsx'
import { CosmeticProvider } from './contexts/CosmeticContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

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
