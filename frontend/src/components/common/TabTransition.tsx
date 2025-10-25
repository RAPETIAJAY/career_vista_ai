import React, { ReactNode } from 'react';
import { Box, Fade, Slide } from '@mui/material';

interface TabTransitionProps {
  show: boolean;
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const TabTransition: React.FC<TabTransitionProps> = ({ 
  show, 
  children, 
  direction = 'up' 
}) => {
  return (
    <Fade in={show} timeout={300}>
      <Box>
        <Slide 
          direction={direction} 
          in={show} 
          timeout={250}
          mountOnEnter
          unmountOnExit
        >
          <Box 
            className="animate-fadeInUp"
            sx={{
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: show ? 1 : 0,
              transform: show ? 'translateY(0)' : 'translateY(10px)'
            }}
          >
            {children}
          </Box>
        </Slide>
      </Box>
    </Fade>
  );
};

export default TabTransition;