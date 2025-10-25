import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  useTheme,
  Fade,
  Slide,
  Chip,
} from '@mui/material';
import {
  LinkedIn,
  Email,
  Code,
  TrendingUp,
  Rocket,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OurTeamPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); 

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
              Meet Our Team
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.5,
              }}
            >
              The passionate minds behind CareerVista AI
            </Typography>
          </Box>
        </Fade>

        {/* Team Members */}
        <Box sx={{ mb: 6 }}>
          {/* Founder Profile */}
          <Slide in timeout={1200} direction="up">
            <Card
              sx={{
                mb: 4,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                border: `1px solid ${theme.palette.primary.main}20`,
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: 4,
                  }}
                >
                  {/* Profile Photo */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 200,
                        height: 200,
                        mb: 2,
                        border: `4px solid ${theme.palette.primary.main}30`,
                        boxShadow: `0 8px 32px ${theme.palette.primary.main}20`,
                      }}
                      src="/images/team/ajay-rapeti.jpg" // Ajay's actual photo
                      alt="Ajay Rapeti"
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      Ajay Rapeti
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Founder, CareerVista AI
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Chip
                        icon={<Rocket />}
                        label="Founder"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<Code />}
                        label="Full-Stack"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Profile Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: 'text.primary',
                      }}
                    >
                      Building the Future of Career Guidance
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: 'text.secondary',
                        mb: 3,
                        fontSize: '1.1rem',
                      }}
                    >
                      Hi, I'm Ajay Rapeti, the founder of CareerVista AI. I'm a tech enthusiast who loves 
                      building products that solve real problems.
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: 'text.secondary',
                        mb: 3,
                        fontSize: '1.1rem',
                      }}
                    >
                      I designed and developed CareerVista AI from the ground up — from the backend and AI 
                      systems to the front-end experience. My goal is to make career guidance simple, 
                      data-driven, and accessible to every student in India.
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: 'text.secondary',
                        mb: 4,
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                      }}
                    >
                      I believe in using technology not just for innovation, but for impact — helping 
                      students make smarter decisions about their future.
                    </Typography>

                    {/* Contact Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<Email />}
                        href="mailto:ajayrapeti236@gmail.com"
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          px: 3,
                          py: 1.2,
                        }}
                      >
                        Get in Touch
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<LinkedIn />}
                        href="https://www.linkedin.com/in/ajay-rapeti/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          px: 3,
                          py: 1.2,
                        }}
                      >
                        Connect on LinkedIn
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Slide>

          {/* Co-Founder Profile */}
          <Slide in timeout={1400} direction="up">
            <Card
              sx={{
                mb: 4,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}08, ${theme.palette.primary.main}08)`,
                border: `1px solid ${theme.palette.secondary.main}20`,
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row-reverse' },
                    alignItems: { xs: 'center', md: 'flex-start' },
                    gap: 4,
                  }}
                >
                  {/* Profile Photo */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 200,
                        height: 200,
                        mb: 2,
                        border: `4px solid ${theme.palette.secondary.main}30`,
                        boxShadow: `0 8px 32px ${theme.palette.secondary.main}20`,
                      }}
                      src="/images/team/koka-venkata-sai-charan.jpg" // Koka's actual photo
                      alt="Koka Venkata Sai Charan"
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      Koka Venkata Sai Charan
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.secondary.main,
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      Co-Founder, CareerVista AI
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Chip
                        icon={<Rocket />}
                        label="Co-Founder"
                        color="secondary"
                        variant="outlined"
                      />
                      <Chip
                        icon={<TrendingUp />}
                        label="Marketing"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  {/* Profile Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: 'text.primary',
                      }}
                    >
                      Connecting Technology with Real Impact
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: 'text.secondary',
                        mb: 3,
                        fontSize: '1.1rem',
                      }}
                    >
                      I'm Koka Venkata Sai Charan, co-founder of CareerVista AI. I focus on both the 
                      technical side and the marketing outreach — making sure the product works smoothly 
                      while reaching the students who need it most.
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: 'text.secondary',
                        mb: 3,
                        fontSize: '1.1rem',
                      }}
                    >
                      I'm passionate about blending tech, design, and storytelling to help our platform 
                      connect with real people.
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: 'text.secondary',
                        mb: 4,
                        fontSize: '1.1rem',
                        fontStyle: 'italic',
                      }}
                    >
                      For me, CareerVista AI is about creating meaningful change in how students plan 
                      their careers.
                    </Typography>

                    {/* Contact Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        startIcon={<Email />}
                        href="mailto:kokacharan2003@gmail.com"
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          px: 3,
                          py: 1.2,
                        }}
                      >
                        Get in Touch
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<LinkedIn />}
                        href="https://www.linkedin.com/in/koka-venkata-sai-charan-1a371a273/"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          px: 3,
                          py: 1.2,
                        }}
                      >
                        Connect on LinkedIn
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Box>

        {/* Vision Statement */}
        <Fade in timeout={2000}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              textAlign: 'center',
              mb: 6,
            }}
          >
            <CardContent sx={{ p: 5 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
                Our Vision for the Future
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: '800px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                "To democratize quality career guidance and help every student in India discover their 
                true potential through the power of AI and data-driven insights."
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/about')}
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
                Learn More About CareerVista
              </Button>
            </CardContent>
          </Card>
        </Fade>

        {/* Join Us Section */}
        <Fade in timeout={2200}>
          <Card sx={{ textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Want to Join Our Mission?
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, maxWidth: '600px', mx: 'auto' }}>
                We're building something special and always looking for passionate individuals who want to 
                make a difference in education technology.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/careers')}
                sx={{
                  px: 4,
                  py: 1.5,
                }}
              >
                Explore Opportunities
              </Button>
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

export default OurTeamPage;