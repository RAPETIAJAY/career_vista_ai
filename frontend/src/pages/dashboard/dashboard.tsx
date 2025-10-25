import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  Fade,
  Slide,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  School,
  TrendingUp,
  Psychology,
  Assessment,
  ArrowForward,
  CheckCircle,
  Star,
  EmojiEvents,
  Work,
  Analytics,
  Insights,
  AutoAwesome,
  TrendingUpRounded,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { aiService } from '../../services/api';

// Big Progress Bar Component with Test Button
const ProgressBarSection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const profileSteps = useMemo(() => {
    if (!user) return [];
    
    return [
      {
        label: 'Create Account',
        completed: !!(user.name && user.email),
        description: 'Sign up and verify email',
        buttonText: 'Account Created',
        disabled: true,
        action: null
      },
      {
        label: 'Setup Profile',
        completed: !!(user.profileCompleted), // Use backend profileCompleted field
        description: 'Complete academic information',
        buttonText: !!(user.profileCompleted) ? 'Profile Complete' : 'Setup Profile',
        disabled: !!(user.profileCompleted),
        action: () => navigate('/profile-setup')
      },
      {
        label: 'Take Test',
        completed: !!(user.examCompleted), // Use backend examCompleted field
        description: 'Complete assessment',
        buttonText: !!(user.examCompleted) ? 'Test Complete' : 'Take Test',
        disabled: !(user.profileCompleted) || !!(user.examCompleted), // Enable only if profile is completed
        action: !!(user.examCompleted) ? null : () => navigate('/test/academic')
      }
    ];
  }, [user, navigate]);

  const progressPercentage = (profileSteps.filter(step => step.completed).length / profileSteps.length) * 100;

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: 'white', 
              mb: 1 
            }}
          >
            Your Career Journey Progress 🎯
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem'
            }}
          >
            Complete each step to unlock personalized career recommendations
          </Typography>
        </Box>

        {/* Big Progress Bar with Milestone Buttons */}
        <Box sx={{ mb: 4 }}>
          {/* Progress Bar */}
          <Box 
            sx={{ 
              position: 'relative',
              width: '100%',
              height: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              overflow: 'hidden',
              mb: 6
            }}
          >
            {/* Animated Progress Fill */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '8px',
                transition: 'width 1s ease-in-out',
                boxShadow: '0 0 20px rgba(79, 172, 254, 0.3)',
              }}
            />
            
            {/* Milestone Markers */}
            {profileSteps.map((step, index) => {
              // Calculate position with padding to keep dots inside the bar
              const totalSteps = profileSteps.length - 1;
              const padding = 2; // 2% padding from edges
              const availableWidth = 100 - (padding * 2);
              const stepPosition = totalSteps > 0 ? (index / totalSteps) * availableWidth + padding : padding;
              
              return (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    left: `${stepPosition}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: step.completed 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.4)',
                  border: step.completed 
                    ? '2px solid #4facfe' 
                    : '2px solid rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.3s ease',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {step.completed && (
                  <CheckCircle 
                    sx={{ 
                      fontSize: 12, 
                      color: '#4facfe' 
                    }} 
                  />
                )}
              </Box>
              );
            })}
          </Box>

          {/* Milestone Labels and Buttons */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            {profileSteps.map((step, index) => (
              <Box 
                key={index}
                sx={{ 
                  textAlign: 'center',
                  width: `${100 / profileSteps.length}%`,
                  px: 1
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'white',
                    fontWeight: step.completed ? 600 : 400,
                    opacity: step.completed ? 1 : 0.8,
                    mb: 0.5
                  }}
                >
                  {step.label}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 2
                  }}
                >
                  {step.description}
                </Typography>
                
                {/* Button under each milestone */}
                <Button
                  variant="contained"
                  size="small"
                  disabled={step.disabled}
                  onClick={step.action || (() => {})}
                  startIcon={step.completed ? <CheckCircle /> : (step.label === 'Take Test' ? <Assessment /> : undefined)}
                  sx={{
                    bgcolor: step.completed ? 'rgba(76, 175, 80, 0.9)' : 
                           step.disabled ? 'rgba(255, 255, 255, 0.2)' : '#4facfe',
                    color: 'white',
                    px: 2,
                    py: 1,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    minWidth: '120px',
                    cursor: step.disabled ? 'not-allowed' : 'pointer',
                    '&:hover': {
                      bgcolor: step.completed ? 'rgba(76, 175, 80, 1)' : 
                             step.disabled ? 'rgba(255, 255, 255, 0.2)' : '#3d8bfe',
                      transform: !step.disabled ? 'translateY(-1px)' : 'none',
                    },
                    '&:disabled': {
                      color: 'rgba(255, 255, 255, 0.6)',
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: step.completed ? '0 2px 8px rgba(76, 175, 80, 0.3)' :
                              !step.disabled ? '0 2px 8px rgba(79, 172, 254, 0.3)' : 'none'
                  }}
                >
                  {step.buttonText}
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Progress Percentage */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              opacity: 0.9
            }}
          >
            {progressPercentage.toFixed(0)}% Complete
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Stream Prediction Card Component
const StreamPredictionCard: React.FC<{ prediction: any; loading: boolean }> = ({ prediction, loading }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 6, textAlign: 'center', color: 'white' }}>
          <CircularProgress sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6">Analyzing your results...</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Our AI is processing your test performance and profile data
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) return null;

  const getStreamColor = (stream: string) => {
    const colors: Record<string, string> = {
      MPC: '#2196F3',
      BiPC: '#4CAF50', 
      MEC: '#FF9800',
      CEC: '#9C27B0',
      HEC: '#F44336'
    };
    return colors[stream] || theme.palette.primary.main;
  };

  const getStreamEmoji = (stream: string) => {
    const emojis: Record<string, string> = {
      MPC: '🔬',
      BiPC: '🧬',
      MEC: '💼',
      CEC: '⚖️',
      HEC: '📚'
    };
    return emojis[stream] || '🎓';
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, sm: 4 } }}>
          <AutoAwesome sx={{ fontSize: { xs: 40, sm: 48 }, color: 'white', mr: 2 }} />
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: 'white', 
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
              🎯 Your Recommended Stream
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
              Based on your test performance and interests
            </Typography>
          </Box>
        </Box>

        {/* Main Stream Recommendation */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: { xs: 3, sm: 4 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h2" sx={{ mr: 2, fontSize: { xs: '2rem', sm: '3rem' } }}>
              {getStreamEmoji(prediction.recommendedStream)}
            </Typography>
            <Box>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                color: 'white',
                fontSize: { xs: '1.8rem', sm: '2.5rem' }
              }}>
                {prediction.recommendedStream}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}>
                Recommended for you
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${prediction.confidence} Confidence`}
            sx={{
              bgcolor: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              borderRadius: '12px'
            }}
          />
        </Box>

        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', mb: { xs: 3, sm: 4 } }} />

        {/* Reasoning Section */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography variant="h6" sx={{ 
            color: 'white', 
            fontWeight: 600, 
            mb: 3,
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            Why this stream?
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                height: '100%'
              }}>
                <Assessment sx={{ color: '#4CAF50', fontSize: { xs: 32, sm: 40 }, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}>
                  Academic Fit
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}>
                  {prediction.reasoning?.academicFit}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                height: '100%'
              }}>
                <Psychology sx={{ color: '#2196F3', fontSize: { xs: 32, sm: 40 }, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}>
                  Interest Alignment
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}>
                  {prediction.reasoning?.interestAlignment}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                height: '100%'
              }}>
                <TrendingUpRounded sx={{ color: '#FF9800', fontSize: { xs: 32, sm: 40 }, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  mb: 1,
                  fontSize: { xs: '0.95rem', sm: '1rem' }
                }}>
                  Aptitude Match
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.5,
                  fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}>
                  {prediction.reasoning?.aptitudeMatch}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Career Paths */}
        {prediction.careerPaths && prediction.careerPaths.length > 0 && (
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600, 
              mb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              Top Career Paths
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.8, sm: 1 } }}>
              {prediction.careerPaths.map((career: string, index: number) => (
                <Chip
                  key={index}
                  label={career}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 500,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                    height: { xs: 28, sm: 32 },
                    borderRadius: '8px'
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Next Steps */}
        {prediction.nextSteps && prediction.nextSteps.length > 0 && (
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600, 
              mb: 2,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              Your Next Steps
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
              {prediction.nextSteps.slice(0, 3).map((step: string, index: number) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 1.5,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  p: 2
                }}>
                  <CheckCircle sx={{ 
                    color: '#4CAF50', 
                    fontSize: { xs: 18, sm: 20 },
                    mt: 0.2
                  }} />
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.5,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          mb: { xs: 3, sm: 4 }
        }}>
          <Button
            variant="contained"
            onClick={() => navigate('/stream-recommender')}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Explore All Streams
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/college-predictor')}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'white',
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              py: 1.5,
              borderRadius: '12px',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Find Colleges
          </Button>
        </Box>

        {/* Stream Comparison Scores */}
        {prediction.streamScores && (
          <Box sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            p: { xs: 2, sm: 3 }
          }}>
            <Typography variant="h6" sx={{ 
              color: 'white', 
              fontWeight: 600, 
              mb: { xs: 2, sm: 3 },
              textAlign: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              Stream Compatibility Scores
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {Object.entries(prediction.streamScores).map(([stream, score]: [string, any]) => (
                <Grid size={{ xs: 6, sm: 4 }} key={stream}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: '0.9rem', sm: '1.1rem' }
                    }}>
                      {stream}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={score}
                      sx={{
                        height: { xs: 6, sm: 8 },
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getStreamColor(stream),
                          borderRadius: 4,
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {score}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Test Analysis Card Component
const TestAnalysisCard: React.FC<{ analysis: any; loading: boolean }> = ({ analysis, loading }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Card
        sx={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">Analyzing your test performance...</Typography>
          <Typography variant="body2" color="text.secondary">
            Generating detailed insights and recommendations
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': '#4CAF50',
      'A': '#8BC34A',
      'B+': '#CDDC39',
      'B': '#FFEB3B',
      'C+': '#FFC107',
      'C': '#FF9800',
      'D': '#F44336'
    };
    return colors[grade] || theme.palette.grey[500];
  };

  const getPerformanceColor = (level: string) => {
    const colors: Record<string, string> = {
      'Strong': '#4CAF50',
      'Average': '#FF9800',
      'Developing': '#2196F3'
    };
    return colors[level] || theme.palette.grey[500];
  };

  return (
    <Card
      sx={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, sm: 4 } }}>
          <Analytics sx={{ 
            fontSize: { xs: 40, sm: 48 }, 
            color: theme.palette.primary.main, 
            mr: 2 
          }} />
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 800, 
              color: 'text.primary', 
              mb: 1,
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}>
              📊 Your Test Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
              Detailed insights into your academic performance
            </Typography>
          </Box>
        </Box>

        {/* Overall Performance */}
        <Box sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          borderRadius: '24px',
          p: { xs: 4, sm: 5 },
          mb: { xs: 4, sm: 5 },
          border: `2px solid ${theme.palette.primary.main}20`
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 800, 
            mb: 4,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            textAlign: 'center',
            color: theme.palette.primary.main
          }}>
            🎯 Overall Performance Summary
          </Typography>
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3,
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h1" sx={{ 
                  fontWeight: 900, 
                  color: getGradeColor(analysis.overallPerformance?.grade),
                  fontSize: { xs: '3rem', sm: '4rem' },
                  mb: 1
                }}>
                  {analysis.overallPerformance?.grade}
                </Typography>
                <Typography variant="h6" sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  Overall Grade
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3,
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <Typography variant="h1" sx={{ 
                  fontWeight: 900, 
                  color: theme.palette.info.main,
                  fontSize: { xs: '3rem', sm: '4rem' },
                  mb: 1
                }}>
                  {parseFloat(analysis.overallPerformance?.percentile || 0).toFixed(2)}
                </Typography>
                <Typography variant="h6" sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  Percentile Rank
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: '100%'
              }}>
                <Analytics sx={{ 
                  fontSize: { xs: 40, sm: 48 }, 
                  color: theme.palette.secondary.main,
                  mb: 2
                }} />
                <Typography variant="h6" sx={{ 
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 600,
                  color: 'text.primary'
                }}>
                  Performance Summary
                </Typography>
                <Typography variant="body1" sx={{ 
                  textAlign: 'center', 
                  lineHeight: 1.6,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  color: 'text.secondary'
                }}>
                  {analysis.overallPerformance?.summary}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Subject Analysis */}
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 4,
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}>
            Subject-wise Performance
          </Typography>
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {Object.entries(analysis.subjectAnalysis || {}).map(([subject, data]: [string, any]) => (
              <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={subject}>
                <Box sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  height: '100%',
                  border: `3px solid ${getGradeColor(data.grade)}`,
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${getGradeColor(data.grade)}08, ${getGradeColor(data.grade)}15)`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${getGradeColor(data.grade)}30`,
                  },
                  transition: 'all 0.3s ease'
                }}>
                  {/* Subject Header */}
                  <Box sx={{ 
                    textAlign: 'center',
                    mb: 3
                  }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      textTransform: 'capitalize',
                      fontSize: { xs: '1.2rem', sm: '1.4rem' },
                      mb: 1,
                      color: getGradeColor(data.grade)
                    }}>
                      {subject === 'socialScience' ? 'Social Science' : subject}
                    </Typography>
                    <Chip
                      label={`${data.score}%`}
                      sx={{
                        bgcolor: getGradeColor(data.grade),
                        color: 'white',
                        fontWeight: 700,
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        px: 2,
                        py: 0.5
                      }}
                    />
                  </Box>
                  
                  {/* Grade Display */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h2" sx={{
                      fontWeight: 800,
                      color: getGradeColor(data.grade),
                      fontSize: { xs: '2.5rem', sm: '3rem' },
                      mb: 1
                    }}>
                      {data.grade}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(data.score, 100)}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: `${getGradeColor(data.grade)}20`,
                        mb: 1,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getGradeColor(data.grade),
                          borderRadius: 6,
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{
                      color: getGradeColor(data.grade),
                      fontWeight: 600
                    }}>
                      {Math.min(data.score, 100).toFixed(0)}%
                      {data.score > 100 && (
                        <Typography component="span" sx={{ 
                          color: theme.palette.warning.main,
                          fontSize: '0.7rem',
                          ml: 0.5 
                        }}>
                          (Bonus)
                        </Typography>
                      )}
                    </Typography>
                  </Box>

                  {/* Strengths */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                      Strengths
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {data.strengths?.map((strength: string, index: number) => (
                        <Chip
                          key={index}
                          label={strength}
                          sx={{
                            bgcolor: theme.palette.success.main,
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            height: { xs: 28, sm: 32 },
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Areas to Improve */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <TrendingUp sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
                      Areas to Improve
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {data.improvements?.map((improvement: string, index: number) => (
                        <Chip
                          key={index}
                          label={improvement}
                          sx={{
                            bgcolor: theme.palette.warning.main,
                            color: 'white',
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            height: { xs: 28, sm: 32 },
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Recommendation */}
                  <Box sx={{
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                    p: 2
                  }}>
                    <Typography variant="body2" sx={{
                      lineHeight: 1.6,
                      fontSize: { xs: '0.9rem', sm: '0.95rem' },
                      color: 'text.primary',
                      fontStyle: 'italic'
                    }}>
                      💡 {data.recommendation}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Cognitive Profile */}
        <Box sx={{ mb: { xs: 4, sm: 5 } }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 4,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            textAlign: 'center'
          }}>
            🧠 Cognitive Skills Assessment
          </Typography>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {Object.entries(analysis.cognitiveProfile || {}).map(([skill, level]: [string, any]) => (
              <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={skill}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: { xs: 2, sm: 3 },
                  background: `linear-gradient(135deg, ${getPerformanceColor(level)}10, ${getPerformanceColor(level)}20)`,
                  borderRadius: '16px',
                  border: `2px solid ${getPerformanceColor(level)}30`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${getPerformanceColor(level)}20`,
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    textTransform: 'capitalize',
                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                    color: 'text.primary'
                  }}>
                    {skill.replace(/([A-Z])/g, ' $1').trim()}
                  </Typography>
                  <Chip
                    label={level}
                    sx={{
                      bgcolor: getPerformanceColor(level),
                      color: 'white',
                      fontWeight: 700,
                      fontSize: { xs: '0.8rem', sm: '0.9rem' },
                      height: { xs: 32, sm: 36 },
                      px: 1
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Study Recommendations */}
        {analysis.studyRecommendations && analysis.studyRecommendations.length > 0 && (
          <Box sx={{
            background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.info.main}15)`,
            borderRadius: '16px',
            p: { xs: 2, sm: 3 }
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              <Insights color="primary" />
              Study Recommendations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5 } }}>
              {analysis.studyRecommendations.map((recommendation: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircle sx={{ 
                    color: theme.palette.success.main, 
                    fontSize: { xs: 18, sm: 20 },
                    mt: 0.2
                  }} />
                  <Typography variant="body2" sx={{
                    lineHeight: 1.5,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                  }}>
                    {recommendation}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ModernDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const [streamPrediction, setStreamPrediction] = useState<any>(null);
  const [testAnalysis, setTestAnalysis] = useState<any>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user profile is complete for the progress bar logic
  const isProfileCompleteForStats = useMemo(() => {
    if (!user) return false;
    
    // Use backend profileCompleted field instead of checking individual fields
    return !!(user.profileCompleted);
  }, [user]);

  // Check if both profile and test are completed
  const isFullyCompleted = useMemo(() => {
    return !!(user?.profileCompleted && user?.examCompleted);
  }, [user]);

  // Fetch stream prediction and test analysis when user has completed both profile and test
  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!isFullyCompleted) return;

      try {
        // Fetch stream prediction
        if (!streamPrediction) {
          setLoadingPrediction(true);
          const predictionResponse = await aiService.predictStream();
          setStreamPrediction(predictionResponse.data.prediction);
        }

        // Fetch test analysis
        if (!testAnalysis) {
          setLoadingAnalysis(true);
          const analysisResponse = await aiService.analyzeTest();
          setTestAnalysis(analysisResponse.data.analysis);
        }
      } catch (error: any) {
        console.error('Error fetching AI insights:', error);
        setError(error.response?.data?.message || 'Failed to load AI insights');
      } finally {
        setLoadingPrediction(false);
        setLoadingAnalysis(false);
      }
    };

    fetchAIInsights();
  }, [isFullyCompleted, streamPrediction, testAnalysis]);

  // Force refresh user data immediately when dashboard loads
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Dashboard: Failed to refresh user data:', error);
      }
    };

    // Always refresh when dashboard loads to ensure we have the most up-to-date data
    const justCompletedTest = sessionStorage.getItem('testJustCompleted');
    if (justCompletedTest) {
      sessionStorage.removeItem('testJustCompleted');
    }
    
    refreshUserData();
  }, []); // Empty dependency array - run only once on mount



  // Load test results from localStorage
  useEffect(() => {
    try {
      const storedResult = localStorage.getItem('adaptiveTestResult');
      if (storedResult) {
        setTestResult(JSON.parse(storedResult));
      }
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  }, []);

  // Get career recommendations from test results
  const careerRecommendations = useMemo(() => {
    if (!testResult?.recommendations) return [];
    return testResult.recommendations.slice(0, 3); // Show top 3 recommendations
  }, [testResult]);



  const stats = useMemo(() => {
    if (!isProfileCompleteForStats) return [];
    
    // Calculate actual profile completion percentage based on backend fields
    const getProfileCompletionPercentage = () => {
      if (!user) return 0;
      
      let completedSteps = 0;
      const totalSteps = 3;
      
      // Account creation (always complete if user exists)
      if (user.name && user.email) completedSteps++;
      
      // Profile completion
      if (user.profileCompleted) completedSteps++;
      
      // Exam completion
      if (user.examCompleted) completedSteps++;
      
      return Math.round((completedSteps / totalSteps) * 100);
    };
    
    return [
      {
        title: 'Profile Completion',
        value: getProfileCompletionPercentage(),
        color: theme.palette.primary.main,
        icon: <CheckCircle />,
      },
      {
        title: 'Test Score',
        value: testResult?.percentage || 0,
        color: theme.palette.success.main,
        icon: <EmojiEvents />,
      },
      {
        title: 'Colleges Matched',
        value: 15,
        color: theme.palette.info.main,
        icon: <School />,
      },
      {
        title: 'Scholarships Found',
        value: 8,
        color: theme.palette.warning.main,
        icon: <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>₹</Typography>,
      },
    ];
  }, [isProfileCompleteForStats, testResult, theme]);

  return (
    <Box sx={{ py: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        {/* Welcome Section */}
        <Fade in timeout={1000}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome back, {user?.name || 'Student'}! 👋
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
              }}
            >
              Ready to continue your career journey? Let's explore what's next for you.
            </Typography>
          </Box>
        </Fade>

        {/* Big Progress Bar with Test Button - Hide when both profile and test are completed */}
        {!isFullyCompleted && (
          <Fade in timeout={1000}>
            <Box sx={{ mb: 6 }}>
              <ProgressBarSection />
            </Box>
          </Fade>
        )}

        {/* Stats Cards - Only show when profile is complete */}
        {isProfileCompleteForStats && stats.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Slide in timeout={1000 + index * 200} direction="up">
                  <Card
                    sx={{
                      height: '100%',
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${stat.color}15`,
                            color: stat.color,
                            mr: 2,
                          }}
                        >
                          {stat.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color }}>
                            {stat.value}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.title}
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stat.value}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: `${stat.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: stat.color,
                            borderRadius: 4,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Career Recommendations Section */}
        {isProfileCompleteForStats && careerRecommendations.length > 0 && (
          <Fade in timeout={1000}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Work color="primary" />
                Your Career Recommendations
              </Typography>
              <Grid container spacing={3}>
                {careerRecommendations.map((rec: any, index: number) => (
                  <Grid size={{ xs: 12, md: 4 }} key={index}>
                    <Slide in timeout={1200 + index * 200} direction="up">
                      <Card
                        sx={{
                          height: '100%',
                          background: 'white',
                          borderRadius: '16px',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {rec.stream}
                            </Typography>
                            <Chip
                              label={`${rec.fitScore || rec.confidence}% Fit`}
                              color={rec.fitScore >= 80 ? 'success' : rec.fitScore >= 60 ? 'warning' : 'default'}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {rec.description}
                          </Typography>

                          {rec.careerOptions && rec.careerOptions.length > 0 && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Career Options:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {rec.careerOptions.slice(0, 3).map((career: any, idx: number) => (
                                  <Chip
                                    key={idx}
                                    label={career}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                ))}
                                {rec.careerOptions.length > 3 && (
                                  <Chip
                                    label={`+${rec.careerOptions.length - 3} more`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </Box>
                          )}

                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => navigate('/stream-recommender')}
                          >
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* AI Insights Section - Show when both profile and test are completed */}
        {isFullyCompleted && (
          <Fade in timeout={1000}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                <Psychology color="primary" />
                AI-Powered Insights
              </Typography>
              <Grid container spacing={{ xs: 3, sm: 4, lg: 6 }}>
                {/* Stream Prediction Card */}
                <Grid size={{ xs: 12 }}>
                  <StreamPredictionCard prediction={streamPrediction} loading={loadingPrediction} />
                </Grid>
                
                {/* Test Analysis Card */}
                <Grid size={{ xs: 12 }}>
                  <TestAnalysisCard analysis={testAnalysis} loading={loadingAnalysis} />
                </Grid>
              </Grid>
              
              {/* Error display */}
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>
        )}

        <Grid container spacing={4}>
          {/* Student Motivation Section - Hide when both profile and test are completed */}
          {!isFullyCompleted && (
          <Grid size={{ xs: 12 }}>
            <Fade in timeout={1200}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '24px',
                  color: 'white',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Background Pattern */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '40%',
                    height: '100%',
                    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.1,
                  }}
                />
                
                <CardContent sx={{ p: 6, position: 'relative', zIndex: 1 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <School sx={{ fontSize: 48, color: 'rgba(255,255,255,0.9)' }} />
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            background: 'linear-gradient(45deg, #ffffff, #f8f9fa)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          Your Future Starts Today
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="h6"
                        sx={{
                          mb: 4,
                          opacity: 0.95,
                          lineHeight: 1.6,
                          fontWeight: 400,
                        }}
                      >
                        Every great achievement was once considered impossible. Your dreams are valid, 
                        your goals are achievable, and your dedication will determine your success.
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Star sx={{ color: '#ffd700' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <strong>100+</strong> students have found their dream careers through our platform
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <TrendingUp sx={{ color: '#4caf50' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            <strong>90%</strong> success rate in career guidance and placement preparation
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Psychology sx={{ color: '#ff9800' }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            AI-powered insights tailored specifically for Indian students
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '20px',
                          p: 3,
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 3,
                            textAlign: 'center',
                            color: 'white',
                          }}
                        >
                          Why Choose CareerVista?
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              🎯 Personalized Career Roadmaps
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                              Get customized career paths based on your interests, skills, and academic performance
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              📊 Real-time Market Insights
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                              Stay updated with latest industry trends, salary insights, and job market demands
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              🎓 Exam & College Guidance
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                              Expert guidance for entrance exams and college admissions across India
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                              💡 Skill Development Plans
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.5 }}>
                              Identify skill gaps and get personalized learning recommendations
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
          )}
          
          {/* Inspirational Quotes Section */}
          <Grid size={{ xs: 12 }}>
            <Fade in timeout={1400}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                      borderRadius: '20px',
                      p: 3,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.1)',
                        borderRadius: '20px',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                        "Dream Big"
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.95 }}>
                        Success is not final, failure is not fatal. It is the courage to continue that counts.
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                      borderRadius: '20px',
                      p: 3,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.15)',
                        borderRadius: '20px',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                        "Study Smart"
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.95 }}>
                        Education is the most powerful weapon which you can use to change the world.
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
                      borderRadius: '20px',
                      p: 3,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.15)',
                        borderRadius: '20px',
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                        "Achieve More"
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.95 }}>
                        The future belongs to those who believe in the beauty of their dreams.
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </Fade>
          </Grid>
        </Grid>

        {/* Call to Action */}
        <Fade in timeout={2000}>
          <Box
            sx={{
              mt: 6,
              p: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '20px',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 2,
              }}
            >
              Ready to Discover Your Perfect Career?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 3,
                opacity: 0.9,
              }}
            >
              Join thousands of students who found their path with CareerVista
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Fade>


      </Container>
    </Box>
  );
};

export default ModernDashboard;

