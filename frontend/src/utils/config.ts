// Environment detection and configuration
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isGitHubPages = window.location.hostname.includes('github.io')

// API Configuration
export const getApiConfig = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  
  // If running on GitHub Pages and trying to connect to localhost
  if (isGitHubPages && apiUrl.includes('localhost')) {
    console.warn('🚨 GitHub Pages detected with localhost API - this will not work!')
    console.warn('💡 Consider deploying your backend or using a demo API')
    
    return {
      baseURL: 'https://jsonplaceholder.typicode.com', // Fallback demo API
      isDemoMode: true,
      originalUrl: apiUrl
    }
  }
  
  return {
    baseURL: `${apiUrl}/api`,
    isDemoMode: false,
    originalUrl: apiUrl
  }
}

// Google OAuth Configuration
export const getGoogleClientId = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  
  if (!clientId) {
    console.error('❌ VITE_GOOGLE_CLIENT_ID not configured')
    return null
  }
  
  return clientId
}

// Demo mode banner
export const showDemoModeWarning = () => {
  if (isGitHubPages && getApiConfig().isDemoMode) {
    console.warn(`
🚨 DEMO MODE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is a demo deployment on GitHub Pages.
Backend API features are limited or unavailable.
For full functionality, please run locally:

1. Clone the repository
2. Run: pnpm run dev:env
3. Ensure backend is running on localhost:8080

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `)
  }
}