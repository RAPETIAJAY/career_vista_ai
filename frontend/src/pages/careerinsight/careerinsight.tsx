import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Chip,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,

} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  School,
  Work,
  Timeline,
  Star,
  LocationOn,
  ExpandMore,
  CheckCircle,
  Code,
  Science,
  Psychology,
  AccountBalance,
  Engineering
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import CareerInsightsLoginBanner from '../../components/CareerInsightsLoginBanner';

interface CareerInsight {
  streamInfo: {
    name: string;
    description: string;
    totalCareers: number;
    averageROI: string;
    marketDemand: string;
  };
  topCareers: Array<{
    title: string;
    demand: string;
    growth: string;
    avgSalary: string;
    topSalary: string;
    jobOpenings: string;
    trending: boolean;
  }>;
  trendingIndustries: Array<{
    name: string;
    growth: string;
    opportunities: string;
  }>;
  salaryInsights: {
    fresher: string;
    experienced: string;
    senior: string;
    top: string;
    growthRate: string;
  };
  jobMarket: {
    totalOpenings: string;
    competition: string;
    remoteWork: string;
    international: string;
  };
  skillGaps: string[];
  recommendations: string[];
}

interface FutureProofSkills {
  essentialSkills: Array<{
    skill: string;
    importance: string;
    demand: string;
  }>;
  emergingSkills: Array<{
    skill: string;
    importance: string;
    demand: string;
  }>;
  technicalSkills: Array<{
    skill: string;
    importance: string;
    demand: string;
  }>;
  softSkills: Array<{
    skill: string;
    importance: string;
    demand: string;
  }>;
  skillDevelopmentPath: Array<{
    phase: string;
    skills: string[];
  }>;
}

interface CourseRecommendation {
  name: string;
  platform: string;
  duration: string;
  skill: string;
  rating: number;
  price?: string;
  url: string;
}

interface CourseRecommendations {
  freeCourses: CourseRecommendation[];
  paidCourses: CourseRecommendation[];
  certifications: Array<{
    name: string;
    provider: string;
    duration: string;
    skill: string;
    price: string;
    validity: string;
  }>;
  skillGapAnalysis: {
    currentSkills: string[];
    requiredSkills: string[];
    gaps: string[];
    recommendations: string[];
  };
}

interface EmployabilityInsights {
  tier1Cities: {
    cities: string[];
    opportunities: string;
    averageSalary: string;
    competition: string;
    companies: string[];
    growth: string;
  };
  tier2Cities: {
    cities: string[];
    opportunities: string;
    averageSalary: string;
    competition: string;
    companies: string[];
    growth: string;
  };
  tier3Cities: {
    cities: string[];
    opportunities: string;
    averageSalary: string;
    competition: string;
    companies: string[];
    growth: string;
  };
  remote: {
    opportunities: string;
    averageSalary: string;
    benefits: string[];
    challenges: string[];
    growth: string;
  };
  global: {
    opportunities: string;
    averageSalary: string;
    countries: string[];
    requirements: string[];
    growth: string;
  };
}

