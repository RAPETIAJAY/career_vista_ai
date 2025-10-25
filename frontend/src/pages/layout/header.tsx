import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close,
  School,
  TrendingUp,
  Psychology,
  Timeline,
  AccountCircle,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const ModernHeader: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Public navigation items (accessible without login)
  const publicNavigationItems = [
    {
      label: 'Home',
      href: '/',
      icon: <School />,
    },
    {
      label: 'Career Insights',
      href: '/career-insights',
      icon: <Timeline />,
    },
    {
      label: 'Scholarships',
      href: '/scholarships',
      icon: <Typography sx={{ fontWeight: 'bold' }}>₹</Typography>,
    },
    {
      label: 'College Predictor',
      href: '/college-predictor',
      icon: <TrendingUp />,
    },
  ];

  // Protected navigation items (require login)
  const protectedNavigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <Psychology />,
    },
  ];

  // Get appropriate navigation items based on auth status
  const navigationItems = user 
    ? [...publicNavigationItems, ...protectedNavigationItems]
    : publicNavigationItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (href: string) => {
    // Check if the route is protected and user is not logged in
    const isProtectedRoute = protectedNavigationItems.some(item => item.href === href);
    
    if (isProtectedRoute && !user) {
      // Redirect to login with the intended destination
      navigate('/login', { state: { from: { pathname: href } } });
    } else {
      navigate(href);
    }
    setMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={700} color="primary">
            CareerVista
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        
        <List>
          {navigationItems.map((item, index) => (
            <ListItem
              key={index}
              component="button"
              onClick={() => handleNavigation(item.href)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                backgroundColor: isActiveRoute(item.href) ? theme.palette.primary.main + '15' : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '10',
                },
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <ListItemIcon sx={{ color: isActiveRoute(item.href) ? theme.palette.primary.main : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  color: isActiveRoute(item.href) ? theme.palette.primary.main : 'inherit',
                  fontWeight: isActiveRoute(item.href) ? 600 : 400,
                }}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          {user ? (
            // Authenticated user menu
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 40, height: 40 }}>
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.name || 'User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AccountCircle />}
                onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
              >
                Dashboard
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                color="error"
              >
                Logout
              </Button>
            </Box>
          ) : (
            // Guest user menu
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                mr: 2,
              }}
            >
              <School sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              CareerVista
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  startIcon={item.icon}
                  sx={{
                    mr: 2,
                    color: isActiveRoute(item.href) ? theme.palette.primary.main : 'text.primary',
                    fontWeight: isActiveRoute(item.href) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '10',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile && (
              <>
                {user ? (
                  // Authenticated user
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Typography variant="body1" fontWeight={600} color="text.primary">
                        {user.name || user.email?.split('@')[0] || 'User'}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/dashboard')}
                      sx={{ textTransform: 'none' }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleLogout}
                      color="error"
                      sx={{ textTransform: 'none' }}
                    >
                      Logout
                    </Button>
                  </Box>
                ) : (
                  // Guest user
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/login')}
                      sx={{ textTransform: 'none' }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/register')}
                      sx={{ textTransform: 'none' }}
                    >
                      Sign Up
                    </Button>
                  </Box>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <MobileMenu />
    </>
  );
};

export default ModernHeader;


