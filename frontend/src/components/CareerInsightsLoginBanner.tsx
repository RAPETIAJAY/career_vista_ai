import React from 'react';
import { 
  Alert, 
  Button, 
  Box, 
  Typography,
  Chip,
  Stack
} from '@mui/material';
import { 
  Login as LoginIcon,
  Psychology,
  Assessment,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CareerInsightsLoginBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Alert
      severity="info"
      sx={{
        mb: 3,
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.primary.main}30`,
        background: (theme) => 
          `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
        '& .MuiAlert-icon': {
          color: 'primary.main',
        },
      }}
      icon={<Psychology />}
      action={
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ 
              minWidth: 'auto',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/register')}
            sx={{ 
              minWidth: 'auto',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            Sign Up
          </Button>
        </Stack>
      }
    >
      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          🚀 Unlock Personalized Career Guidance
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Create a free account to get AI-powered career recommendations, personalized skill assessments, and track your learning progress.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            icon={<Psychology sx={{ fontSize: 16 }} />}
            label="AI Career Advisor" 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<Assessment sx={{ fontSize: 16 }} />}
            label="Skill Assessments" 
            size="small" 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            icon={<TrendingUp sx={{ fontSize: 16 }} />}
            label="Progress Tracking" 
            size="small" 
            color="success" 
            variant="outlined" 
          />
        </Box>
      </Box>
    </Alert>
  );
};

export default CareerInsightsLoginBanner;