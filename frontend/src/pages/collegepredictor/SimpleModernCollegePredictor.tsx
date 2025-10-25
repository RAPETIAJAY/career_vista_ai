import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Stack,
  Avatar,
  Fade,
  alpha
} from '@mui/material';
import {
  LocationOn,
  ArrowBack,
  Science,
  LocalHospital,
  Business,
  Gavel,
  MenuBook
} from '@mui/icons-material';
import api from '@/services/auth';
// Import types from the main CollegePredictor file
interface StreamCollegePredictor {
  stream: 'MPC' | 'BiPC' | 'MEC' | 'CEC' | 'HEC';
  exam: string;
  rank?: number;
  percentile?: number;
}

interface ModernCollegePredictorProps {
  onBackToLanding?: () => void;
}



interface PredictionResponse {
  summary: {
    totalColleges: number;
    safeColleges: number;
    moderateColleges: number;
    ambitiousColleges: number;
  };
  categories: {
    safe: any[];
    moderate: any[];
    ambitious: any[];
  };
}

const SimpleModernCollegePredictor: React.FC<ModernCollegePredictorProps> = ({ onBackToLanding }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<StreamCollegePredictor>({
    stream: 'MPC',
    exam: '',
    rank: undefined,
    percentile: undefined
  });
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  



  const streamConfig = {
    'MPC': {
      name: 'Mathematics, Physics, Chemistry',
      icon: <Science />,
      color: '#1976d2',
      exams: ['JEE Main', 'JEE Advanced'],
      description: 'Engineering & Technology programs',
    },
    'BiPC': {
      name: 'Biology, Physics, Chemistry',
      icon: <LocalHospital />,
      color: '#d32f2f',
      exams: ['NEET'],
      description: 'Medical & Life Sciences programs',
    },
    'MEC': {
      name: 'Mathematics, Economics, Commerce',
      icon: <Business />,
      color: '#388e3c',
      exams: ['CUET', 'IPMAT'],
      description: 'Business & Management programs',
    },
    'CEC': {
      name: 'Commerce, Economics, Civics',
      icon: <Gavel />,
      color: '#f57c00',
      exams: ['CLAT', 'CUET'],
      description: 'Law & Legal Studies programs',
    },
    'HEC': {
      name: 'History, Economics, Civics',
      icon: <MenuBook />,
      color: '#7b1fa2',
      exams: ['CUET'],
      description: 'Humanities & Liberal Arts programs',
    },
  } as const;

  // Helper function to safely get stream config
  const getStreamConfig = (stream: string) => {
    return streamConfig[stream as keyof typeof streamConfig] || streamConfig['MPC'];
  };

  const steps = [
    'Choose Your Stream',
    'Select Entrance Exam',
    'Enter Your Score',
    'Get Predictions'
  ];

  const handleStreamChange = (newStream: string) => {
    setFormData(prev => ({
      ...prev,
      stream: newStream as 'MPC' | 'BiPC' | 'MEC' | 'CEC' | 'HEC',
      exam: '',
      rank: undefined,
      percentile: undefined
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePredict = async () => {
    // Validate based on stream requirements
    const usesRank = ['MPC', 'BiPC', 'CEC'].includes(formData.stream);
    const usesPercentile = ['MEC', 'HEC'].includes(formData.stream);
    
    if (!formData.stream || !formData.exam) {
      setError('Please select stream and exam');
      return;
    }
    
    if (usesRank && !formData.rank) {
      setError(`${formData.stream} stream requires rank input`);
      return;
    }
    
    if (usesPercentile && !formData.percentile) {
      setError(`${formData.stream} stream requires percentile input`);
      return;
    }
    
    if (!usesRank && !usesPercentile && !formData.rank && !formData.percentile) {
      setError('Please enter either rank or percentile');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/college-predictor/predict', {
        stream: formData.stream,
        exam: formData.exam,
        rank: formData.rank, 
        percentile: formData.percentile
      });

      setPredictions(response.data);
      handleNext();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to predict colleges');
    } finally {
      setLoading(false);
    }
  };

  const renderStreamSelection = () => (
    <Fade in={activeStep === 0}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3, fontWeight: 600 }}>
          🎓 Choose Your Academic Stream
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: 2,
          maxWidth: '100%'
        }}>
          {Object.entries(streamConfig).map(([key, config]) => (
            <Box 
              key={key} 
              onClick={() => handleStreamChange(key)}
              sx={{
                cursor: 'pointer',
                p: 2,
                borderRadius: '15px',
                border: formData.stream === key ? `2px solid ${config.color}` : '2px solid rgba(0,0,0,0.1)',
                background: formData.stream === key ? alpha(config.color, 0.1) : 'rgba(255,255,255,0.5)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${alpha(config.color, 0.2)}`,
                  background: alpha(config.color, 0.1)
                }
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: config.color, 
                  width: 40, 
                  height: 40, 
                  mx: 'auto', 
                  mb: 1
                }}
              >
                {config.icon}
              </Avatar>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5, color: config.color }}>
                {key}
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', opacity: 0.7, lineHeight: 1.2 }}>
                {config.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Fade>
  );

  const renderExamSelection = () => {
    const config = getStreamConfig(formData.stream);
    
    return (
      <Fade in={activeStep === 1}>
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3, fontWeight: 600 }}>
            📝 Select Your Entrance Exam
          </Typography>
          <Box sx={{ 
            p: 3, 
            borderRadius: '15px', 
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: config.color, mr: 2, width: 36, height: 36 }}>
                {config.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ color: config.color, fontWeight: 600 }}>
                  {formData.stream} Stream
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {config.name}
                </Typography>
              </Box>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Select Entrance Exam</InputLabel>
              <Select
                value={formData.exam}
                label="Select Entrance Exam"
                onChange={(e) => setFormData(prev => ({ ...prev, exam: e.target.value }))}
              >
                {config.exams.map((exam) => (
                  <MenuItem key={exam} value={exam}>
                    {exam}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Fade>
    );
  };

  const renderScoreInput = () => {
    const config = getStreamConfig(formData.stream);
    
    // Determine input type based on stream
    const usesRank = ['MPC', 'BiPC', 'CEC'].includes(formData.stream);
    const usesPercentile = ['MEC', 'HEC'].includes(formData.stream);
    
    return (
      <Fade in={activeStep === 2}>
        <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3, fontWeight: 600 }}>
            📊 Enter Your Score
          </Typography>
          <Box sx={{ 
            p: 3, 
            borderRadius: '15px', 
            background: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: config.color, mr: 2, width: 36, height: 36 }}>
                {config.icon}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ color: config.color, fontWeight: 600 }}>
                  {formData.exam}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {formData.stream} Stream
                </Typography>
              </Box>
            </Box>
            
            <Stack spacing={2}>
              {usesRank && (
                <TextField
                  fullWidth
                  size="small"
                  label={`${formData.exam} Rank`}
                  type="number"
                  value={formData.rank || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    rank: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  helperText={`Enter your ${formData.exam} rank`}
                  required
                />
              )}
              
              {usesPercentile && (
                <TextField
                  fullWidth
                  size="small"
                  label={`${formData.exam} Percentile`}
                  type="number"
                  inputProps={{ min: 0, max: 100, step: 0.01 }}
                  value={formData.percentile || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    percentile: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  helperText={`Enter your ${formData.exam} percentile (0-100)`}
                  required
                />
              )}
              
              {/* Show both for flexible input */}
              {!usesRank && !usesPercentile && (
                <>
                  <TextField
                    fullWidth
                    size="small"
                    label="Rank (if available)"
                    type="number"
                    value={formData.rank || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      rank: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    helperText="Enter your rank if available"
                  />
                  
                  <Typography align="center" color="textSecondary" variant="body2">
                    OR
                  </Typography>
                  
                  <TextField
                    fullWidth
                    size="small"
                    label="Percentile"
                    type="number"
                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                    value={formData.percentile || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      percentile: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))}
                    helperText="Enter your percentile (0-100)"
                  />
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Fade>
    );
  };

  const renderPredictions = () => {
    if (loading) {
      return (
        <Box textAlign="center" py={6}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6">Analyzing Your Profile...</Typography>
          <Typography variant="body2" color="textSecondary">
            Finding the best colleges for you
          </Typography>
        </Box>
      );
    }

    if (!predictions) {
      return (
        <Alert severity="info">
          No predictions available. Please try again.
        </Alert>
      );
    }

    const categories = [
      { key: 'safe', label: 'Safe Colleges', colleges: predictions?.categories?.safe || [], color: '#4caf50', icon: '🎯' },
      { key: 'moderate', label: 'Moderate Colleges', colleges: predictions?.categories?.moderate || [], color: '#ff9800', icon: '⚖️' },
      { key: 'ambitious', label: 'Ambitious Colleges', colleges: predictions?.categories?.ambitious || [], color: '#f44336', icon: '🚀' }
    ];



    return (
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '15px',
        overflow: 'hidden'
      }}>
        {/* Results Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
            🎯 Your College Predictions
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Typography variant="body2">
              📚 {predictions?.summary?.totalColleges || 0} Colleges
            </Typography>
            <Typography variant="body2">
              📊 {formData.stream}
            </Typography>
            <Typography variant="body2">
              📝 {formData.exam}
            </Typography>
          </Box>
        </Box>

        {/* Results Content with Grid Layout */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 2
        }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 2,
            height: 'fit-content'
          }}>
            {categories.map((category) => (
              <Box
                key={category.key}
                sx={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  border: `2px solid ${category.color}20`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '200px'
                }}
              >
                {/* Category Header */}
                <Box sx={{
                  background: `linear-gradient(135deg, ${category.color}15, ${category.color}25)`,
                  p: 1.5,
                  borderBottom: `1px solid ${category.color}30`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: category.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      {category.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: category.color, fontWeight: 'bold' }}>
                        {category.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.colleges.length} options
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Colleges List */}
                <Box sx={{ flex: 1, p: 1 }}>
                  {category.colleges.length > 0 ? (
                    <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                      {category.colleges.slice(0, 5).map((prediction: any, index: number) => (
                        <Box key={index} sx={{
                          p: 1.5,
                          mb: 1,
                          borderRadius: '8px',
                          background: `${category.color}08`,
                          border: `1px solid ${category.color}20`,
                          '&:hover': {
                            background: `${category.color}15`,
                            transform: 'translateY(-1px)',
                            boxShadow: `0 2px 8px ${category.color}30`
                          },
                          transition: 'all 0.2s ease'
                        }}>
                          <Typography variant="body2" fontWeight="bold" sx={{ 
                            color: category.color,
                            mb: 0.5,
                            fontSize: '0.85rem'
                          }}>
                            {prediction.branch || prediction.college?.name || prediction.name}
                          </Typography>
                          {prediction.branch && (
                            <Typography variant="caption" color="text.secondary" sx={{ 
                              display: 'block',
                              mb: 0.5 
                            }}>
                              {prediction.college?.name || prediction.name}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: 'text.secondary'
                            }}>
                              <LocationOn sx={{ fontSize: 12, mr: 0.5 }} />
                              {prediction.college?.location || prediction.location || 'N/A'}
                            </Typography>
                            <Chip 
                              label={`${Math.round(prediction.probability || 80)}%`}
                              size="small"
                              sx={{ 
                                bgcolor: category.color,
                                color: 'white',
                                fontSize: '0.7rem',
                                height: '20px'
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                      {category.colleges.length > 5 && (
                        <Typography variant="caption" sx={{ 
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                          mt: 1,
                          p: 1
                        }}>
                          +{category.colleges.length - 5} more colleges available
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{
                      textAlign: 'center',
                      py: 3,
                      color: 'text.secondary'
                    }}>
                      <Typography variant="body2">
                        No colleges in this category
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Back to Home Button */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              onClick={onBackToLanding}
              startIcon={<ArrowBack />}
              sx={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                borderRadius: '25px',
                px: 4,
                py: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2, #667eea)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                }
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      {/* Single Main Card Container */}
      <Box sx={{
        maxWidth: 900,
        width: '100%',
        height: '75vh',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden'
      }}>
        
        {/* Header with Compact Progress - Inside Card */}
        <Box sx={{
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
          p: 2,
          flexShrink: 0
        }}>
          <Typography variant="h5" align="center" sx={{ 
            fontWeight: 700,
            color: '#333',
            mb: 1.5
          }}>
            🎓 AI College Predictor
          </Typography>
          
          {/* Compact Milestone Bar */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            maxWidth: 600,
            mx: 'auto'
          }}>
            {/* Progress Line */}
            <Box sx={{
              position: 'absolute',
              top: '18px',
              left: '15%',
              right: '15%',
              height: '2px',
              background: '#e0e0e0',
              borderRadius: '1px',
              zIndex: 0
            }}>
              <Box sx={{
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '1px',
                width: `${(activeStep / (steps.length - 1)) * 100}%`,
                transition: 'width 0.4s ease'
              }} />
            </Box>
            
            {steps.map((step, index) => (
              <Box key={step} sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                zIndex: 1,
                flex: 1
              }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: index <= activeStep 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'white',
                  border: `2px solid ${index <= activeStep ? '#667eea' : '#e0e0e0'}`,
                  color: index <= activeStep ? 'white' : '#999',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease',
                  mb: 0.5
                }}>
                  {index < activeStep ? '✓' : index + 1}
                </Box>
                <Typography 
                  variant="caption" 
                  align="center"
                  sx={{ 
                    fontWeight: index === activeStep ? 600 : 400,
                    color: index <= activeStep ? '#333' : '#999',
                    fontSize: '0.7rem',
                    maxWidth: 70,
                    lineHeight: 1,
                    textAlign: 'center'
                  }}
                >
                  {step}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Main Content - Flexible Height Inside Card */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          {/* Content Area */}
          <Box sx={{ 
            flex: 1,
            overflow: activeStep === 3 ? 'auto' : 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            py: 1
          }}>
            {activeStep === 0 && renderStreamSelection()}
            {activeStep === 1 && renderExamSelection()}
            {activeStep === 2 && renderScoreInput()}
            {activeStep === 3 && renderPredictions()}
          </Box>

          {/* Fixed Navigation Bar at Bottom - Inside Card */}
          {activeStep < 3 && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(102, 126, 234, 0.1)',
              background: 'rgba(102, 126, 234, 0.05)',
              px: 3,
              py: 1.5,
              flexShrink: 0
            }}>
              {onBackToLanding && (
                <Button
                  onClick={onBackToLanding}
                  startIcon={<ArrowBack />}
                  sx={{
                    color: '#667eea',
                    '&:hover': { background: 'rgba(102, 126, 234, 0.1)' }
                  }}
                >
                  Home
                </Button>
              )}

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderRadius: '20px', 
                    px: 3,
                    borderColor: '#667eea',
                    color: '#667eea',
                    '&:hover': {
                      borderColor: '#667eea',
                      background: 'rgba(102, 126, 234, 0.1)'
                    },
                    '&:disabled': {
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                      color: 'rgba(102, 126, 234, 0.3)'
                    }
                  }}
                >
                  Back
                </Button>
                
                <Button 
                  variant="contained"
                  onClick={activeStep === 2 ? handlePredict : handleNext}
                  disabled={
                    (activeStep === 0 && !formData.stream) ||
                    (activeStep === 1 && !formData.exam) ||
                    (activeStep === 2 && (() => {
                      const usesRank = ['MPC', 'BiPC', 'CEC'].includes(formData.stream);
                      const usesPercentile = ['MEC', 'HEC'].includes(formData.stream);
                      return (usesRank && !formData.rank) || (usesPercentile && !formData.percentile) || (!usesRank && !usesPercentile && !formData.rank && !formData.percentile);
                    })()) ||
                    loading
                  }
                  size="small"
                  sx={{ 
                    borderRadius: '20px', 
                    px: 3,
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2, #667eea)',
                      transform: 'translateY(-1px)'
                    },
                    '&:disabled': {
                      background: 'rgba(102, 126, 234, 0.3)',
                      color: 'white'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={16} sx={{ color: 'white' }} />
                  ) : (
                    activeStep === 2 ? 'Predict' : 'Next'
                  )}
                </Button>
              </Box>
            </Box>
          )}

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mx: 3,
                mb: 1,
                borderRadius: '10px',
                flexShrink: 0
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleModernCollegePredictor;