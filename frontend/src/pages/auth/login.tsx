import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  useTheme,
  Fade,
} from '@mui/material'
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  School,
  ArrowForward,
} from '@mui/icons-material'
import { useAuth } from '../../utils/auth'

const SignInPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { loginWithGoogle } = useAuth()
  
  // Check if running in demo mode (GitHub Pages)
  const isGitHubPages = window.location.hostname.includes('github.io')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    return `${baseUrl}/api`
  }

  // Handle password-based login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post(`${getApiUrl()}/auth/login`, { 
        email, 
        password 
      })
      
      const { token, user } = response.data
      
      // Store session
      const sessionData = {
        token,
        user,
        loginTime: Date.now(),
        expiresAt: Date.now() + (2 * 24 * 60 * 60 * 1000) // 2 days
      }
      localStorage.setItem('token', token)
      localStorage.setItem('session', JSON.stringify(sessionData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      toast.success('Login successful!')
      
      // Navigate to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from)
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      console.log('🔍 [Login Page] Starting Google login...')
      setIsSubmitting(true)
      await loginWithGoogle('login')
      console.log('✅ [Login Page] Google login successful')
      toast.success('Login successful!')
    } catch (err: any) {
      console.error('❌ [Login Page] Google login error:', {
        name: err.name,
        message: err.message,
        fullError: err
      })
      if (err.name === 'ACCOUNT_EXISTS') {
        toast.error(err.message)
      } else {
        toast.error('Google login failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Logo and Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <School sx={{ fontSize: 36, color: 'white' }} />
              </Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue your career journey
              </Typography>
            </Box>

            {/* Google Sign In Button */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              disabled={isSubmitting || isGitHubPages}
              sx={{
                py: 1.5,
                mb: isGitHubPages ? 1 : 3,
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  background: 'rgba(0, 0, 0, 0.02)',
                },
              }}
            >
              Continue with Google
            </Button>

            {/* Demo Mode Notice */}
            {isGitHubPages && (
              <Typography
                variant="body2"
                color="warning.main"
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'warning.light',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 500
                }}
              >
                🚨 Google Auth disabled in demo mode. Clone and run locally for full functionality.
              </Typography>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mx: 2, fontWeight: 500 }}
              >
                OR
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* Email/Password Login Form */}
            <Box component="form" onSubmit={handlePasswordLogin}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px' }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px' }
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                endIcon={isSubmitting ? null : <ArrowForward />}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            {/* Sign Up Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default SignInPage
