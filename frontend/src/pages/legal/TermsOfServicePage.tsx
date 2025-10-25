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

const TermsOfServicePage: React.FC = () => {
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
            Terms of Service
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

          <Alert severity="warning" sx={{ mb: 4 }}>
            <Typography variant="body2">
              By accessing and using CareerVista AI, you agree to be bound by these Terms of Service. 
              Please read them carefully before using our platform.
            </Typography>
          </Alert>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Acceptance of Terms
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            These Terms of Service ("Terms") constitute a binding legal agreement between you 
            and CareerVista AI ("we," "us," or "our"). By accessing or using our platform, 
            you acknowledge that you have read, understood, and agree to be bound by these Terms 
            and our Privacy Policy.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. Description of Service
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
            CareerVista AI provides:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="AI-powered career counseling and stream recommendations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="College prediction and comparison tools" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Scholarship matching services" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Educational loan information and guidance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Aptitude and career assessment tests" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Financial aid recommendations" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. User Eligibility
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Age Requirement"
                secondary="You must be at least 14 years old to use our service. Users under 18 should obtain parental consent."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Accuracy of Information"
                secondary="You must provide accurate, current, and complete information during registration and use."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Single Account"
                secondary="You may only maintain one active account at a time."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Account Security"
                secondary="You are responsible for maintaining the confidentiality of your account credentials."
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. User Responsibilities and Conduct
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            You agree to:
          </Typography>
          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Use the platform only for lawful purposes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Provide accurate academic and personal information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Respect the intellectual property rights of others" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Not attempt to gain unauthorized access to our systems" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Report any security vulnerabilities you discover" />
            </ListItem>
          </List>

          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            You agree NOT to:
          </Typography>
          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="Use automated tools to scrape or harvest data" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Share false or misleading information" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Attempt to reverse engineer our algorithms" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use the platform for commercial purposes without authorization" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Violate any applicable laws or regulations" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. AI Services and Limitations
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Our AI counselor is powered by advanced language models 
              including Meta's Llama models through OpenRouter API. While sophisticated, 
              AI recommendations should complement, not replace, professional counseling.
            </Typography>
          </Alert>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Advisory Nature"
                secondary="Our AI provides guidance and suggestions, not definitive career decisions"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data Accuracy"
                secondary="While we strive for accuracy, college information and requirements may change"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Personal Responsibility"
                secondary="You are responsible for verifying information and making your own decisions"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="No Guarantees"
                secondary="We do not guarantee admission to colleges or success in career paths"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Intellectual Property Rights
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            All content, features, and functionality of CareerVista AI are owned by us and 
            protected by copyright, trademark, and other intellectual property laws. 
            This includes our proprietary algorithms, assessment tools, and user interface designs.
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            <strong>Third-Party Content:</strong> We utilize AI models from Meta (Llama), 
            Microsoft, Mistral, and others through OpenRouter API. These models remain 
            the intellectual property of their respective owners.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. Privacy and Data Protection
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Your privacy is important to us. Our collection, use, and protection of your 
            personal information is governed by our Privacy Policy, which is incorporated 
            into these Terms by reference. By using our service, you consent to the 
            collection and use of your information as described in our Privacy Policy.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Payment and Subscription Terms
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Free Services"
                secondary="Basic features are provided free of charge with usage limitations"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Premium Features"
                secondary="Advanced features may require subscription or one-time payments"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Billing"
                secondary="Subscription fees are billed in advance and are non-refundable except as required by law"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Price Changes"
                secondary="We reserve the right to modify pricing with 30 days notice to existing subscribers"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Service Availability and Modifications
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We strive to maintain continuous service availability but do not guarantee 
            uninterrupted access. We may temporarily suspend service for maintenance, 
            updates, or technical issues. We reserve the right to modify, suspend, 
            or discontinue any aspect of our service at any time.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            10. Disclaimers and Limitation of Liability
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>IMPORTANT DISCLAIMER:</strong> Our service is provided "as is" without 
              warranties of any kind. We disclaim all warranties, express or implied, 
              including merchantability and fitness for a particular purpose.
            </Typography>
          </Alert>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="No Career Guarantees"
                secondary="We do not guarantee specific career outcomes or college admissions"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Information Accuracy"
                secondary="While we strive for accuracy, we cannot guarantee all information is current or correct"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Third-Party Content"
                secondary="We are not responsible for content or services provided by third parties"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Limitation of Damages"
                secondary="Our liability is limited to the amount you paid for our services in the last 12 months"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            11. Indemnification
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            You agree to indemnify and hold harmless CareerVista AI from any claims, 
            damages, or expenses arising from your use of our service, violation of 
            these Terms, or infringement of any rights of third parties.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            12. Termination
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Account Termination"
                secondary="You may terminate your account at any time through your account settings"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Service Termination"
                secondary="We may terminate or suspend your access for violations of these Terms"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Effect of Termination"
                secondary="Upon termination, your right to use the service ceases, but certain provisions survive"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Data Retention"
                secondary="We may retain your data as described in our Privacy Policy and applicable law"
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            13. Governing Law and Dispute Resolution
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            These Terms are governed by the laws of India. Any disputes arising from 
            these Terms or your use of our service will be resolved through binding 
            arbitration in accordance with the Arbitration and Conciliation Act, 2015.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            14. Changes to Terms
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We may update these Terms periodically. We will notify you of material 
            changes via email or platform notification at least 30 days before they 
            take effect. Continued use of our service after changes indicates acceptance 
            of the updated Terms.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            15. Severability
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            If any provision of these Terms is found to be unenforceable, the remaining 
            provisions will continue in full force and effect.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            16. Contact Information
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            For questions about these Terms of Service, please contact us:
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            <strong>Email:</strong> careervistaai@gmail.com<br />
            <strong>Phone:</strong> +91 6301 550 164<br />
            <strong>Subject Line:</strong> "Terms of Service Inquiry"
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Alert severity="success">
            <Typography variant="body2">
              <strong>Thank You:</strong> By using CareerVista AI, you're taking an important 
              step in your educational journey. We're here to support you while maintaining 
              clear terms for our mutual protection.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfServicePage;