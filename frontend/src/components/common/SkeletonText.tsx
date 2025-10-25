import React from 'react';
import { Skeleton } from '@mui/material';

interface SkeletonTextProps {
  loading?: boolean;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
}

const SkeletonText: React.FC<SkeletonTextProps> = ({ 
  loading = true, 
  children, 
  width = '100%', 
  height = '1.2em',
  variant = 'text'
}) => {
  return loading ? (
    <Skeleton variant={variant} width={width} height={height} />
  ) : (
    <>{children}</>
  );
};

export default SkeletonText;