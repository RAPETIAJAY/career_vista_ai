import { createContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Helper function to get API URL
const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  return `${baseUrl}/api`
}

// Session configuration
const SESSION_DURATION_DAYS = 2
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000 // 2 days in milliseconds

// Session management helpers
const setSession = (token: string, user: User) => {
  const sessionData = {
    token,
    user,
    loginTime: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  }
  localStorage.setItem('token', token)
  localStorage.setItem('session', JSON.stringify(sessionData))
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

const getSession = () => {
  try {
    const sessionStr = localStorage.getItem('session')
    if (!sessionStr) return null
    
    const session = JSON.parse(sessionStr)
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      console.log('Session expired')
      clearSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error reading session:', error)
    clearSession()
    return null
  }
}

const clearSession = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('session')
  delete axios.defaults.headers.common['Authorization']
}

const isSessionValid = () => {
  const session = getSession()
  return session !== null
}

// Define types
export interface User {
  _id: string
  name?: string
  email: string
  class?: '10th' | '12th'
  board?: 'CBSE' | 'ICSE' | 'State'
  state?: string
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS'
  gender?: 'Male' | 'Female' | 'Other'
  income?: string
  subjects?: Array<{ name: string; marks: number }>
  stream?: 'MPC' | 'BiPC' | 'MEC' | 'CEC' | 'HEC'
  entranceScores?: Array<{ exam: string; score: number }>
  profileCompleted: boolean
  examCompleted?: boolean
  examDate?: Date
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, otp: string) => Promise<void>
  loginWithGoogle: (context?: 'login' | 'register') => Promise<void>
  sendOtp: (email: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  refreshUser: () => Promise<void>
}

