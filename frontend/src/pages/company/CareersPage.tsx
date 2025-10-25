import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  useTheme,
  Fade,
  Slide,
} from '@mui/material';
import {
  People,
  Email,
  Phone,
  LocationOn,
  Rocket,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CareersPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const futureRoles = [
    {
      title: 'Full Stack Developer',
      department: 'Engineering',
      type: 'Full-time',
      description: 'Build and maintain our AI-powered career guidance platform with React, Node.js, and modern technologies.',
      skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'AI/ML Integration'],
    },
    {
      title: 'AI/ML Engineer',
      department: 'Technology',
      type: 'Full-time',
      description: 'Develop and improve our recommendation algorithms and adaptive testing systems.',
      skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science', 'NLP'],
    },
    {
      title: 'Product Manager',
      department: 'Product',
      type: 'Full-time',
      description: 'Drive product strategy and roadmap for our career guidance platform.',
      skills: ['Product Strategy', 'User Research', 'Analytics', 'Agile', 'Leadership'],
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      type: 'Full-time',
      description: 'Create intuitive and engaging user experiences for students and educators.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Mobile Design'],
    },
    {
      title: 'Business Development',
      department: 'Business',
      type: 'Full-time',
      description: 'Build partnerships with educational institutions and expand our market reach.',
      skills: ['Sales', 'Partnership Development', 'Market Research', 'Communication', 'Strategy'],
    },
    {
      title: 'Marketing Specialist',
      department: 'Marketing',
      type: 'Full-time',
      description: 'Drive growth through digital marketing, content creation, and brand building.',
      skills: ['Digital Marketing', 'Content Creation', 'SEO', 'Social Media', 'Analytics'],
    },
  ];

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              Join Our Mission 🚀
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
              Help us revolutionize career guidance for millions of students across India
            </Typography>
          </Box>
        </Fade>

        {/* Current Status */}
        <Slide in timeout={1200} direction="up">
          <Card
            sx={{
              mb: 6,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              border: `1px solid ${theme.palette.primary.main}30`,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Rocket sx={{ fontSize: 60, color: theme.palette.primary.main }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Pre-Seed Stealth Startup
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
                Currently seeking seed round funding
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
                We're building the future of AI-powered career guidance in India. While we're currently in our pre-seed stage 
                and actively seeking seed funding, we're planning to build an amazing team once we secure investment.
              </Typography>
              <Chip
                label="Positions available post-funding"
                color="primary"
                size="medium"
                sx={{ fontWeight: 600 }}
              />
            </CardContent>
          </Card>
        </Slide>

        {/* Future Opportunities */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <People color="primary" />
            Future Opportunities
          </Typography>

          <Grid container spacing={3}>
            {futureRoles.map((role, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <Slide in timeout={1400 + index * 200} direction="up">
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${theme.palette.primary.main}20`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                          {role.title}
                        </Typography>
                        <Chip label={role.type} size="small" color="primary" />
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ color: 'primary.main', mb: 2 }}>
                        {role.department}
                      </Typography>
                      
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flex: 1 }}>
                        {role.description}
                      </Typography>
                      
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Key Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {role.skills.map((skill, skillIndex) => (
                            <Chip
                              key={skillIndex}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Contact Section */}
        <Fade in timeout={2000}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Interested in Joining Us?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                We'd love to hear from talented individuals who want to make a difference
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email />
                  <Typography>careervistaai@gmail.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone />
                  <Typography>+91 6301 550 164</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn />
                  <Typography>Bangalore, India</Typography>
                </Box>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                href="mailto:careervistaai@gmail.com?subject=Interest in CareerVista Careers"
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
                Get in Touch
              </Button>
              
              <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
                Send us your resume and let's discuss how you can be part of our journey!
              </Typography>
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

export default CareersPage;