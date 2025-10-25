import React, { useEffect } from 'react';
import { throttle } from '../utils/performanceUtils';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  useEffect(() => {
    // Add smooth scrolling behavior
    const html = document.documentElement;
    const body = document.body;
    
    html.style.scrollBehavior = 'smooth';
    body.classList.add('smooth-scroll');
    
    // Optimize scroll performance
    const handleScroll = throttle(() => {
      // Add scroll position to CSS custom property for scroll-driven animations
      const scrolled = window.scrollY;
      const rate = scrolled * -0.5;
      document.documentElement.style.setProperty('--scroll-y', `${scrolled}px`);
      document.documentElement.style.setProperty('--scroll-rate', `${rate}px`);
    }, 16); // ~60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Preconnect to important domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];
    
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      body.classList.remove('smooth-scroll');
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;