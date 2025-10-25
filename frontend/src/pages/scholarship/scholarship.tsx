import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Skeleton,
  Container,
  Fade,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  Stack,
  Zoom,
  CircularProgress,
  Slide
} from '@mui/material';
import {
  School,
  CheckCircle,
  Warning,
  Info,
  Star,
  FilterList,
  Launch,
  BookmarkBorder,
  Bookmark,
  CalendarToday,
  Business,
  AccountBalance,
  TrendingUp,
  VerifiedUser,
  Search,
  ClearAll
} from '@mui/icons-material';
import { userService } from '@/services/auth';
import scholarshipService, { ScholarshipFilters, UserProfile } from '../../services/scholarshipService';
import { useAuth } from '../../utils/auth';
import ScholarshipLoginBanner from '../../components/ScholarshipLoginBanner';

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  type: 'Merit' | 'Need-based' | 'Category' | 'State' | 'Central' | 'Private';
  sector?: 'Government' | 'Corporate' | 'Private';
  eligibility: {
    minPercentage: number;
    categories: string[];
    incomeLimit?: number;
    states?: string[];
    courses: string[];
    gender?: string;
    pwd?: boolean;
  };
  applicationDeadline: string;
  description: string;
  website: string;
  documentsRequired: string[];
  renewalCriteria?: string;
  matchScore?: number;
  eligibilityStatus?: 'Eligible' | 'Not Eligible' | 'Partially Eligible';
}

const ScholarshipPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [filters, setFilters] = useState<ScholarshipFilters>({
    type: 'All',
    minAmount: 0,
    eligibilityOnly: false,
    sector: 'All',
    search: '',
    limit: 50,
    page: 1,
    sort: 'amount',
    sortOrder: 'desc'
  });
  const [loading, setLoading] = useState(false);
  const [amountInput, setAmountInput] = useState('0');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [scholarshipStats, setScholarshipStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const heroStats = [
    { icon: <School sx={{ fontSize: 40, color: theme.palette.primary.main }} />, number: scholarshipStats?.total || '150+', label: 'Available Scholarships', color: theme.palette.primary.main },
    { icon: <Typography sx={{ fontSize: 40, color: theme.palette.success.main, fontWeight: 'bold' }}>₹</Typography>, number: scholarshipStats?.totalFunding ? `${(scholarshipStats.totalFunding / 100000).toFixed(1)}L+` : '50L+', label: 'Total Funding', color: theme.palette.success.main },
    { icon: <VerifiedUser sx={{ fontSize: 40, color: theme.palette.info.main }} />, number: scholarshipStats?.personalizedStats?.eligibilityRate ? `${scholarshipStats.personalizedStats.eligibilityRate}%` : '95%', label: 'Success Rate', color: theme.palette.info.main },
    { icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.warning.main }} />, number: '24/7', label: 'Support', color: theme.palette.warning.main },
  ];



  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (!profileLoading) {
      loadStats();
    }
  }, [userProfile, profileLoading]);

  useEffect(() => {
    // Load saved scholarships for the signed-in user
    const loadSaved = async () => {
      try {
        const res = await userService.getSavedItems('scholarship');
        const items = (res as any)?.data || [];
        const ids = new Set<string>(
          items.map((i: any) => i.itemId || i.id || i.scholarshipId).filter(Boolean)
        );
        setSavedIds(ids);
      } catch (error) {
        console.warn('Failed to load saved scholarships');
      }
    };
    loadSaved();
  }, []);

  useEffect(() => {
    if (!profileLoading) {
      loadScholarships();
    }
  }, [filters, userProfile, profileLoading]);

  // Debounce minAmount changes from input
  useEffect(() => {
    const id = setTimeout(() => {
      const value = parseInt(amountInput, 10);
      setFilters(prev => ({ ...prev, minAmount: Number.isFinite(value) ? value : undefined }));
    }, 300);
    return () => clearTimeout(id);
  }, [amountInput]);

  const loadUserProfile = async () => {
    if (!user || !user.profileCompleted) {
      setProfileLoading(false);
      return;
    }

    try {
      setProfileLoading(true);
      const response = await userService.getProfileSummary();
      const profileData = response.data?.summary || response.data;
      
      // Map the profile data to the expected UserProfile format
      if (profileData) {
        const mappedProfile: UserProfile = {
          category: profileData.category || 'General',
          state: profileData.state || '',
          gender: profileData.gender || '',
          pwd: profileData.pwd || false,
          percentage: profileData.percentage || 0,
          familyIncome: profileData.familyIncome || 0,
          course: profileData.interestedCourse || profileData.stream || profileData.selectedStream || ''
        };
        setUserProfile(mappedProfile);
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadScholarships = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiFilters: ScholarshipFilters = {
        ...filters,
        minAmount: filters.minAmount && filters.minAmount > 0 ? filters.minAmount : undefined,
      };

      const response = await scholarshipService.getScholarships(apiFilters, userProfile || undefined);
      setScholarships(response.data);
    } catch (error: any) {
      setError(error.message || 'Failed to load scholarships');
      console.error('Failed to load scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await scholarshipService.getScholarshipStats(userProfile || undefined);
      setScholarshipStats(response.data);
    } catch (error) {
      console.warn('Failed to load scholarship stats:', error);
    }
  };

  const classifySector = (scholarship: Scholarship): 'Government' | 'Corporate' | 'Private' => {
    return scholarship.sector || 'Private';
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSaveScholarship = async (scholarshipId: string) => {
    try {
      if (savedIds.has(scholarshipId)) {
        // Remove from saved items
        setSavedIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(scholarshipId);
          return newSet;
        });
      } else {
        await userService.saveItem('scholarship', scholarshipId);
        setSavedIds(prev => new Set(prev).add(scholarshipId));
      }
    } catch (error) {
      console.warn('Failed to save/unsave scholarship');
    }
  };

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case 'Eligible': return '#4caf50';
      case 'Partially Eligible': return '#ff9800';
      case 'Not Eligible': return '#f44336';
      default: return '#757575';
    }
  };

  const getEligibilityIcon = (status: string) => {
    switch (status) {
      case 'Eligible': return <CheckCircle color="success" />;
      case 'Partially Eligible': return <Warning color="warning" />;
      case 'Not Eligible': return <Warning color="error" />;
      default: return <Info color="disabled" />;
    }
  };

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleFilterChange = (newFilters: Partial<ScholarshipFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'All',
      sector: 'All',
      search: '',
      minAmount: 0,
      eligibilityOnly: false,
      limit: 50,
      page: 1,
      sort: 'amount',
      sortOrder: 'desc'
    });
    setAmountInput('0');
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f9ff 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                🎓 Scholarship Matcher 2025
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  opacity: 0.9, 
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                Discover personalized scholarships that match your profile and academic goals
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  opacity: 0.8,
                  fontSize: '1.1rem',
                  maxWidth: '600px',
                  mx: 'auto'
                }}
              >
                AI-powered scholarship matching with 150+ opportunities from government, corporate, and private institutions
              </Typography>

              {user && !user.profileCompleted && (
                <Alert 
                  severity="info" 
                  sx={{ 
                    mb: 4, 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '& .MuiAlert-icon': { color: 'white' },
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  Complete your profile setup to get personalized scholarship recommendations with eligibility matching.
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Stats */}
          <Grid container spacing={3} justifyContent="center">
            {heroStats.map((stat, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <Slide in timeout={1200 + index * 200} direction="up">
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: '#fbbf24',
                          mb: 0.5,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.8,
                          fontSize: '0.875rem',
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Login Banner for Non-Authenticated Users */}
        {!user && <ScholarshipLoginBanner />}

        {/* Filters Section - Now First */}
        <Card sx={{ mb: 6, boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
              <FilterList color="primary" />
              <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                Find Your Perfect Scholarship
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6, lg: 4, xl: 2.4 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search Scholarships"
                  placeholder="Search by name or provider..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6, lg: 4, xl: 2.4 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Scholarship Type</InputLabel>
                  <Select
                    label="Scholarship Type"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as string }))}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                  >
                    <MenuItem value="All">All Types</MenuItem>
                    <MenuItem value="Merit">Merit-based</MenuItem>
                    <MenuItem value="Need-based">Need-based</MenuItem>
                    <MenuItem value="Category">Category-based</MenuItem>
                    <MenuItem value="State">State Government</MenuItem>
                    <MenuItem value="Central">Central Government</MenuItem>
                    <MenuItem value="Private">Private/Corporate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6, lg: 4, xl: 2.4 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Sector</InputLabel>
                  <Select
                    label="Sector"
                    value={filters.sector}
                    onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value as string }))}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                  >
                    <MenuItem value="All">All Sectors</MenuItem>
                    <MenuItem value="Government">Government</MenuItem>
                    <MenuItem value="Corporate">Corporate</MenuItem>
                    <MenuItem value="Private">Private/NGO/Institutions</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6, lg: 4, xl: 2.4 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Minimum Amount (₹)"
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography sx={{ color: 'text.secondary', mr: 1 }}>₹</Typography>,
                  }}
                  inputProps={{ 
                    min: 0,
                    step: 1000
                  }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6, lg: 4, xl: 2.4 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Show Only</InputLabel>
                  <Select
                    label="Show Only"
                    value={filters.eligibilityOnly ? 'eligible' : 'all'}
                    onChange={(e) => setFilters(prev => ({ ...prev, eligibilityOnly: e.target.value === 'eligible' }))}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                  >
                    <MenuItem value="all">All Scholarships</MenuItem>
                    <MenuItem value="eligible">Eligible Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Active Filters */}
            {(filters.search || filters.type !== 'All' || filters.sector !== 'All' || (filters.minAmount || 0) > 0 || filters.eligibilityOnly) && (
              <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Active filters:
                </Typography>
                {filters.search && (
                  <Chip 
                    label={`Search: "${filters.search}"`} 
                    size="small" 
                    onDelete={() => setFilters(prev => ({ ...prev, search: '' }))}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.type !== 'All' && (
                  <Chip 
                    label={`Type: ${filters.type}`} 
                    size="small" 
                    onDelete={() => setFilters(prev => ({ ...prev, type: 'All' }))}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.sector !== 'All' && (
                  <Chip 
                    label={`Sector: ${filters.sector}`} 
                    size="small" 
                    onDelete={() => setFilters(prev => ({ ...prev, sector: 'All' }))}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {(filters.minAmount || 0) > 0 && (
                  <Chip 
                    label={`Min Amount: ₹${(filters.minAmount || 0).toLocaleString()}`} 
                    size="small" 
                    onDelete={() => {
                      setFilters(prev => ({ ...prev, minAmount: 0 }));
                      setAmountInput('0');
                    }}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {filters.eligibilityOnly && (
                  <Chip 
                    label="Eligible Only" 
                    size="small" 
                    onDelete={() => setFilters(prev => ({ ...prev, eligibilityOnly: false }))}
                    color="success"
                    variant="filled"
                  />
                )}
                <Button
                  size="small"
                  onClick={resetFilters}
                  startIcon={<ClearAll />}
                  sx={{ ml: 1 }}
                >
                  Clear All
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Statistics Section */}
        {profileLoading ? (
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading your profile...
            </Typography>
          </Box>
        ) : userProfile && (
          <Fade in timeout={1000}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'text.primary',
                  textAlign: 'center'
                }}
              >
                Your Scholarship Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}25)`,
                      border: `1px solid ${theme.palette.success.main}30`,
                    }}
                  >
                    <CardContent>
                      <CheckCircle sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.success.main }}>
                        {scholarships.filter(s => s.eligibilityStatus === 'Eligible').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Eligible Scholarships
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}25)`,
                      border: `1px solid ${theme.palette.primary.main}30`,
                    }}
                  >
                    <CardContent>
                      <Typography sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1, fontWeight: 'bold' }}>₹</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.primary.main }}>
                        {formatAmount(scholarships.filter(s => s.eligibilityStatus === 'Eligible').reduce((sum, s) => sum + s.amount, 0)).substring(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Potential Funding
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}25)`,
                      border: `1px solid ${theme.palette.warning.main}30`,
                    }}
                  >
                    <CardContent>
                      <Warning sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.warning.main }}>
                        {scholarships.filter(s => s.eligibilityStatus === 'Partially Eligible').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Partially Eligible
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${theme.palette.info.main}15, ${theme.palette.info.main}25)`,
                      border: `1px solid ${theme.palette.info.main}30`,
                    }}
                  >
                    <CardContent>
                      <CalendarToday sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                      <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.info.main }}>
                        {scholarships.filter(s => getDaysUntilDeadline(s.applicationDeadline) <= 30 && getDaysUntilDeadline(s.applicationDeadline) > 0).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Deadlines This Month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {/* Results Summary */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            {loading ? (
              <Skeleton variant="text" width={300} height={40} />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {scholarships.length} scholarship{scholarships.length !== 1 ? 's' : ''} found
              </Typography>
            )}
          </Box>
          {scholarships.length > 0 && !loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="success.main" fontWeight="600">
                Total potential funding:
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {formatAmount(scholarships.reduce((sum: number, s: Scholarship) => sum + s.amount, 0))}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Scholarships Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                <Card sx={{ height: 350 }}>
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="60%" height={24} />
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                      <Skeleton variant="rounded" width={80} height={24} />
                      <Skeleton variant="rounded" width={100} height={24} />
                    </Box>
                    <Skeleton variant="text" width="100%" height={60} />
                    <Skeleton variant="rounded" width="100%" height={40} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : scholarships.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                No scholarships found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters or search criteria to find more opportunities.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setFilters({ type: 'All', minAmount: 0, eligibilityOnly: false, sector: 'All', search: '', limit: 50, page: 1, sort: 'amount', sortOrder: 'desc' });
                  setAmountInput('0');
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {scholarships.map((scholarship: Scholarship) => {
              const daysLeft = getDaysUntilDeadline(scholarship.applicationDeadline);
              const sector = scholarship.sector || classifySector(scholarship);
              const isUrgent = daysLeft <= 7 && daysLeft > 0;
              const isExpired = daysLeft < 0;
              
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={scholarship.id}>
                  <Zoom in timeout={300}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${getEligibilityColor(scholarship.eligibilityStatus || 'Not Eligible')}, ${getEligibilityColor(scholarship.eligibilityStatus || 'Not Eligible')}80)`,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Header with Match Score and Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                            {userProfile && (
                              <>
                                <LinearProgress
                                  variant="determinate"
                                  value={scholarship.matchScore || 0}
                                  sx={{ 
                                    width: 60, 
                                    height: 6, 
                                    borderRadius: 3,
                                    '& .MuiLinearProgress-bar': {
                                      background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.warning.main}, ${theme.palette.error.main})`
                                    }
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                  {scholarship.matchScore || 0}%
                                </Typography>
                                {(scholarship.matchScore || 0) >= 90 && <Star sx={{ fontSize: 16, color: '#ffd700' }} />}
                              </>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Tooltip title={savedIds.has(scholarship.id) ? 'Remove from saved' : 'Save scholarship'}>
                              <IconButton
                                size="small"
                                onClick={() => handleSaveScholarship(scholarship.id)}
                                sx={{ 
                                  color: savedIds.has(scholarship.id) ? theme.palette.warning.main : 'text.secondary',
                                  '&:hover': { 
                                    backgroundColor: savedIds.has(scholarship.id) ? `${theme.palette.warning.main}20` : 'action.hover' 
                                  }
                                }}
                              >
                                {savedIds.has(scholarship.id) ? <Bookmark /> : <BookmarkBorder />}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Title and Provider */}
                        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 700, lineHeight: 1.3, color: 'text.primary' }}>
                          {scholarship.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                          {scholarship.provider}
                        </Typography>

                        {/* Tags */}
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          <Chip
                            label={sector}
                            size="small"
                            icon={sector === 'Government' ? <AccountBalance /> : sector === 'Corporate' ? <Business /> : <School />}
                            color={sector === 'Government' ? 'primary' : sector === 'Corporate' ? 'secondary' : 'default'}
                            variant="outlined"
                          />
                          <Chip
                            label={scholarship.type}
                            size="small"
                            variant="filled"
                            sx={{ 
                              backgroundColor: `${theme.palette.info.main}20`,
                              color: theme.palette.info.main,
                              fontWeight: 600
                            }}
                          />
                        </Box>

                        {/* Amount and Eligibility */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 20, mr: 0.5, color: 'success.main', fontWeight: 'bold' }}>₹</Typography>
                            <Typography variant="h6" color="success.main" fontWeight="bold">
                              {formatAmount(scholarship.amount).substring(1)}
                            </Typography>
                          </Box>
                          {userProfile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getEligibilityIcon(scholarship.eligibilityStatus || 'Not Eligible')}
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: getEligibilityColor(scholarship.eligibilityStatus || 'Not Eligible')
                                }}
                              >
                                {scholarship.eligibilityStatus}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: 2, 
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {scholarship.description}
                        </Typography>

                        {/* Deadline */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1, color: isUrgent ? 'error.main' : isExpired ? 'text.disabled' : 'text.secondary' }} />
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isUrgent ? 'error.main' : isExpired ? 'text.disabled' : 'text.secondary',
                              fontWeight: isUrgent ? 600 : 400
                            }}
                          >
                            Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                            {daysLeft > 0 && (
                              <Typography component="span" sx={{ ml: 1, fontWeight: 600 }}>
                                ({daysLeft} days left)
                              </Typography>
                            )}
                            {isExpired && (
                              <Typography component="span" sx={{ ml: 1, fontWeight: 600 }}>
                                (Expired)
                              </Typography>
                            )}
                          </Typography>
                        </Box>

                        {/* Urgency Alert */}
                        {isUrgent && (
                          <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              Urgent: Only {daysLeft} days left to apply!
                            </Typography>
                          </Alert>
                        )}
                      </CardContent>

                      {/* Action Buttons */}
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                              // View details functionality can be implemented here
                            }}
                            sx={{
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              fontWeight: 600,
                              '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                              },
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outlined"
                            endIcon={<Launch />}
                            onClick={() => window.open(scholarship.website, '_blank')}
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              fontWeight: 600,
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: `${theme.palette.primary.main}10`,
                                borderColor: theme.palette.primary.dark,
                              },
                            }}
                          >
                            Apply
                          </Button>
                        </Stack>
                      </Box>
                    </Card>
                  </Zoom>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
      
    </Box>
  );
};

export default ScholarshipPage;
       