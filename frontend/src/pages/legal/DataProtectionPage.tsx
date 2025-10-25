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
} from '@mui/material';

const DataProtectionPage: React.FC = () => {
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
            Data Protection Policy
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

          <Divider sx={{ mb: 4 }} />

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            CareerVista AI is committed to protecting your personal data and privacy. 
            This Data Protection Policy explains how we collect, use, store, and protect 
            your information in compliance with applicable data protection laws.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Data We Collect
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Personal Information"
                secondary="Name, email address, phone number, academic records, class/grade level, chosen stream, interests, and career preferences."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Usage Data"
                secondary="Platform interactions, test results, chat conversations with AI counselor, time spent on features, and user behavior analytics."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Technical Data"
                secondary="IP address, browser type, device information, session data, and cookies for functionality and analytics."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Educational Data"
                secondary="Academic performance, entrance exam scores, college preferences, scholarship applications, and career assessment results."
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. How We Use Your Data
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Provide personalized career guidance and stream recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Match you with suitable colleges and scholarship opportunities" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Generate AI-powered career insights and advice" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Improve our algorithms and platform functionality" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Send relevant educational updates and notifications" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Comply with legal requirements and platform security" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. Data Sharing and Third Parties
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            We share your data only in the following circumstances:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="AI Service Providers"
                secondary="OpenRouter API and AI model providers (Meta, Microsoft, Mistral, etc.) for processing chat conversations and generating career advice."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Authentication Services"
                secondary="Google OAuth for secure login and account management."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Analytics and Performance"
                secondary="Anonymized data for platform improvement and performance monitoring."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Legal Compliance"
                secondary="When required by law, regulation, or legal process."
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Data Security Measures
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Encryption of data in transit and at rest" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Secure authentication and authorization systems" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Regular security audits and vulnerability assessments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Access controls and staff training on data protection" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Secure cloud infrastructure with reputable providers" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Data Retention
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We retain your personal data only as long as necessary for the purposes 
            outlined in this policy. Academic and career guidance data is typically 
            retained for 7 years or until you request deletion. Chat conversations 
            with AI are retained for 2 years for service improvement purposes.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Your Rights
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Access"
                secondary="Request copies of your personal data we hold"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Rectification"
                secondary="Correct inaccurate or incomplete personal data"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Erasure"
                secondary="Request deletion of your personal data (right to be forgotten)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Portability"
                secondary="Receive your data in a structured, machine-readable format"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Objection"
                secondary="Object to processing of your personal data for certain purposes"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Restriction"
                secondary="Request limitation of processing in certain circumstances"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. International Data Transfers
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Your data may be processed by AI service providers located outside your 
            country. We ensure appropriate safeguards are in place through standard 
            contractual clauses and compliance with international data protection frameworks.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Children's Privacy
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform is designed for students aged 14 and above. For users under 18, 
            we recommend parental supervision and consent. We implement additional 
            safeguards for educational data of minors in compliance with applicable laws.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Cookies and Tracking
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We use essential cookies for platform functionality and analytics cookies 
            to improve user experience. You can control cookie preferences through 
            your browser settings. Please refer to our Cookie Policy for detailed information.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            10. Data Breach Notification
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            In the event of a data breach that may affect your personal data, we will 
            notify relevant authorities within 72 hours and inform affected users 
            without undue delay, including steps taken to address the breach.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            11. Contact and Complaints
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            For data protection questions, exercise your rights, or file complaints:
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            <strong>Email:</strong> careervistaai@gmail.com<br />
            <strong>Phone:</strong> +91 6301 550 164<br />
            <strong>Subject Line:</strong> "Data Protection Request"
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            You also have the right to lodge a complaint with your local data 
            protection authority if you believe your data protection rights have been violated.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            This policy may be updated to reflect changes in our practices or applicable laws. 
            We will notify users of significant changes.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default DataProtectionPage;