import React, { useState } from 'react';
import { Avatar, AvatarProps } from '@mui/material';

interface SafeAvatarProps extends Omit<AvatarProps, 'src'> {
  src: string;
  alt: string;
  fallbackText?: string;
}

const SafeAvatar: React.FC<SafeAvatarProps> = ({ 
  src, 
  alt, 
  fallbackText, 
  sx,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Generate initials from the alt text (name)
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = fallbackText || getInitials(alt);

  return (
    <Avatar
      {...props}
      src={!imageError ? src : undefined}
      sx={{
        bgcolor: imageError ? 'primary.main' : undefined,
        ...sx
      }}
      onError={handleImageError}
    >
      {imageError ? initials : undefined}
    </Avatar>
  );
};

export default SafeAvatar;