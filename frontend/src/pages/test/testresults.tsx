import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Divider,
  Alert,
  Paper,
  Fade,
  Zoom,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  School,
  Assessment,
  CheckCircle,
  Cancel,
  Star,
  Psychology, 
  ArrowBack,
  Share,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

interface SubjectScore {
  math: number;
  science: number;
  english: number;
  socialScience: number;
}

interface TestResults {
  total: number;
  subjects: SubjectScore;
  percentage: number;
  grade: string;
  date: string;
  recommendations?: string[];
}

const TestResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get results from location state or fetch from API
    const testResults = location.state?.testResults;
    
    if (testResults) {
      setResults(testResults);
    } else {
      // Fetch results from API if not provided in state
      fetchTestResults();
    }
    
    setLoading(false);
  }, [location.state]);

  const fetchTestResults = async () => {
    try {
      const response = await fetch('/api/tests/results/academic', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      }
    } catch (error) {
      console.error('Failed to fetch test results:', error);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'success.main';
      case 'B+':
      case 'B':
        return 'info.main';
      case 'C+':
      case 'C':
        return 'warning.main';
      default:
        return 'error.main';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'math':
        return <Assessment />;
      case 'science':
        return <Psychology />;
      case 'english':
        return <School />;
      case 'socialScience':
        return <TrendingUp />;
      default:
        return <School />;
    }
  };

  const getRecommendations = (results: TestResults) => {
    const { subjects, percentage } = results;
    const recommendations = [];

    if (percentage >= 90) {
      recommendations.push('Excellent performance! You\'re ready for advanced courses.');
      recommendations.push('Consider exploring competitive exam preparation.');
    } else if (percentage >= 75) {
      recommendations.push('Good performance! Focus on strengthening weaker areas.');
      recommendations.push('You have strong potential for science/engineering streams.');
    } else if (percentage >= 60) {
      recommendations.push('Moderate performance. Consider additional study support.');
      recommendations.push('Focus on concept clarity and regular practice.');
    } else {
      recommendations.push('Need significant improvement. Consider personalized tutoring.');
      recommendations.push('Focus on fundamental concepts and regular revision.');
    }

    // Subject-specific recommendations
    if (subjects.math < subjects.science) {
      recommendations.push('Strengthen mathematics foundation for better science stream preparation.');
    }
    
    if (subjects.english < 3) {
      recommendations.push('Improve English language skills for better communication.');
    }

    return recommendations;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6">Loading results...</Typography>
      </Box>
    );
  }

  if (!results) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography>
            No test results found. Please take the test first.
          </Typography>
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate('/test/academic')}
          sx={{ mt: 2 }}
        >
          Take Test
        </Button>
      </Container>
    );
  }

  const recommendations = getRecommendations(results);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={4}>
            <EmojiEvents sx={{ fontSize: 80, color: 'white', mb: 2 }} />
            <Typography
              variant="h3"
              sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}
            >
              Academic Test Results
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
              {user?.name}, here are your academic test results
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={3}>
          {/* Overall Score Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Zoom in timeout={800}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent sx={{ py: 4 }}>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getGradeColor(results.grade)}, ${getGradeColor(results.grade)}aa)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                      {results.grade}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h4" gutterBottom>
                    {results.percentage.toFixed(1)}%
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    Overall Score
                  </Typography>
                  
                  <Chip
                    label={`${results.total}/20 Questions Correct`}
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* Subject Breakdown */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Fade in timeout={1000}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Subject-wise Performance
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {Object.entries(results.subjects).map(([subject, score]) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={subject}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <Box sx={{ color: 'primary.main', mr: 2 }}>
                              {getSubjectIcon(subject)}
                            </Box>
                            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                              {subject === 'socialScience' ? 'Social Science' : subject}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Score
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {score}/5
                            </Typography>
                          </Box>
                          
                          <LinearProgress
                            variant="determinate"
                            value={(score / 5) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: score >= 4 ? 'success.main' : 
                                               score >= 3 ? 'warning.main' : 'error.main',
                              },
                            }}
                          />
                          
                          <Box display="flex" justifyContent="space-between" mt={1}>
                            <Typography variant="caption" color="text.secondary">
                              {((score / 5) * 100).toFixed(0)}%
                            </Typography>
                            {score >= 4 ? (
                              <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                            ) : (
                              <Cancel sx={{ fontSize: 16, color: 'error.main' }} />
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Recommendations */}
          <Grid size={{ xs: 12 }}>
            <Fade in timeout={1200}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Star sx={{ color: 'warning.main', mr: 2 }} />
                    <Typography variant="h5">
                      Recommendations & Next Steps
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {recommendations.map((recommendation, index) => (
                      <Grid size={{ xs: 12, md: 6 }} key={index}>
                        <Alert
                          severity="info"
                          variant="outlined"
                          sx={{
                            '& .MuiAlert-message': {
                              width: '100%',
                            },
                          }}
                        >
                          <Typography variant="body2">
                            {recommendation}
                          </Typography>
                        </Alert>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Stream Recommendations
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {results.subjects.math >= 4 && results.subjects.science >= 4 && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            border: '2px solid',
                            borderColor: 'success.main',
                          }}
                        >
                          <Typography variant="h6" color="success.main" gutterBottom>
                            MPC Stream
                          </Typography>
                          <Typography variant="body2">
                            Mathematics, Physics, Chemistry - Perfect for Engineering
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                    
                    {results.subjects.science >= 3 && results.subjects.english >= 3 && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            border: '2px solid',
                            borderColor: 'info.main',
                          }}
                        >
                          <Typography variant="h6" color="info.main" gutterBottom>
                            BiPC Stream
                          </Typography>
                          <Typography variant="body2">
                            Biology, Physics, Chemistry - Ideal for Medical field
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                    
                    {results.subjects.socialScience >= 3 && results.subjects.english >= 3 && (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: 'center',
                            border: '2px solid',
                            borderColor: 'warning.main',
                          }}
                        >
                          <Typography variant="h6" color="warning.main" gutterBottom>
                            MEC/CEC Stream
                          </Typography>
                          <Typography variant="body2">
                            Commerce, Economics - Great for Business & Law
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Fade in timeout={1400}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    What's Next?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Test completed on {new Date(results.date).toLocaleDateString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => {
                        sessionStorage.setItem('testJustCompleted', 'true');
                        navigate('/dashboard');
                      }}
                    >
                      Back to Dashboard
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<School />}
                      onClick={() => navigate('/career-insights')}
                      sx={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      }}
                    >
                      Explore Career Insights
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'My Test Results',
                            text: `I scored ${results.percentage.toFixed(1)}% in my academic test!`,
                            url: window.location.href,
                          });
                        }
                      }}
                    >
                      Share Results
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TestResults;