// Create context
export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log('🔍 [Auth] Checking for existing session on page load...')
        
        // Check if session exists and is valid
        if (!isSessionValid()) {
          console.log('⚠️ [Auth] No valid session found or session expired')
          setLoading(false)
          return
        }

        const session = getSession()
        console.log('🔍 [Auth] Session retrieved from localStorage:', {
          hasToken: !!session?.token,
          hasUser: !!session?.user,
          userName: session?.user?.name,
          expiresAt: session?.expiresAt,
          isExpired: session?.expiresAt ? Date.now() > session.expiresAt : 'N/A'
        })
        
        if (!session) {
          console.log('⚠️ [Auth] Session object is null')
          setLoading(false)
          return
        }

        // Set axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.token}`
        console.log('🔍 [Auth] Authorization header set for axios')
        
        // Verify token with backend
        try {
          console.log('🔍 [Auth] Calling backend /auth/me...')
          const response = await axios.get(`${getApiUrl()}/auth/me`)
          console.log('🔍 [Auth] Backend /me response:', response.data)
          // Backend returns { success: true, user: {...} }
          const userData = response.data.user || response.data
          setUser(userData)
          console.log('✅ [Auth] Session restored successfully! User:', userData)
        } catch (err: any) {
          console.error('❌ [Auth] Token verification failed:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
          })
          clearSession()
          setUser(null)
        }
      } catch (err) {
        console.error('❌ [Auth] Session check error:', err)
        clearSession()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Send OTP for login
  const sendOtp = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      await axios.post(`${getApiUrl()}/auth/send-otp`, { email })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login with email and OTP
  const login = async (email: string, otp: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.post(`${getApiUrl()}/auth/verify-otp`, { email, otp })
      const { token, user } = response.data
      
      // Set session with 2-day expiry
      setSession(token, user)
      setUser(user)

      console.log('Login successful - Session created with 2-day expiry')

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Login with Google
  const loginWithGoogle = async (context: 'login' | 'register' = 'login') => {
    try {
      console.log('🔍 [Google Auth] Starting Google authentication...', { context })
      setLoading(true)
      setError(null)

      // Check if running on GitHub Pages (demo mode)
      const isGitHubPages = window.location.hostname.includes('github.io')
      if (isGitHubPages) {
        console.warn('🚨 [Google Auth] Demo mode detected - Google OAuth disabled')
        throw new Error('Google authentication is disabled in demo mode. Please run locally for full functionality.')
      }

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
      console.log('🔍 [Google Auth] Client ID:', clientId ? 'Found' : 'Missing')
      
      if (!clientId || clientId.trim() === '') {
        console.error('❌ [Google Auth] No client ID found in environment')
        throw new Error('Google Client ID not configured. Please check your environment variables.')
      }

      // Load Google Identity Services script
      console.log('🔍 [Google Auth] Loading Google Identity Services script...')
      await new Promise<void>((resolve, reject) => {
        if ((window as any).google?.accounts?.id) {
          console.log('✅ [Google Auth] Script already loaded')
          return resolve()
        }
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => {
          console.log('✅ [Google Auth] Script loaded successfully')
          resolve()
        }
        script.onerror = () => {
          console.error('❌ [Google Auth] Failed to load script')
          reject(new Error('Failed to load Google Identity Services'))
        }
        document.head.appendChild(script)
      })

      let credential: string | null = null

      try {
        console.log('🔍 [Google Auth] Trying One Tap method...')
        // Try One Tap first
        credential = await new Promise<string>((resolve, reject) => {
          const google = (window as any).google
          google.accounts.id.initialize({
            client_id: clientId,
            callback: (resp: any) => {
              if (resp?.credential) {
                console.log('✅ [Google Auth] One Tap credential received')
                resolve(resp.credential)
              } else {
                console.error('❌ [Google Auth] No credential in One Tap response')
                reject(new Error('No credential received from One Tap'))
              }
            },
          })
          
          // Show One Tap prompt with timeout
          google.accounts.id.prompt((notification: any) => {
            if (notification?.isNotDisplayed() || notification?.isSkippedMoment()) {
              console.log('⚠️ [Google Auth] One Tap not displayed:', notification)
              reject(new Error('One Tap not displayed'))
            }
          })

          // Timeout after 3 seconds if One Tap doesn't respond
          setTimeout(() => {
            console.log('⏱️ [Google Auth] One Tap timeout')
            reject(new Error('One Tap timeout'))
          }, 3000)
        })
      } catch (oneTapError) {
        console.log('⚠️ [Google Auth] One Tap failed, trying renderButton method:', oneTapError)
        
        // Fallback to renderButton method
        credential = await new Promise<string>((resolve, reject) => {
          try {
            const google = (window as any).google
            
            // Create a temporary container for the Google button
            const buttonContainer = document.createElement('div')
            buttonContainer.id = 'temp-google-signin'
            buttonContainer.style.position = 'absolute'
            buttonContainer.style.left = '-9999px'
            buttonContainer.style.visibility = 'hidden'
            document.body.appendChild(buttonContainer)

            console.log('🔍 [Google Auth] Button container created')

            google.accounts.id.initialize({
              client_id: clientId,
              callback: (resp: any) => {
                console.log('🔍 [Google Auth] Button callback received:', { hasCredential: !!resp?.credential })
                document.body.removeChild(buttonContainer)
                if (resp?.credential) {
                  console.log('✅ [Google Auth] Button method credential received')
                  resolve(resp.credential)
                } else {
                  console.error('❌ [Google Auth] No credential in button response')
                  reject(new Error('No credential received from button method'))
                }
              }
            })

            console.log('🔍 [Google Auth] Rendering button...')
            google.accounts.id.renderButton(buttonContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'medium',
              text: 'continue_with',
              shape: 'rectangular'
            })

            // Auto-click the button
            setTimeout(() => {
              const button = buttonContainer.querySelector('div[role="button"]') as HTMLElement
              console.log('🔍 [Google Auth] Looking for button to click:', { found: !!button })
              if (button) {
                console.log('🔍 [Google Auth] Clicking button...')
                button.click()
              } else {
                console.error('❌ [Google Auth] Button not found in DOM')
                document.body.removeChild(buttonContainer)
                reject(new Error('Google sign-in button not found'))
              }
            }, 500)

            // Timeout after 30 seconds
            setTimeout(() => {
              console.log('⏱️ [Google Auth] Button method timeout')
              if (buttonContainer.parentNode) {
                document.body.removeChild(buttonContainer)
              }
              reject(new Error('Google sign-in timeout'))
            }, 30000)
          } catch (error) {
            console.error('❌ [Google Auth] Button method error:', error)
            reject(error)
          }
        })
      }

      if (!credential) {
        console.error('❌ [Google Auth] No credential obtained')
        throw new Error('Failed to get Google credential')
      }

      console.log('🚀 [Google Auth] Sending credential to backend...', { 
        apiUrl: getApiUrl(), 
        context,
        credentialLength: credential.length 
      })
      // Send credential to backend
      const response = await axios.post(`${getApiUrl()}/auth/google`, { 
        token: credential,
        context: context 
      })
      console.log('✅ [Google Auth] Backend response received:', {
        status: response.status,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      })
      
      const { token, user } = response.data
      
      // Set session with 2-day expiry
      setSession(token, user)
      setUser(user)

      console.log('✅ [Google Auth] Google sign-in successful! Session created', {
        userId: user?.id,
        profileCompleted: user?.profileCompleted
      })
      
      // Navigate to dashboard
      console.log('🔍 [Google Auth] Navigating to dashboard')
      navigate('/dashboard')
    } catch (err: any) {
      console.error('❌ [Google Auth] Error occurred:', {
        message: err.message,
        status: err.response?.status,
        responseData: err.response?.data,
        fullError: err
      })
      
      // Handle account already exists for registration context
      if (err.response?.status === 409 && err.response?.data?.code === 'ACCOUNT_EXISTS') {
        console.log('⚠️ [Google Auth] Account exists, redirecting to login...')
        // Don't set error here - let the calling component handle it
        // Still redirect to login after delay
        setTimeout(() => {
          navigate('/login')
        }, 3000)
        
        // Throw the original error with additional info
        const accountExistsError = new Error('Account already exists! Please sign in instead.')
        accountExistsError.name = 'ACCOUNT_EXISTS'
        ;(accountExistsError as any).originalError = err
        throw accountExistsError
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Google sign-in failed'
      setError(errorMessage)
      console.error('❌ [Google Auth] Final error:', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      setLoading(true)
      
      // Clear session and remove all auth data
      clearSession()
      setUser(null)
      
      console.log('Logout successful - Session destroyed')
      
      // Redirect to home page
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Logout failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.put(`${getApiUrl()}/profile/update`, profileData)
      const updated = response.data?.user || response.data
      setUser(updated)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data from backend
  const refreshUser = async () => {
    try {
      setError(null)
      const response = await axios.get(`${getApiUrl()}/auth/me`)
      const userData = response.data.user || response.data
      setUser(userData)
      
      // Update session storage with fresh user data
      const session = getSession()
      if (session) {
        setSession(session.token, userData)
      }
      
      console.log('User data refreshed successfully', userData)
    } catch (err: any) {
      console.error('Failed to refresh user data:', err)
      setError(err.response?.data?.message || 'Failed to refresh user data')
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        loginWithGoogle,
        sendOtp,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}