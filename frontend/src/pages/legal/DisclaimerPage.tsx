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

const DisclaimerPage: React.FC = () => {
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
            Disclaimer
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
              The information provided on CareerVista AI is for educational and informational 
              purposes only. Please read this disclaimer carefully before using our services.
            </Typography>
          </Alert>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. Educational Guidance Disclaimer
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            CareerVista AI provides educational and career guidance through AI-powered 
            tools and recommendations. This guidance is meant to supplement, not replace, 
            professional career counseling, academic advising, or educational planning 
            services. Users should verify all information independently and consult with 
            qualified professionals for important educational and career decisions.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. AI-Generated Content Limitations
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Accuracy Not Guaranteed"
                secondary="AI-generated career advice, college recommendations, and educational guidance may contain errors, omissions, or biases. We do not guarantee the accuracy or completeness of AI responses."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Model Limitations"
                secondary="Our AI models (including Meta Llama, Microsoft Phi, Mistral, and others) have inherent limitations and may produce incorrect or inappropriate responses despite our best efforts."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Not Professional Advice"
                secondary="AI-generated content should not be considered professional career counseling, academic advising, or psychological guidance."
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. College and University Information
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Information about colleges, universities, entrance exams, cutoffs, fees, 
            and placement statistics is compiled from publicly available sources and 
            may not be current or accurate. Admission requirements, fees, and policies 
            change frequently. Users must verify all information directly with the 
            respective institutions before making decisions.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Scholarship and Financial Aid Information
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Scholarship information, eligibility criteria, deadlines, and award amounts 
            are subject to change. We do not guarantee the availability or accuracy of 
            scholarship opportunities listed on our platform. Users should verify all 
            details with the scholarship providers directly.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Test Results and Assessments
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our adaptive tests and assessments are designed for guidance purposes only. 
            Results should not be considered definitive measures of aptitude, intelligence, 
            or career suitability. Test results may vary and should be interpreted in 
            conjunction with other factors and professional guidance.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Third-Party Content and Links
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform may contain links to third-party websites, resources, or services. 
            We do not endorse or assume responsibility for the content, accuracy, or 
            practices of these external sites. Users access third-party content at their own risk.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. No Guarantee of Outcomes
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText primary="We do not guarantee admission to any educational institution" />
            </ListItem>
            <ListItem>
              <ListItemText primary="We do not guarantee scholarship awards or financial aid" />
            </ListItem>
            <ListItem>
              <ListItemText primary="We do not guarantee specific career outcomes or job placement" />
            </ListItem>
            <ListItem>
              <ListItemText primary="We do not guarantee success in entrance exams or academic performance" />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Service Availability
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform depends on third-party AI services, databases, and internet 
            connectivity. We do not guarantee uninterrupted service availability and 
            may experience downtime, rate limiting, or service interruptions beyond our control.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Regional and Cultural Context
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform is primarily designed for the Indian education system. 
            Advice and recommendations may not be applicable to other educational 
            systems or cultural contexts. International users should seek guidance 
            specific to their local educational requirements.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            10. Age and Parental Guidance
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform is intended for students aged 14 and above. We recommend 
            parental or guardian involvement in educational planning, especially for 
            users under 18. Parents should review and guide their children's use of 
            our platform and any decisions based on our recommendations.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            11. Medical and Psychological Considerations
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Our platform does not provide medical, psychological, or mental health 
            advice. Students with specific learning needs, disabilities, or mental 
            health concerns should consult qualified professionals for appropriate 
            guidance and support.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            12. Limitation of Liability
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            To the maximum extent permitted by law, CareerVista AI and its team 
            shall not be liable for any direct, indirect, incidental, special, 
            consequential, or punitive damages arising from the use of our platform 
            or reliance on our recommendations.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            13. Updates and Changes
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Educational landscapes, entrance exam patterns, and institutional policies 
            change frequently. While we strive to keep information current, we cannot 
            guarantee that all content reflects the latest changes. Users should verify 
            current information from official sources.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            14. Contact for Clarifications
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            For questions about this disclaimer or our services, contact us at:<br />
            <strong>Email:</strong> careervistaai@gmail.com<br />
            <strong>Phone:</strong> +91 6301 550 164
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Alert severity="info">
            <Typography variant="body2">
              <strong>Remember:</strong> CareerVista AI is a guidance tool to help you 
              explore options and make informed decisions. Always verify important information 
              independently and consult with parents, teachers, and professional counselors 
              for major educational and career decisions.
            </Typography>
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
};

export default DisclaimerPage;