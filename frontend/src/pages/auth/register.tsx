import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
  Person as PersonIcon,
  School,
  ArrowForward,
} from '@mui/icons-material'
import { useAuth } from '../../utils/auth'

const RegisterPage = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const authContext = useAuth()
  
  console.log('🔍 [Register Page] Auth context:', authContext)
  console.log('🔍 [Register Page] loginWithGoogle available:', typeof authContext.loginWithGoogle)
  
  const { loginWithGoogle } = authContext

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
    return `${baseUrl}/api`
  }

  // Handle registration with password
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post(`${getApiUrl()}/auth/register`, { 
        name,
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
      
      toast.success('Registration successful!')
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Google registration
  const handleGoogleRegister = async () => {
    try {
      console.log('🔍 [Register Page] Starting Google registration...')
      setIsSubmitting(true)
      await loginWithGoogle('register')
      console.log('✅ [Register Page] Google registration successful')
      toast.success('Registration successful!')
    } catch (err: any) {
      console.error('❌ [Register Page] Google registration error:', {
        name: err.name,
        message: err.message,
        fullError: err
      })
      if (err.name === 'ACCOUNT_EXISTS') {
        toast.error(err.message)
      } else {
        toast.error('Google registration failed. Please try again.')
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
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start your career journey with CareerVista
              </Typography>
            </Box>

            {/* Google Sign Up Button */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleRegister}
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                mb: 3,
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

            {/* Registration Form */}
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px' }
                }}
              />

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
                sx={{ mb: 2 }}
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

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px' }
                }}
              />

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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Box>

            {/* Sign In Link */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default RegisterPage
