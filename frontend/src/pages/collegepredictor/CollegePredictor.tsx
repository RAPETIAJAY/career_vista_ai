import React, { useState } from 'react';
import { Box, Fade } from '@mui/material';
import SafeCollegePredictorLanding from './SafeCollegePredictorLanding';
import SimpleModernCollegePredictor from './SimpleModernCollegePredictor';
import LoginPrompt from '../../components/LoginPrompt';
import { useAuth } from '../../utils/auth';

// Export interfaces for other components to use
export interface EntranceScore {
  exam: string;
  score: number;
  rank?: number;
  percentile?: number;
  year: number;
}

export interface QuotaInfo {
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  homeState: boolean;
  gender: 'Male' | 'Female' | 'Other';
  pwd: boolean;
  state: string;
}

export interface CollegePrediction {
  college: string;
  course: string;
  category: 'Dream' | 'Target' | 'Safety';
  probability: number;
  fees: number;
  placement: number;
  location: string;
  collegeId: string;
  cutoff2025: number;
  cutoff2024: number;
  cutoffTrend: 'up' | 'down' | 'stable';
  quotaApplicable: boolean;
  quotaBenefit: number;
  nirf2025Rank?: number;
}

const CollegePredictor: React.FC = () => {
  const { user } = useAuth();
  const [showPredictor, setShowPredictor] = useState(false);

  // If user is not logged in, show login prompt
  if (!user) {
    return <LoginPrompt />;
  }

  const handleStartPrediction = () => {
    setShowPredictor(true);
  };

  const handleBackToLanding = () => {
    setShowPredictor(false);
  }; 

  return (
    <Box>
      <Fade in={!showPredictor} timeout={500}>
        <Box sx={{ display: showPredictor ? 'none' : 'block' }}>
          <SafeCollegePredictorLanding onStartPrediction={handleStartPrediction} />
        </Box>
      </Fade>
      
      <Fade in={showPredictor} timeout={500}>
        <Box sx={{ display: showPredictor ? 'block' : 'none' }}>
          <SimpleModernCollegePredictor onBackToLanding={handleBackToLanding} />
        </Box>
      </Fade>
    </Box>
  );
};

export default CollegePredictor;
