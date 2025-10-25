import { Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useState } from 'react'
import { createPortal } from 'react-dom'

import { 
  CircularProgress, 
  Box, 
  ThemeProvider as MuiThemeProvider, 
  CssBaseline,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Zoom,
  Button
} from '@mui/material'
import { Psychology, Close } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import Footer from './pages/layout/footer'
import Header from './pages/layout/header'
import RegisterPage from './pages/auth/register'
import SignInPage from './pages/auth/login'
import { AuthProvider } from './utils/authcontext'
import CareerChatbot from './pages/chatbot/chatbot'
import { useAuth } from './utils/auth'
import ProfileSetupPage from './pages/profile/profile'
import SecureTest from './pages/test/firsttest'
import CollegePredictor from './pages/collegepredictor/CollegePredictor'
import SecureTestResults from './pages/test/SecureTestResults'
import ScholarshipPage from './pages/scholarship/scholarship'
import ProtectedRoute from './components/ProtectedRoute'
import enterpriseTheme from './theme/enterpriseTheme'
//import FloatingAI from './components/FloatingAI'

// Legal pages
import {
  AIUsagePolicyPage,
  IntellectualPropertyPage,
  DataProtectionPage,
  DisclaimerPage,
  PrivacyPolicyPage,
  TermsOfServicePage,
  CookiePolicyPage
} from './pages/legal'

// Company pages
import {
  AboutUsPage,
  CareersPage,
  ContactPage,
  OurTeamPage
} from './pages/company'


// Lazy load pages for better performance with preload hints
const Home = lazy(() => import('./pages/home/home'))
const CareerInsights = lazy(() => import('./pages/careerinsight/careerinsight'))
const Dashboard = lazy(() => import('./pages/dashboard/dashboard'))
const ChatbotPage = lazy(() => import('./pages/chatbot/chatbot'))

// Inner App component that has access to Auth context
function AppContent() {
  const { user } = useAuth();
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();

  // Check if current route should hide header/footer
  const isTestRoute = location.pathname.startsWith('/test/');

  // Create floating chatbot button component
  const FloatingChatbotButton = () => {
    if (isTestRoute) return null;
    
    return createPortal(
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 999999,
          pointerEvents: 'auto',
        }}
      >
        <Zoom in timeout={1000}>
          <Fab
            color="primary"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 6px 30px rgba(0, 0, 0, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
            onClick={() => setChatbotOpen(true)}
          >
            <Psychology sx={{ fontSize: 28, color: 'white' }} />
          </Fab>
        </Zoom>
      </Box>,
      document.body
    );
  };

  return (
    <>
      <Suspense fallback={
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
          }}
          className="animate-fadeInScale"
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress 
              size={48}  
              thickness={4}
              sx={{ 
                color: theme.palette.primary.main,
                mb: 2,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }} 
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              className="animate-fadeInUp animate-delay-200"
            >
              Loading...
            </Typography>
          </Box>
        </Box>
      }>
        {!isTestRoute && <Header />}
        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/" element={<Home />} />
          <Route path="/career-insights" element={<CareerInsights />} />
          <Route path="/scholarships" element={<ScholarshipPage />} />
          <Route path="/college-predictor/*" element={<CollegePredictor />} />
          
          {/* Public-only routes - redirect to dashboard if logged in */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SignInPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <RegisterPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <ChatbotPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test" 
            element={
              <ProtectedRoute>
                <SecureTest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test/academic" 
            element={ 
              <ProtectedRoute>
                <SecureTest />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/test/results" 
            element={
              <ProtectedRoute>
                <SecureTestResults />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile-setup" 
            element={
              <ProtectedRoute>
                <ProfileSetupPage />
              </ProtectedRoute>
            } 
          />

          {/* Legal pages - accessible to everyone */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/ai-usage" element={<AIUsagePolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/intellectual-property" element={<IntellectualPropertyPage />} />
          <Route path="/data-protection" element={<DataProtectionPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />

          {/* Company pages - accessible to everyone */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/team" element={<OurTeamPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Stream recommender - redirect to dashboard for now */}
          <Route 
            path="/stream-recommender" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Scholarship finder - protected route */}
          <Route 
            path="/scholarship-finder" 
            element={
              <ProtectedRoute>
                <ScholarshipPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all route - redirect to home for undefined routes */}
          <Route 
            path="*" 
            element={
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '50vh',
                textAlign: 'center',
                px: 2
              }}>
                <Typography variant="h4" gutterBottom>
                  404 - Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  The page you're looking for doesn't exist.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    onClick={() => window.location.href = '/'}
                  >
                    Go Home
                  </Button>
                  {!user && (
                    <Button 
                      variant="outlined" 
                      onClick={() => window.location.href = '/login'}
                    >
                      Login
                    </Button>
                  )}
                </Box>
              </Box>
            } 
          />
        </Routes>
        
        {!isTestRoute && <Footer />}

        {/* Floating Chatbot Button using Portal */}
        <FloatingChatbotButton />

        {/* Chatbot Modal - Side Panel Style */}
        <Dialog
          open={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          maxWidth={false}
          PaperProps={{
            sx: {
              position: 'fixed',
              right: 20,
              bottom: 90,
              top: 'auto',
              left: 'auto',
              margin: 0,
              width: '400px',
              height: '600px',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.palette.divider}`,
              '@media (max-width: 500px)': {
                width: 'calc(100vw - 40px)',
                right: 20,
                left: 20,
                height: '500px',
              }
            }
          }}
          BackdropProps={{
            sx: {
              backgroundColor: 'transparent',
            }
          }}
          disableScrollLock
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pb: 2,
              pt: 2,
              px: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              borderRadius: '20px 20px 0 0',
              minHeight: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Psychology sx={{ fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                AI Career Counselor
              </Typography>
            </Box>
            <IconButton
              onClick={() => setChatbotOpen(false)}
              sx={{ 
                color: 'white',
                padding: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              size="small"
            >
              <Close sx={{ fontSize: 20 }} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0, height: 'calc(600px - 64px)', overflow: 'hidden' }}>
            <CareerChatbot 
              userClass={user?.class === '10th' ? '10' : '12'}
              userStream={user?.stream}
            />
          </DialogContent>
        </Dialog>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <MuiThemeProvider theme={enterpriseTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </MuiThemeProvider>
  )
}

export default App