const CareerInsights: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStream, setSelectedStream] = useState('MPC');
  const [careerInsights, setCareerInsights] = useState<CareerInsight | null>(null);
  const [futureProofSkills, setFutureProofSkills] = useState<FutureProofSkills | null>(null);
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendations | null>(null);
  const [employabilityInsights, setEmployabilityInsights] = useState<EmployabilityInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const streams = [
    { value: 'MPC', label: 'MPC', fullName: 'Mathematics, Physics, Chemistry', icon: <Engineering /> },
    { value: 'BiPC', label: 'BiPC', fullName: 'Biology, Physics, Chemistry', icon: <Science /> },
    { value: 'MEC', label: 'MEC', fullName: 'Mathematics, Economics, Commerce', icon: <AccountBalance /> },
    { value: 'HEC', label: 'HEC', fullName: 'History, Economics, Civics', icon: <Psychology /> }
  ];

  useEffect(() => {
    if (Number(user?.class) === 10) {
      setSelectedStream('MPC'); // Default for 10th grade
    } else if (user && Number(user.class) === 12) {
      // Set based on user's stream preference
      setSelectedStream(user.stream || 'MPC');
    }
  }, [user]);

  useEffect(() => {
    if (selectedStream) {
      fetchCareerInsights();
    }
  }, [selectedStream]);

  const fetchCareerInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Progressive loading - load critical data first
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Load main insights first for immediate display
      try {
        const insightsRes = await fetch(`/api/career-insights/insights/${selectedStream}`, { headers });
        const insights = await insightsRes.json();
        if (insights.success) {
          setCareerInsights(insights.insights || insights.data || null);
          // Reduce loading state early for better UX
          setLoading(false);
        }
      } catch (insightsErr) {
        console.warn('Failed to load main insights:', insightsErr);
      }

      // Load remaining data in background
      Promise.all([
        fetch(`/api/career-insights/skills/${selectedStream}`, { headers }),
        fetch(`/api/career-insights/courses/${selectedStream}`, { headers }),
        fetch(`/api/career-insights/employability/${selectedStream}`, { headers })
      ]).then(async ([skillsRes, coursesRes, employabilityRes]) => {
        const [skills, courses, employability] = await Promise.all([
          skillsRes.json(),
          coursesRes.json(),
          employabilityRes.json()
        ]);

        if (skills.success) setFutureProofSkills(skills.skills || skills.data || null);
        if (courses.success) setCourseRecommendations(courses.courses || courses.data || null);
        if (employability.success) setEmployabilityInsights(employability.insights || employability.data || null);
      }).catch(err => {
        console.warn('Failed to load secondary data:', err);
      });

    } catch (err) {
      setError('Failed to fetch career insights');
      setLoading(false);
    }
  };

  const getStreamIcon = (stream: string) => {
    const streamData = streams.find(s => s.value === stream);
    return streamData?.icon || <Work />;
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'success';
      case 'High': return 'primary';
      case 'Moderate': return 'warning';
      case 'Low': return 'error';
      default: return 'default';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'Critical': return 'error';
      case 'High': return 'warning';
      case 'Moderate': return 'info';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  // Loading Strategy: Show layout immediately with placeholder text and shimmer effect
  // This prevents layout shifts and provides smooth loading experience

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box 
      sx={{ p: 3, maxWidth: 1200, mx: 'auto' }} 
      className="animate-fadeInUp"
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Timeline color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" gutterBottom>
            Enhanced Career Insights
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Comprehensive career guidance with real-time data and AI-powered recommendations
          </Typography>
        </Box>
      </Box>

      {/* Login Banner for Non-Authenticated Users */}
      {!user && <CareerInsightsLoginBanner />}

      {/* Stream Selection */}
      <Card sx={{ mb: 3 }} className="animate-fadeInUp animate-delay-100">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Your Stream
          </Typography>
          <Grid container spacing={2}>
            {streams.map((stream) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stream.value}>
                <Button
                  fullWidth
                  variant={selectedStream === stream.value ? 'contained' : 'outlined'}
                  startIcon={stream.icon}
                  onClick={() => setSelectedStream(stream.value)}
                  className="hover-interactive"
                  title={stream.fullName}
                  sx={{ 
                    height: '70px', 
                    flexDirection: 'column', 
                    gap: 0.5,
                    px: 1 
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                    {stream.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.7rem', 
                      opacity: 0.8,
                      textAlign: 'center',
                      lineHeight: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%'
                    }}
                  >
                    {stream.fullName}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box 
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }} 
        className="animate-fadeInUp animate-delay-200"
      >
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              minHeight: '64px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                transform: 'translateY(-1px)'
              },
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 700
              }
            },
            '& .MuiTabs-indicator': {
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              height: 3,
              borderRadius: '1.5px'
            }
          }}
        >
          <Tab label="Career Overview" icon={<Work />} />
          <Tab label="Future-Proof Skills" icon={<Code />} />
          <Tab label="Course Recommendations" icon={<School />} />
          <Tab label="Employability Insights" icon={<LocationOn />} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box 
          sx={{ 
            display: 'grid', 
            gap: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: loading ? 0.7 : 1,
            transform: 'translateY(0)',
            filter: loading ? 'blur(0.5px)' : 'none'
          }} 
          className="animate-fadeInUp animate-delay-300 tab-transition"
        >
          {/* Stream Overview */}
          <Card className={`card-hover ${loading ? 'loading-state' : ''}`}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                {getStreamIcon(selectedStream)}
                <Box>
                  <Typography variant="h5">{careerInsights?.streamInfo.name || 'Loading...'}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {careerInsights?.streamInfo.description || 'Preparing comprehensive career insights for your selected stream...'}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {careerInsights?.streamInfo.totalCareers || '---'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Career Options
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main">
                      {careerInsights?.streamInfo.averageROI || '---'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Average ROI
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Chip
                      label={careerInsights?.streamInfo.marketDemand || 'Loading...'}
                      color={careerInsights ? getDemandColor(careerInsights.streamInfo.marketDemand) : 'default'}
                      size="medium"
                      sx={{ fontSize: '1rem', py: 2 }}
                    />
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Market Demand
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {careerInsights?.jobMarket?.totalOpenings || '---'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Job Openings
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Top Careers */}
          <Card className={`card-hover ${loading ? 'loading-state' : ''}`}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Career Options
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Career</TableCell>
                      <TableCell>Demand</TableCell>
                      <TableCell>Growth</TableCell>
                      <TableCell>Avg. Salary</TableCell>
                      <TableCell>Top Salary</TableCell>
                      <TableCell>Job Openings</TableCell>
                      <TableCell>Trending</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {careerInsights?.topCareers?.length ? careerInsights.topCareers.map((career, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {career.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={career.demand}
                            color={getDemandColor(career.demand)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUp color="success" fontSize="small" />
                            <Typography variant="body2">{career.growth}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {career.avgSalary}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            {career.topSalary}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{career.jobOpenings}</Typography>
                        </TableCell>
                        <TableCell>
                          {career.trending && (
                            <Chip
                              label="Hot"
                              color="error"
                              size="small"
                              icon={<Star />}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    )) : 
                    // Loading skeleton rows
                    Array.from({ length: 5 }, (_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell>Loading career {index + 1}...</TableCell>
                        <TableCell>---</TableCell>
                        <TableCell>---</TableCell>
                        <TableCell>---</TableCell>
                        <TableCell>---</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Trending Industries */}
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trending Industries
              </Typography>
              <Grid container spacing={2}>
                {careerInsights?.trendingIndustries?.map((industry, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {industry.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <TrendingUp color="success" fontSize="small" />
                          <Typography variant="body2" color="success.main">
                            {industry.growth} growth
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {industry.opportunities} opportunities
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Salary Insights */}
          <Card className="card-hover">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Salary Insights
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                      {careerInsights?.salaryInsights?.fresher || '---'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Fresher (0-2 years)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="info.main">
                      {careerInsights?.salaryInsights?.experienced || '---'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Experienced (3-8 years)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="warning.main">
                      {careerInsights?.salaryInsights?.senior || '---'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Senior (8+ years)
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                                          <Typography variant="h5" color="error.main">
                      {careerInsights?.salaryInsights?.top || '---'}
                    </Typography>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Top Performers
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Skill Gaps & Recommendations */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Skill Gaps to Address
                  </Typography>
                  <List>
                    {careerInsights?.skillGaps?.map((skill, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={skill} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recommendations
                  </Typography>
                  <List>
                    {careerInsights?.recommendations?.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Star color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box 
          sx={{ 
            display: 'grid', 
            gap: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: loading ? 0.7 : 1,
            transform: 'translateY(0)',
            filter: loading ? 'blur(0.5px)' : 'none'
          }} 
          className="animate-fadeInUp animate-delay-300 tab-transition"
        >
          {/* Essential Skills */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Essential Skills
              </Typography>
              <Grid container spacing={2}>
                {futureProofSkills?.essentialSkills?.map((skill, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {skill.skill}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={skill.importance}
                            color={getImportanceColor(skill.importance)}
                            size="small"
                          />
                          <Chip
                            label={skill.demand}
                            color={getDemandColor(skill.demand)}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Emerging Skills */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Emerging Skills
              </Typography>
              <Grid container spacing={2}>
                {futureProofSkills?.emergingSkills?.map((skill, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {skill.skill}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={skill.importance}
                            color={getImportanceColor(skill.importance)}
                            size="small"
                          />
                          <Chip
                            label={skill.demand}
                            color={getDemandColor(skill.demand)}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Skill Development Path */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skill Development Path
              </Typography>
              {futureProofSkills?.skillDevelopmentPath?.map((phase, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {phase.phase}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={1}>
                      {phase.skills.map((skill, skillIndex) => (
                        <Grid key={skillIndex}>
                          <Chip label={skill} variant="outlined" />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 2 && courseRecommendations && (
        <Box 
          sx={{ 
            display: 'grid', 
            gap: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 1,
            transform: 'translateY(0)'
          }} 
          className="animate-fadeInUp animate-delay-300 tab-transition"
        >
          {/* Free Courses */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Free Courses
              </Typography>
              <Grid container spacing={2}>
                {courseRecommendations.freeCourses.map((course, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {course.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {course.platform} • {course.duration}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {course.skill}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Star color="warning" fontSize="small" />
                          <Typography variant="body2">{course.rating}</Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          href={course.url}
                          target="_blank"
                          className="hover-interactive"
                          sx={{ mt: 1 }}
                        >
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Paid Courses */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Paid Courses
              </Typography>
              <Grid container spacing={2}>
                {courseRecommendations.paidCourses.map((course, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {course.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {course.platform} • {course.duration}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          {course.skill}
                        </Typography>
                        <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                          {course.price}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Star color="warning" fontSize="small" />
                          <Typography variant="body2">{course.rating}</Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="contained"
                          href={course.url}
                          target="_blank"
                          className="hover-interactive"
                          sx={{ mt: 1 }}
                        >
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Professional Certifications
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Certification</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Skill</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Validity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courseRecommendations.certifications.map((cert, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {cert.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{cert.provider}</TableCell>
                        <TableCell>{cert.duration}</TableCell>
                        <TableCell>
                          <Chip label={cert.skill} size="small" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {cert.price}
                          </Typography>
                        </TableCell>
                        <TableCell>{cert.validity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 3 && employabilityInsights && (
        <Box 
          sx={{ 
            display: 'grid', 
            gap: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 1,
            transform: 'translateY(0)'
          }} 
          className="animate-fadeInUp animate-delay-300 tab-transition"
        >
          {/* Tier-wise Opportunities */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Tier-1 Cities
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {employabilityInsights.tier1Cities.cities.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={employabilityInsights.tier1Cities.opportunities}
                      color="success"
                      size="small"
                    />
                    <Typography variant="body2">
                      {employabilityInsights.tier1Cities.averageSalary}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Competition: {employabilityInsights.tier1Cities.competition}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Growth: {employabilityInsights.tier1Cities.growth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="info.main">
                    Tier-2 Cities
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {employabilityInsights.tier2Cities.cities.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={employabilityInsights.tier2Cities.opportunities}
                      color="primary"
                      size="small"
                    />
                    <Typography variant="body2">
                      {employabilityInsights.tier2Cities.averageSalary}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Competition: {employabilityInsights.tier2Cities.competition}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Growth: {employabilityInsights.tier2Cities.growth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    Tier-3 Cities
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {employabilityInsights.tier3Cities.cities.join(', ')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={employabilityInsights.tier3Cities.opportunities}
                      color="warning"
                      size="small"
                    />
                    <Typography variant="body2">
                      {employabilityInsights.tier3Cities.averageSalary}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Competition: {employabilityInsights.tier3Cities.competition}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Growth: {employabilityInsights.tier3Cities.growth}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Remote & Global Opportunities */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Remote Opportunities
                  </Typography>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {employabilityInsights.remote.opportunities}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Average Salary: {employabilityInsights.remote.averageSalary}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Growth: {employabilityInsights.remote.growth}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Benefits:
                  </Typography>
                  <List dense>
                    {employabilityInsights.remote.benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Global Opportunities
                  </Typography>
                  <Typography variant="h5" color="success.main" gutterBottom>
                    {employabilityInsights.global.opportunities}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Average Salary: {employabilityInsights.global.averageSalary}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Growth: {employabilityInsights.global.growth}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Countries: {employabilityInsights.global.countries.join(', ')}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Requirements:
                  </Typography>
                  <List dense>
                    {employabilityInsights.global.requirements.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircle color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={req} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default CareerInsights;


