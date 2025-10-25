import React, { useState, useEffect } from 'react';
import { Fab, useTheme, Box, Typography } from '@mui/material';
import { SmartToy } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface FloatingAIProps {
  onClick?: () => void;
}

const FloatingAI: React.FC<FloatingAIProps> = ({ onClick }) => {
  const theme = useTheme();
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Hide on certain pages
  const hiddenPages = ['/chatbot', '/login', '/register'];
  const shouldHide = hiddenPages.includes(location.pathname) || location.pathname.startsWith('/test/');

  // Handle scroll animation
  useEffect(() => {
    if (shouldHide) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  if (shouldHide) return null;

  const handleClick = () => {
    setHasUserInteracted(true);
    setIsIntroVisible(false);
    onClick?.();
  };

  return (
    <>
      {/* Main AI Assistant Button */}
      <Fab
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 32 },
          right: { xs: 20, sm: 32 },
          width: { xs: 72, sm: 80 },
          height: { xs: 72, sm: 80 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main})`,
          color: 'white',
          zIndex: 999999,
          transform: `translateY(${Math.sin(scrollY * 0.008) * 12}px) rotate(${scrollY * 0.05}deg)`,
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: `
            0 12px 40px ${theme.palette.primary.main}60,
            0 0 0 0 ${theme.palette.primary.main}30,
            inset 0 1px 0 rgba(255,255,255,0.2)
          `,
          '&:hover': {
            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main}, ${theme.palette.warning.main})`,
            transform: `translateY(${Math.sin(scrollY * 0.008) * 12 - 8}px) rotate(${scrollY * 0.05}deg) scale(1.15)`,
            boxShadow: `
              0 20px 60px ${theme.palette.primary.main}80,
              0 0 0 12px ${theme.palette.primary.main}20,
              0 0 60px ${theme.palette.secondary.main}40,
              inset 0 1px 0 rgba(255,255,255,0.3)
            `,
          },
          '&:active': {
            transform: `translateY(${Math.sin(scrollY * 0.008) * 12}px) rotate(${scrollY * 0.05 + 360}deg) scale(0.9)`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -4,
            left: -4,
            right: -4,
            bottom: -4,
            background: `conic-gradient(
              ${theme.palette.primary.main}, 
              ${theme.palette.secondary.main}, 
              ${theme.palette.info.main}, 
              ${theme.palette.warning.main}, 
              ${theme.palette.primary.main}
            )`,
            borderRadius: '50%',
            zIndex: -1,
            opacity: 0.8,
            animation: 'rotate 4s linear infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '150%',
            height: '150%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
            borderRadius: '50%',
            zIndex: -2,
            animation: 'pulse-glow 2s ease-in-out infinite alternate',
          },
          animation: 'float 6s ease-in-out infinite, bounce-attention 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: `translateY(${Math.sin(scrollY * 0.008) * 12}px) rotate(${scrollY * 0.05}deg)` },
            '50%': { transform: `translateY(${Math.sin(scrollY * 0.008) * 12 - 10}px) rotate(${scrollY * 0.05 + 5}deg)` },
          },
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          '@keyframes pulse-glow': {
            '0%': { 
              opacity: 0.6,
              transform: 'translate(-50%, -50%) scale(1)',
            },
            '100%': { 
              opacity: 0.9,
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
          },
          '@keyframes bounce-attention': {
            '0%, 95%': { transform: `translateY(${Math.sin(scrollY * 0.008) * 12}px) rotate(${scrollY * 0.05}deg) scale(1)` },
            '97%': { transform: `translateY(${Math.sin(scrollY * 0.008) * 12 - 6}px) rotate(${scrollY * 0.05 + 10}deg) scale(1.05)` },
            '99%': { transform: `translateY(${Math.sin(scrollY * 0.008) * 12 - 3}px) rotate(${scrollY * 0.05 - 5}deg) scale(1.02)` },
          },
        }}
        onClick={handleClick}
        aria-label="AI Career Assistant - Get Instant Guidance"
        title="🤖 AI Career Assistant - Click for instant help!"
      >
        <SmartToy 
          sx={{ 
            fontSize: { xs: 36, sm: 42 },
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
            animation: 'robot-pulse 2.5s ease-in-out infinite',
            '@keyframes robot-pulse': {
              '0%, 100%': { 
                transform: 'scale(1) rotate(0deg)',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
              },
              '50%': { 
                transform: 'scale(1.1) rotate(5deg)',
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))',
              },
            },
          }} 
        />
      </Fab>

      {/* Attention-grabbing intro popup */}
      {isIntroVisible && !hasUserInteracted && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 100, sm: 120 },
            right: { xs: 20, sm: 32 },
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            p: '12px 16px',
            borderRadius: '16px',
            boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
            zIndex: 999998,
            maxWidth: '200px',
            textAlign: 'center',
            animation: 'slide-up 0.5s ease-out, intro-fade 6s ease-in-out forwards',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-8px',
              right: '24px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: `8px solid ${theme.palette.primary.main}`,
            },
            '@keyframes slide-up': {
              'from': {
                opacity: 0,
                transform: 'translateY(20px)',
              },
              'to': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
            '@keyframes intro-fade': {
              '0%, 70%': {
                opacity: 1,
              },
              '100%': {
                opacity: 0,
                visibility: 'hidden',
              },
            },
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '14px', 
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            🤖 Hi! I'm your AI Career Assistant. Click me for instant guidance!
          </Typography>
        </Box>
      )}
    </>
  );
};

export default FloatingAI;