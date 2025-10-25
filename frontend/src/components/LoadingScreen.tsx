import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { School } from '@mui/icons-material';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          zIndex: 9999,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              p: 2,
              borderRadius: '16px',
              background: (theme) => 
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: (theme) => theme.shadows[8],
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                },
                '100%': {
                  transform: 'scale(1)',
                },
              },
            }}
          >
            <School sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          {/* Loading indicator */}
          <CircularProgress 
            size={40}
            thickness={4}
            sx={{
              color: 'primary.main',
            }}
          />

          {/* Loading message */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            {message}
          </Typography>

          {/* App name */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: (theme) => 
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mt: 1,
            }}
          >
            CareerVista
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoadingScreen;