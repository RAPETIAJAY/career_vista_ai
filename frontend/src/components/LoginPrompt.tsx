import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Container,
  Chip,
  Stack,
  Alert
} from '@mui/material';
import { 
  Lock, 
  TrendingUp, 
  School, 
  Star,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const LoginPrompt: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is logged in, don't show this prompt
  if (user) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh',
          justifyContent: 'center',
        }}
      >
        {/* Lock Icon */}
        <Box
          sx={{
            p: 3,
            borderRadius: '50%',
            background: (theme) => 
              `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
            border: (theme) => `2px solid ${theme.palette.primary.main}30`,
            mb: 3,
          }}
        >
          <Lock sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: (theme) => 
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Unlock College Predictor
        </Typography>

        {/* Description */}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: '600px', lineHeight: 1.6 }}
        >
          Get personalized college predictions based on your academic performance, 
          entrance exam scores, and preferences.
        </Typography>

        {/* Features Preview */}
        <Card sx={{ mb: 4, maxWidth: '500px', width: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp color="primary" />
              What you'll get:
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  AI-powered college recommendations
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  Admission probability analysis
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  Stream-wise college filtering
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Star sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  Personalized guidance & insights
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Alert */}
        <Alert 
          severity="info" 
          sx={{ mb: 3, maxWidth: '500px' }}
          icon={<School />}
        >
          <Typography variant="body2">
            Create a free account to access our advanced college prediction system
          </Typography>
        </Alert>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login', { state: { from: { pathname: '/college-predictor' } } })}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              background: (theme) => 
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => theme.shadows[8],
              },
              transition: 'all 0.3s ease',
            }}
          >
            Login to Continue
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register', { state: { from: { pathname: '/college-predictor' } } })}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Sign Up Free
          </Button>
        </Stack>

        {/* Additional Info */}
        <Box sx={{ mt: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Chip 
            label="Free Account" 
            color="primary" 
            variant="outlined" 
            size="small" 
          />
          <Chip 
            label="No Credit Card" 
            color="success" 
            variant="outlined" 
            size="small" 
          />
          <Chip 
            label="Instant Access" 
            color="secondary" 
            variant="outlined" 
            size="small" 
          />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPrompt;