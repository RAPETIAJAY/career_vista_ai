import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  School,
  Close, // Using Close icon as X alternative
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  const footerLinks = {
    platform: [
      { label: 'Stream Discovery', href: '/stream-recommender' },
      { label: 'College Matching', href: '/college-predictor' },
      { label: 'Scholarship Finder', href: '/scholarship-finder' },
      { label: 'Career Insights', href: '/dashboard' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'AI Usage Policy', href: '/ai-usage' },
      { label: 'Cookie Policy', href: '/cookie-policy' },
      { label: 'Intellectual Property', href: '/intellectual-property' },
      { label: 'Data Protection', href: '/data-protection' },
      { label: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: 'https://www.facebook.com/profile.php?id=61581120012135', label: 'Facebook' },
    { icon: <Close sx={{ transform: 'rotate(45deg)' }} />, href: 'https://x.com/CareerVistaAi', label: 'X (Twitter)' },
    { icon: <Instagram />, href: 'https://www.instagram.com/career_vistaai/', label: 'Instagram' },
    { icon: <LinkedIn />, href: 'https://www.linkedin.com/company/109008194/admin/dashboard/', label: 'LinkedIn' },
    { icon: <Email />, href: 'mailto:careervistaai@gmail.com', label: 'Email' },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        pt: 8,
        pb: 4,
        width: '100%',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 } }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
        }}>
          {/* Brand Section */}
          <Box sx={{ 
            width: { xs: '100%', md: '33.333333%' },
          }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    mr: 2, 
                  }}
                >
                  <School sx={{ fontSize: 32, color: 'white' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  CareerVista
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  lineHeight: 1.6,
                }}
              >
                AI-powered career guidance platform helping students discover their perfect career path. We're a pre-seed stealth startup currently seeking seed funding.
              </Typography>
              
              {/* Contact Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
                  Contact Us
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                  <Link 
                    href="mailto:careervistaai@gmail.com"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    careervistaai@gmail.com
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                  <Link 
                    href="tel:+916301550164"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    +91 6301 550 164
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: 20, mr: 1, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Bangalore, India
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.8rem', fontStyle: 'italic' }}>
                  📈 Pre-seed startup looking for seed round funding<br/>
                  💼 Open to accommodating positions once funding is secured
                </Typography>
              </Box>

              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'white',
                      background: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Links Sections */}
          <Box sx={{ 
            width: { xs: '100%', md: '66.666667%' },
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
          }}>
            <Box sx={{ 
              width: { xs: '50%', sm: '25%' },
              minWidth: 200,
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                }}
              >
                Platform
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.platform.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>

            <Box sx={{ 
              width: { xs: '50%', sm: '25%' },
              minWidth: 200,
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.company.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>

            <Box sx={{ 
              width: { xs: '50%', sm: '25%' },
              minWidth: 200,
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {footerLinks.legal.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: 'white',
                        textDecoration: 'underline',
                      },
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © 2025 CareerVista. All rights reserved.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#22c55e',
                  mr: 0.5,
                }}
              />
              All systems operational
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;


