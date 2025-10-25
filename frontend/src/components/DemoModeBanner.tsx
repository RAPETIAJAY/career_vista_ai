import React from 'react';
import { Alert, AlertTitle, Box, Typography, Link } from '@mui/material';
import { Info, GitHub } from '@mui/icons-material';
import { isGitHubPages, getApiConfig } from '../utils/config';

const DemoModeBanner: React.FC = () => {
  const apiConfig = getApiConfig();
  
  if (!isGitHubPages || !apiConfig.isDemoMode) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <Alert 
        severity="info" 
        icon={<Info />}
        sx={{ 
          borderRadius: 0,
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <AlertTitle>Demo Mode - Limited Functionality</AlertTitle>
        <Typography variant="body2">
          This is a demo deployment on GitHub Pages. Backend API features are limited. 
          For full functionality, 
          <Link 
            href="https://github.com/career-vista/frontend" 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ mx: 0.5 }}
          >
            <GitHub sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            clone and run locally
          </Link>
          with your backend server.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DemoModeBanner;