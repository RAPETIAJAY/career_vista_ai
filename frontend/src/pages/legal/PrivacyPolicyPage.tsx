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
} from '@mui/material';

const PrivacyPolicyPage: React.FC = () => {
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
            Privacy Policy
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
              At CareerVista AI, we are committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data.
            </Typography>
          </Alert>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Information We Collect
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Personal Information:
          </Typography>
          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Name, email address, and phone number when you register" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Academic information (class, stream, subjects, grades)" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Career interests and preferences" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Test responses and assessment results" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Chat conversations with our AI counselor" />
            </ListItem>
          </List>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            Technical Information:
          </Typography>
          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="IP address and device information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Browser type and version" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Usage patterns and feature interactions" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cookies and similar tracking technologies" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. How We Use Your Information
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Personalized Career Guidance"
                secondary="To provide tailored stream recommendations, college suggestions, and career advice based on your profile"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="AI-Powered Services"
                secondary="To enable our AI counselor to provide relevant and contextual career guidance"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Platform Improvement"
                secondary="To analyze usage patterns and improve our algorithms and user experience"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Communication"
                secondary="To send important updates, notifications, and educational content"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Security and Compliance"
                secondary="To protect our platform and comply with legal requirements"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Information Sharing and Disclosure
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We do not sell your personal information. We may share your information only in these limited circumstances:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="AI Service Providers"
                secondary="OpenRouter API and AI model providers (Meta, Microsoft, Mistral) for processing chat conversations"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Authentication Services"
                secondary="Google OAuth for secure login and account management"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics and Performance"
                secondary="Anonymized data for platform analytics and performance monitoring"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Legal Requirements"
                secondary="When required by law, court order, or government request"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Business Transfers"
                secondary="In case of merger, acquisition, or sale of business assets"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Data Security
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We implement industry-standard security measures to protect your information:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Encryption of data in transit and at rest" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Secure authentication and access controls" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Regular security audits and monitoring" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Staff training on data protection practices" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Your Privacy Rights
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Access"
                secondary="Request a copy of the personal information we hold about you"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Correction"
                secondary="Update or correct inaccurate personal information"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Deletion"
                secondary="Request deletion of your personal information (right to be forgotten)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data Portability"
                secondary="Receive your data in a structured, machine-readable format"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Opt-out"
                secondary="Unsubscribe from marketing communications at any time"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Children's Privacy
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform is designed for students aged 14 and above. For users under 18, 
            we recommend parental involvement in account creation and platform usage. 
            We take additional precautions when handling data of minors and comply with 
            applicable children's privacy laws.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. International Data Transfers
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Your information may be processed by AI service providers located outside India. 
            We ensure appropriate safeguards are in place through contractual agreements 
            and compliance with international data protection standards.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Data Retention
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We retain your personal information only as long as necessary:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Account data: Until you delete your account" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Academic records: 7 years or until deletion request" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Chat conversations: 2 years for service improvement" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Analytics data: 3 years in anonymized form" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Cookies and Tracking
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We use cookies and similar technologies to enhance your experience. 
            For detailed information about our cookie usage, please refer to our 
            Cookie Policy. You can control cookie settings through your browser preferences.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            10. Third-Party Links
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform may contain links to third-party websites (colleges, scholarship providers). 
            This Privacy Policy does not apply to these external sites. We encourage you to 
            review their privacy policies before providing any personal information.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            11. Changes to This Policy
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We may update this Privacy Policy periodically. We will notify you of 
            significant changes via email or platform notification. The "Last Updated" 
            date indicates when the policy was last revised.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            12. Contact Us
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            For privacy-related questions, requests, or concerns, please contact us:
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            <strong>Email:</strong> careervistaai@gmail.com<br />
            <strong>Phone:</strong> +91 6301 550 164<br />
            <strong>Subject Line:</strong> "Privacy Request"
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Alert severity="success">
            <Typography variant="body2">
              <strong>Your Trust Matters:</strong> We are committed to earning and maintaining 
              your trust through transparent privacy practices and responsible data handling.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicyPage;