import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  useTheme,
  Fade,
  Slide,
  Chip,
} from '@mui/material';
import {
  School,
  Psychology,
  TrendingUp,
  Rocket, 
  Star,
  Visibility,
  FavoriteBorder,
  GpsFixed,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const values = [
    {
      icon: <School />,
      title: 'Education First',
      description: 'We believe every student deserves access to quality career guidance that can shape their future.',
    },
    {
      icon: <Psychology />,
      title: 'AI-Powered Insights',
      description: 'Leveraging artificial intelligence to provide personalized, data-driven career recommendations.',
    },
    {
      icon: <FavoriteBorder />,
      title: 'Student-Centric',
      description: 'Everything we build is designed with students\' needs, aspirations, and challenges in mind.',
    },
    {
      icon: <GpsFixed />,
      title: 'Accuracy & Trust',
      description: 'Providing reliable, accurate information to help students make confident decisions about their future.',
    },
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Idea Conception',
      description: 'Identified the gap in AI-powered career guidance for Indian students',
    },
    {
      year: '2025',
      title: 'Platform Development',
      description: 'Built comprehensive platform with adaptive testing and college prediction',
    },
    {
      year: '2025',
      title: 'Beta Launch',
      description: 'Successfully launched trial version with 100+ active users',
    },
    {
      year: 'Future',
      title: 'Scale & Impact',
      description: 'Planning to reach millions of students across India with seed funding',
    },
  ];

  const features = [
    {
      icon: <Psychology />,
      title: '50-Question Adaptive Test',
      description: 'Scientifically designed assessment to understand student aptitudes and interests',
    },
    {
      icon: <School />,
      title: 'College Prediction',
      description: 'AI-powered predictions for college admissions based on entrance exam ranks',
    },
    {
      icon: <TrendingUp />,
      title: 'Career Roadmaps',
      description: 'Detailed career paths with skill requirements and industry insights',
    },
    {
      icon: <Star />,
      title: '90% Accuracy Rate',
      description: 'High precision in stream recommendations and college predictions',
    },
  ];

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About CareerVista
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.5,
              }}
            >
              Empowering students across India with AI-powered career guidance and educational insights
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip label="🚀 Pre-seed Startup" color="primary" />
              <Chip label="🤖 AI-Powered" color="secondary" />
              <Chip label="🎓 Education Tech" color="success" />
            </Box>
          </Box>
        </Fade>

        {/* Mission & Vision */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Slide in timeout={1200} direction="right">
              <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)` }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Rocket sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      Our Mission
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                    To democratize quality career guidance by providing every student in India with access to AI-powered, 
                    personalized recommendations that help them discover their perfect career path and make informed 
                    decisions about their educational journey.
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Slide in timeout={1200} direction="left">
              <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}05)` }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Visibility sx={{ fontSize: 40, color: theme.palette.secondary.main, mr: 2 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      Our Vision
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
                    To become India's leading career guidance platform, helping millions of students annually to discover 
                    their potential, choose the right academic streams, and build successful careers that align with 
                    their passions and market opportunities.
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        </Grid>

        {/* Problem & Solution */}
        <Fade in timeout={1400}>
          <Card sx={{ mb: 8, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <CardContent sx={{ p: 5 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
                The Problem We Solve
              </Typography>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
                    🚨 Current Challenges:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>Limited Guidance:</strong> Millions of students lack access to quality career counseling
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>Generic Advice:</strong> One-size-fits-all recommendations don't consider individual strengths
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>Information Gap:</strong> Students struggle to understand college admission processes
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>Regional Barriers:</strong> Quality guidance often unavailable in smaller cities
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.main' }}>
                    ✅ Our Solution:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>AI-Powered Assessment:</strong> 50-question adaptive test for personalized recommendations
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>Individual Focus:</strong> Tailored guidance based on interests, strengths, and goals
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>College Predictions:</strong> Rank-based admission chances for informed decisions
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                      • <strong>Accessible Platform:</strong> Available 24/7 across all regions of India
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>

        {/* Key Features */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
            }}
          >
            What Makes Us Special
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Slide in timeout={1600 + index * 200} direction="up">
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: '50%',
                            background: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Our Values */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
            }}
          >
            Our Core Values
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Slide in timeout={1800 + index * 200} direction="up">
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: '12px',
                            background: `${theme.palette.secondary.main}15`,
                            color: theme.palette.secondary.main,
                            mr: 2,
                          }}
                        >
                          {value.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {value.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                            {value.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Journey Timeline */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
            }}
          >
            Our Journey
          </Typography>
          <Box sx={{ position: 'relative' }}>
            {milestones.map((milestone, index) => (
              <Fade in timeout={2000 + index * 300} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 4,
                    flexDirection: { xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                    textAlign: { xs: 'center', md: index % 2 === 0 ? 'left' : 'right' },
                  }}
                >
                  <Box sx={{ flex: 1, px: { xs: 0, md: 3 } }}>
                    <Card
                      sx={{
                        background: index % 2 === 0 
                          ? `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`
                          : `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}05)`,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: index % 2 === 0 ? 'primary.main' : 'secondary.main' }}>
                          {milestone.year}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {milestone.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {milestone.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      my: { xs: 2, md: 0 },
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
                </Box>
              </Fade>
            ))}
          </Box>
        </Box>

        {/* Call to Action */}
        <Fade in timeout={2500}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Ready to Discover Your Future?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of students who are already using CareerVista to shape their careers
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  Take Free Assessment
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Predict Colleges
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Back Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              py: 1,
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsPage;