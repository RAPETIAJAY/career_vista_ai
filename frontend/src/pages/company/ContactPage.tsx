import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  Fade,
  Slide,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const contactInfo = [ 
    {
      icon: <Email />,
      title: 'Email Us',
      content: 'careervistaai@gmail.com',
      link: 'mailto:careervistaai@gmail.com',
    },
    {
      icon: <Phone />,
      title: 'Call Us',
      content: '+91 9392194808',
      link: 'tel:+919392194808',
    },
    {
      icon: <LocationOn />,
      title: 'Location',
      content: 'Bangalore, India',
      link: null,
    },
    {
      icon: <LinkedIn />,
      title: 'LinkedIn',
      content: 'CareerVista AI',
      link: 'https://www.linkedin.com/company/109008194/admin/dashboard/',
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
              Get in Touch
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Have questions about CareerVista AI? We're here to help you make the right career decisions.
            </Typography>
          </Box>
        </Fade>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* Contact Information */}
          <Box sx={{ maxWidth: 600 }}>
            <Slide in timeout={1200} direction="up">
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary',
                    textAlign: 'center',
                  }}
                >
                  Contact Information
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    lineHeight: 1.7,
                    textAlign: 'center',
                  }}
                >
                  Ready to transform your career journey? Reach out to us through any of the channels below. 
                  We typically respond within 24 hours.
                </Typography>

                {contactInfo.map((item, index) => (
                  <Fade in timeout={1400 + index * 200} key={index}>
                    <Card
                      sx={{
                        mb: 2,
                        transition: 'all 0.3s ease',
                        cursor: item.link ? 'pointer' : 'default',
                        '&:hover': item.link ? {
                          transform: 'translateX(8px)',
                          boxShadow: `0 4px 20px ${theme.palette.primary.main}20`,
                        } : {},
                      }}
                      onClick={() => item.link && window.open(item.link, '_blank')}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: '50%',
                              background: `${theme.palette.primary.main}15`,
                              color: theme.palette.primary.main,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {item.content}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                ))}
              </Box>
            </Slide>
          </Box>
        </Box>

        {/* FAQ Section */}
        <Fade in timeout={1800}>
          <Card sx={{ mt: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Frequently Asked Questions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      How does CareerVista AI work?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      Our platform uses advanced AI algorithms to analyze your academic performance, interests, 
                      and goals to provide personalized career guidance and college recommendations.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Is CareerVista AI free to use?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      We offer both free and premium features. Basic career guidance and college prediction 
                      are free, while advanced features require a subscription.
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      How accurate are the predictions?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      Our AI models achieve 90% accuracy in career matching and college predictions, 
                      backed by comprehensive data and continuous learning.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      Can I trust CareerVista with my data?
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      Absolutely! We follow strict data protection protocols and never share your 
                      personal information with third parties without your consent.
                    </Typography>
                  </Box>
                </Box>
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

export default ContactPage;