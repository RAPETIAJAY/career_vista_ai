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

const AIUsagePolicyPage: React.FC = () => {
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
            AI Usage Policy
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

          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            AI Models and Technologies
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            CareerVista AI utilizes various artificial intelligence models and technologies to provide 
            career guidance and educational recommendations. This policy outlines our use of AI and 
            the associated terms and conditions.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            1. AI Models Used
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Our platform integrates the following AI technologies:
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Meta Llama Models"
                secondary="We use Meta Llama 3.3 70B, Llama 3.1 8B, and other Llama variants through OpenRouter API for conversational AI and career counseling services."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Microsoft Phi Models"
                secondary="Phi-3 Medium and Mini models for efficient processing and quick responses."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Mistral AI Models"
                secondary="Mistral 7B and related variants for specialized educational guidance."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Qwen Models"
                secondary="Qwen 2 7B for diverse language understanding and response generation."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Other Open Source Models"
                secondary="Various open-source models including Gemma, Zephyr, and OpenChat for redundancy and reliability."
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            2. License Compliance
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            <strong>Meta Llama Usage:</strong> Our use of Meta Llama models complies with Meta's 
            Custom Commercial License. We acknowledge that Llama models are developed by Meta 
            and are used under their licensing terms. All Llama model outputs are subject to 
            Meta's usage policies and acceptable use guidelines.
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            <strong>Open Source Models:</strong> We use open-source AI models in compliance with 
            their respective licenses (Apache 2.0, MIT, etc.). We acknowledge the contributions 
            of the open-source AI community and maintain attribution as required.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            3. AI-Generated Content Disclaimer
          </Typography>

          <List sx={{ mb: 3 }}>
            <ListItem>
              <ListItemText
                primary="Educational Purpose"
                secondary="AI-generated career advice and educational guidance are for informational purposes only and should not replace professional counseling."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Accuracy Limitation"
                secondary="While we strive for accuracy, AI-generated content may contain errors or biases. Users should verify important information independently."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="No Warranty"
                secondary="We do not guarantee the accuracy, completeness, or reliability of AI-generated content."
              />
            </ListItem>
          </List>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            4. Data Usage and Privacy
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            User conversations with our AI systems are processed through third-party AI services 
            (OpenRouter API). We implement privacy measures but acknowledge that data may be 
            processed by AI model providers. Please refer to our Privacy Policy for detailed 
            information about data handling.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            5. Intellectual Property
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            • Meta Llama models and their outputs remain subject to Meta's intellectual property rights<br />
            • Our platform implementation and custom prompts are proprietary to CareerVista AI<br />
            • User-generated content and inputs remain the property of the user<br />
            • AI-generated responses are not copyrightable but usage is subject to model provider terms
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            6. Acceptable Use
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            Users must not use our AI services for harmful, illegal, or unethical purposes. 
            This includes but is not limited to generating false information, harassment, 
            or content that violates AI model provider guidelines.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            7. Service Availability
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            AI services depend on third-party providers and may experience downtime or rate 
            limiting. We implement fallback mechanisms but cannot guarantee 100% availability.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            8. Changes to AI Services
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
            We may update, modify, or discontinue AI models and services at any time. 
            This policy will be updated to reflect any changes in our AI usage.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            9. Contact Information
          </Typography>

          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            For questions about our AI usage policy, please contact us at: 
            <strong> careervistaai@gmail.com</strong>
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
            This policy is part of our Terms of Service and is subject to our Privacy Policy.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AIUsagePolicyPage;