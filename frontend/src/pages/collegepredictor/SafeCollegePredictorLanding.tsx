import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  useTheme
} from '@mui/material';
import {
  School, 
  Psychology,
  Timeline,
  Speed,
  VerifiedUser,
  Science,
  LocalHospital,
  Business,
  Gavel,
  MenuBook,
  AutoGraph
} from '@mui/icons-material';

interface CollegePredictorLandingProps {
  onStartPrediction?: () => void;
}

const CollegePredictorLanding: React.FC<CollegePredictorLandingProps> = ({ onStartPrediction }) => {
  const theme = useTheme();

  const streams = [
    {
      name: 'MPC',
      description: 'Mathematics, Physics, Chemistry',
      icon: <Science />,
      color: '#1976d2',
      courses: ['Engineering', 'Medicine', 'Pure Sciences'],
      colleges: '50+'
    },
    {
      name: 'BiPC',
      description: 'Biology, Physics, Chemistry',
      icon: <LocalHospital />,
      color: '#388e3c',
      courses: ['Medicine', 'Pharmacy', 'Life Sciences'],
      colleges: '40+'
    },
    {
      name: 'MEC',
      description: 'Mathematics, Economics, Commerce',
      icon: <Business />,
      color: '#f57c00',
      courses: ['Commerce', 'Management', 'Economics'],
      colleges: '35+'
    },
    {
      name: 'CEC',
      description: 'Civics, Economics, Commerce',
      icon: <Gavel />,
      color: '#7b1fa2',
      courses: ['Law', 'Public Administration', 'Social Sciences'],
      colleges: '30+'
    },
    {
      name: 'HEC',
      description: 'History, Economics, Civics',
      icon: <MenuBook />,
      color: '#c62828',
      courses: ['Arts', 'Humanities', 'Social Work'],
      colleges: '25+'
    }
  ];

  const features = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Predictions',
      description: 'Advanced algorithms analyze your scores and predict admission chances'
    },
    {
      icon: <Timeline />,
      title: 'Real-time Data',
      description: 'Updated cutoffs and trends from latest admission cycles'
    },
    {
      icon: <Speed />,
      title: 'Instant Results',
      description: 'Get comprehensive predictions in seconds'
    },
    {
      icon: <VerifiedUser />,
      title: 'Accurate Analysis',
      description: 'Based on historical data and current trends'
    }
  ];

  const stats = [
    { label: 'Total Colleges', value: '200+' },
    { label: 'Streams Covered', value: '5' },
    { label: 'Success Rate', value: '90%' },
    { label: 'Happy Students', value: '100+' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
            College Predictor
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Predict your college admissions across 5 streams with AI-powered analysis
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 6, fontSize: '1.1rem', opacity: 0.8 }}>
            Get personalized predictions for MPC, BiPC, MEC, CEC, and HEC streams based on your scores and preferences
          </Typography>
          
          <Box display="flex" justifyContent="center" gap={2} mb={6}>
            <Button
              variant="contained"
              size="large"
              onClick={onStartPrediction}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Start Prediction
            </Button>
          </Box>

          {/* Stats */}
          <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: 120
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Streams Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
          5 Comprehensive Streams
        </Typography>
        
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={3}>
          {streams.map((stream, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderTop: `4px solid ${stream.color}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8],
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: stream.color, mr: 2 }}>
                    {stream.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: stream.color }}>
                      {stream.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stream.description}
                    </Typography>
                  </Box>
                </Box>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Popular Courses:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {stream.courses.map((course, idx) => (
                        <Chip
                          key={idx}
                          label={course}
                          size="small"
                          sx={{ bgcolor: `${stream.color}20`, color: stream.color }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      <strong>{stream.colleges}</strong> colleges available
                    </Typography>
                    <Chip
                      icon={<School />}
                      label="Predict Now"
                      clickable
                      onClick={onStartPrediction}
                      sx={{ bgcolor: stream.color, color: 'white' }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
            Why Choose Our Predictor?
          </Typography>
          
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                  }
                }}
              >
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    {feature.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Predict Your Future?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students who have successfully predicted their college admissions
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={onStartPrediction}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              }
            }}
            startIcon={<AutoGraph />}
          >
            Get Your Predictions Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default CollegePredictorLanding;