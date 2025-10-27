// Environment detection and configuration
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isGitHubPages = window.location.hostname.includes('github.io')

// API Configuration
export const getApiConfig = () => {
  // Use Vercel backend by default, fallback to localhost for development
  const apiUrl = import.meta.env.VITE_API_URL || 
    (isDevelopment ? 'http://localhost:8080' : 'https://career-vista-background.vercel.app')
  
  // If running on GitHub Pages and trying to connect to localhost
  if (isGitHubPages && apiUrl.includes('localhost')) {
    console.warn('🚨 GitHub Pages detected with localhost API - this will not work!')
    console.warn('💡 Using production backend instead')
    
    return {
      baseURL: 'https://career-vista-background.vercel.app/api',
      isDemoMode: false,
      originalUrl: 'https://career-vista-background.vercel.app'
    }
  }
  
  return {
    baseURL: `${apiUrl}/api`,
    isDemoMode: false,
    originalUrl: apiUrl
  }
}

// Get API URL (strips quotes if present)
export const getApiUrl = () => {
  const isDev = import.meta.env.DEV
  let apiUrl = import.meta.env.VITE_API_URL || ''
  
  // Remove quotes if present in environment variable
  apiUrl = apiUrl.replace(/^[""'']|[""'']$/g, '')
  
  // Use localhost in dev, env variable or fallback in production
  return isDev ? 'http://localhost:8080' : (apiUrl || 'https://career-vista-background.vercel.app')
}

// Google OAuth Configuration
export const getGoogleClientId = () => {
  let clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''709011218301-9pndhvj533hm93lgbn9oec1qgm551dta.apps.googleusercontent.com''
  
  // Remove quotes if present in environment variable
  clientId = clientId.replace(/^[""'']|[""'']$/g, '')
  
  if (!clientId) {
    console.error('' VITE_GOOGLE_CLIENT_ID not configured'')
    return null
  }
  
  return clientId
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
