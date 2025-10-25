import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const CookiePolicyPage: React.FC = () => {
  const theme = useTheme();

  return ( 
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              color: theme.palette.primary.main,
              textAlign: 'center',
            }}
          >
            Cookie Policy
          </Typography>
          
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Last Updated: October 10, 2025
          </Typography>

          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="body2">
              This Cookie Policy explains how CareerVista AI uses cookies and similar 
              technologies to enhance your experience on our platform. We are committed 
              to transparency about our data collection practices.
            </Typography>
          </Alert>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. What Are Cookies?
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Cookies are small text files that are stored on your device (computer, tablet, 
            or mobile) when you visit a website. They help websites remember your preferences, 
            login status, and other information to improve your browsing experience.
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We also use similar technologies such as web beacons, pixels, and local storage 
            to collect information about how you interact with our platform.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. Types of Cookies We Use
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Cookie Type</strong></TableCell>
                  <TableCell><strong>Purpose</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Chip label="Essential" color="error" size="small" />
                  </TableCell>
                  <TableCell>Required for basic platform functionality and security</TableCell>
                  <TableCell>Session/1 year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Chip label="Authentication" color="warning" size="small" />
                  </TableCell>
                  <TableCell>Remember your login status and user preferences</TableCell>
                  <TableCell>30 days</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Chip label="Analytics" color="info" size="small" />
                  </TableCell>
                  <TableCell>Understand how users interact with our platform</TableCell>
                  <TableCell>2 years</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Chip label="Performance" color="success" size="small" />
                  </TableCell>
                  <TableCell>Monitor and improve platform performance</TableCell>
                  <TableCell>1 year</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Chip label="Functional" color="primary" size="small" />
                  </TableCell>
                  <TableCell>Remember your settings and personalization choices</TableCell>
                  <TableCell>1 year</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Essential Cookies
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            These cookies are strictly necessary for our platform to function properly:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Authentication Tokens"
                secondary="Securely maintain your login session and verify your identity"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Security Cookies"
                secondary="Protect against cross-site request forgery and other security threats"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Load Balancing"
                secondary="Route your requests to the appropriate server for optimal performance"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Feature Flags"
                secondary="Control which features and improvements are available to you"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Analytics and Performance Cookies
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We use analytics cookies to understand how our platform is used and to improve it:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Usage Analytics"
                secondary="Track which features are most popular and how users navigate our platform"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Performance Monitoring"
                secondary="Identify and fix slow-loading pages or broken features"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Error Tracking"
                secondary="Detect and resolve technical issues that affect user experience"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="A/B Testing"
                secondary="Test different versions of features to improve user experience"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Functional Cookies
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            These cookies remember your preferences and choices:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Theme Preferences"
                secondary="Remember whether you prefer light or dark mode"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Language Settings"
                secondary="Store your preferred language for the interface"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Dashboard Layout"
                secondary="Remember your preferred dashboard configuration and quick actions"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Search Filters"
                secondary="Save your commonly used search and filter preferences"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Third-Party Cookies
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We use several third-party services that may set their own cookies:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Google OAuth"
                secondary="For secure authentication and account management"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="OpenRouter API"
                secondary="For AI-powered chat and recommendation services"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Content Delivery Network (CDN)"
                secondary="For faster loading of images and static content"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics Providers"
                secondary="For understanding platform usage and performance metrics"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. Managing Your Cookie Preferences
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Disabling certain cookies may limit functionality 
              and affect your experience on our platform.
            </Typography>
          </Alert>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Browser Settings:
          </Typography>
          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Cookie Controls"
                secondary="Most browsers allow you to view, manage, and delete cookies through settings"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Third-Party Blocking"
                secondary="You can block third-party cookies while allowing first-party cookies"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Incognito/Private Mode"
                secondary="Browse without storing cookies or history"
              />
            </ListItem>
          </List>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Platform Settings:
          </Typography>
          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Account Preferences"
                secondary="Manage your privacy and data collection preferences in your account settings"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics Opt-out"
                secondary="You can opt out of analytics tracking while maintaining essential functionality"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Cookie Lifespan
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            Different cookies have different lifespans:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Session Cookies"
                secondary="Deleted when you close your browser"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Persistent Cookies"
                secondary="Remain on your device until expiration or manual deletion"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Authentication Cookies"
                secondary="Typically expire after 30 days of inactivity"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics Cookies"
                secondary="Usually expire after 2 years but can be deleted earlier"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Data Protection and Security
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We implement security measures to protect cookie data:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Secure transmission using HTTPS encryption" />
            </ListItem>
            <ListItem>
              <ListItemText primary="HttpOnly flags to prevent JavaScript access to sensitive cookies" />
            </ListItem>
            <ListItem>
              <ListItemText primary="SameSite attributes to prevent cross-site request forgery" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Regular security audits and updates" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            10. Children's Privacy
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We take extra precautions when handling cookies for users under 18. 
            We do not knowingly collect personal information through cookies from 
            children under 13 without verifiable parental consent.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            11. Updates to This Policy
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We may update this Cookie Policy to reflect changes in our practices 
            or applicable laws. We will notify you of material changes and update 
            the "Last Updated" date. We encourage you to review this policy periodically.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            12. International Considerations
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our cookie practices comply with applicable data protection laws, 
            including GDPR for European users and similar regulations in other jurisdictions. 
            Users in different regions may have specific rights regarding cookie consent 
            and data processing.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            13. Contact Us About Cookies
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            If you have questions about our use of cookies or need help managing 
            your cookie preferences, please contact us:
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            <strong>Email:</strong> careervistaai@gmail.com<br />
            <strong>Phone:</strong> +91 6301 550 164<br />
            <strong>Subject Line:</strong> "Cookie Policy Inquiry"
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Alert severity="success">
            <Typography variant="body2">
              <strong>Transparency Commitment:</strong> We believe in being transparent 
              about our data practices. This policy explains exactly how we use cookies 
              to provide you with the best possible experience on CareerVista AI.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default CookiePolicyPage;