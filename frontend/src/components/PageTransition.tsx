import React from 'react';
import { Box } from '@mui/material';
import { useIntersectionObserver } from '../utils/performanceUtils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  return (
    <Box
      ref={ref}
      className={`
        gpu-accelerated
        ${isVisible ? 'animate-fadeInUp' : 'opacity-0 translate-y-8'}
        ${className}
      `}
      sx={{
        minHeight: '100vh',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, opacity',
        transform: 'translateZ(0)', // GPU acceleration
      }}
    >
      {children}
    </Box>
  );
};

export default PageTransition;