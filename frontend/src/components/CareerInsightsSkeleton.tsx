import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Timeline } from '@mui/icons-material';

const CareerInsightsSkeleton: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }} className="animate-fadeInUp">
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Timeline color="primary" sx={{ fontSize: 40 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>
            Enhanced Career Insights
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Comprehensive career guidance with real-time data and AI-powered recommendations
          </Typography>
        </Box>
      </Box>

      {/* Stream Selection Skeleton */}
      <Card sx={{ mb: 3 }} className="animate-fadeInUp animate-delay-100">
        <CardContent>
          <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                <Skeleton 
                  variant="rectangular" 
                  height={60} 
                  sx={{ borderRadius: 2 }}
                  className="shimmer"
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }} className="animate-fadeInUp animate-delay-200">
        <Stack direction="row" spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} variant="text" width={120} height={40} />
          ))}
        </Stack>
      </Box>

      {/* Content Area Skeleton */}
      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Stream Overview Card */}
        <Card className="animate-fadeInUp animate-delay-300">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={300} height={32} />
                <Skeleton variant="text" width={400} height={20} />
              </Box>
            </Box>
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid size={{ xs: 12, sm: 3 }} key={item}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width={80} height={48} sx={{ mx: 'auto' }} />
                    <Skeleton variant="text" width={100} height={20} sx={{ mx: 'auto' }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Top Careers Table Skeleton */}
        <Card className="animate-fadeInUp animate-delay-400">
          <CardContent>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    {['Career', 'Demand', 'Growth', 'Avg. Salary', 'Top Salary', 'Job Openings', 'Trending'].map((header) => (
                      <TableCell key={header}>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <TableRow key={row}>
                      <TableCell>
                        <Skeleton variant="text" width={120} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Skeleton variant="circular" width={16} height={16} />
                          <Skeleton variant="text" width={40} />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={60} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rectangular" width={40} height={20} sx={{ borderRadius: 1 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Trending Industries Grid Skeleton */}
        <Card className="animate-fadeInUp animate-delay-500">
          <CardContent>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
                  <Card variant="outlined" className="shimmer">
                    <CardContent>
                      <Skeleton variant="text" width={150} height={24} sx={{ mb: 1 }} />
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Skeleton variant="circular" width={16} height={16} />
                        <Skeleton variant="text" width={80} />
                      </Stack>
                      <Skeleton variant="text" width={120} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Salary Insights Skeleton */}
        <Card className="animate-fadeInUp animate-delay-600">
          <CardContent>
            <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((item) => (
                <Grid size={{ xs: 12, sm: 3 }} key={item}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width={100} height={40} sx={{ mx: 'auto' }} />
                    <Skeleton variant="text" width={120} height={20} sx={{ mx: 'auto' }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Skills & Recommendations Grid Skeleton */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card className="animate-fadeInUp animate-delay-700">
              <CardContent>
                <Skeleton variant="text" width={180} height={32} sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {[1, 2, 3, 4].map((item) => (
                    <Stack key={item} direction="row" alignItems="center" spacing={2}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="100%" height={20} />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card className="animate-fadeInUp animate-delay-800">
              <CardContent>
                <Skeleton variant="text" width={160} height={32} sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {[1, 2, 3, 4].map((item) => (
                    <Stack key={item} direction="row" alignItems="center" spacing={2}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="100%" height={20} />
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CareerInsightsSkeleton;