// Enhanced Material-UI Theme Configuration for Enterprise Experience
import { createTheme } from '@mui/material/styles';

const enterpriseTheme = createTheme({
  palette: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      main: '#3b82f6',
      dark: '#1d4ed8',
      light: '#93c5fd',
      contrastText: '#ffffff'
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      main: '#a855f7',
      dark: '#7c3aed',
      light: '#d8b4fe',
      contrastText: '#ffffff'
    },
    success: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      main: '#10b981'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      main: '#f59e0b'
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      main: '#ef4444'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Inter", "Poppins", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.01em'
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      letterSpacing: '0'
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '0'
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      letterSpacing: '0.01em'
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em'
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none'
    }
  },
  shape: {
    borderRadius: 12
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.02em',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            filter: 'brightness(1.02)'
          },
          '&:active': {
            filter: 'brightness(0.98)',
            transition: 'all 100ms cubic-bezier(0.4, 0, 1, 1)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
            boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.4)'
          }
        },
        outlined: {
          border: '2px solid #e5e7eb',
          color: '#6b7280',
          '&:hover': {
            borderColor: '#3b82f6',
            color: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.04)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            borderColor: '#e5e7eb'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none',
          transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#d1d5db'
              }
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6',
                borderWidth: '2px'
              }
            }
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#3b82f6'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            filter: 'brightness(1.02)'
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            color: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.04)'
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '3px',
          borderRadius: '3px',
          background: 'linear-gradient(90deg, #3b82f6, #a855f7)'
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
            filter: 'brightness(1.08)'
          },
          '&:active': {
            filter: 'brightness(0.92)',
            transition: 'all 100ms cubic-bezier(0.4, 0, 1, 1)'
          }
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          height: '8px',
          backgroundColor: '#f3f4f6'
        },
        bar: {
          borderRadius: '10px',
          background: 'linear-gradient(90deg, #3b82f6, #a855f7)'
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          '& .MuiCircularProgress-circle': {
            stroke: 'url(#linearColors)'
          }
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '12px !important',
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          '&:before': {
            display: 'none'
          },
          '&.Mui-expanded': {
            margin: '16px 0'
          }
        }
      }
    }
  }
});

export default enterpriseTheme;