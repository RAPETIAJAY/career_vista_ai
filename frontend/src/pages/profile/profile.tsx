import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  Fade,
  Slide,
  Alert,
} from '@mui/material';
import {
  Person,
  School,
  Psychology,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/auth';


const ProfileSetupPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    class: user?.class || '',
    board: user?.board || '',
    state: user?.state || '',
    gender: user?.gender || '',
    income: '',
    interests: [] as string[],
    subjects: [] as Array<{ name: string; marks: number }>,
    stream: '',
    entranceScores: [] as Array<{ exam: string; score?: number; rank?: number; percentile?: number }>,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('profileFormData');
    const savedStep = localStorage.getItem('profileSetupStep');
    
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
    
    if (savedStep) {
      setActiveStep(parseInt(savedStep, 10));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('profileFormData', JSON.stringify(formData));
  }, [formData]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem('profileSetupStep', activeStep.toString());
  }, [activeStep]);

  const steps = [
    {
      label: 'Personal Information',
      icon: <Person />,
      description: 'Tell us about yourself',
    },
    {
      label: 'Academic Details',
      icon: <School />,
      description: 'Your educational background',
    },
    {
      label: 'Interests & Goals',
      icon: <Psychology />,
      description: 'What drives you?',
    },
  ];

  const interestOptions = [
    'Technology', 'Science', 'Mathematics', 'Arts', 'Sports', 'Music',
    'Literature', 'History', 'Geography', 'Economics', 'Business',
    'Medicine', 'Engineering', 'Design', 'Psychology', 'Social Work',
  ];

  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
    'Social Science', 'Hindi', 'Computer Science', 'Economics',
  ];

  const handleNext = () => {
    // Validate current step before proceeding
    if (!validateStep(activeStep)) {
      setError(`Please fill in all required fields for ${steps[activeStep].label}`);
      return;
    }
    
    // Backup data before proceeding
    backupFormData();
    
    // Clear any previous error
    setError('');
    
    // Proceed to next step
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    // Backup data before going back
    backupFormData();
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      // Map to backend schema
      const classNumeric = formData.class === '12' ? 12 : formData.class === '10' ? 10 : undefined;
      const boardMapped = formData.board === 'State Board' || formData.board === 'State' ? 'State Board' : formData.board;
      const streamLabel = formData.stream;
      const streamArea = streamLabel === 'MPC' || streamLabel === 'BiPC' ? 'Science'
        : streamLabel === 'MEC' || streamLabel === 'CEC' ? 'Commerce'
        : streamLabel === 'HEC' ? 'Arts' : undefined;
      const class12Details = classNumeric === 12 ? {
        stream: streamArea,
        subjects: Object.fromEntries((formData.subjects || []).map((s: any) => [s.name || 'Subject', s.marks || 0])),
        board: boardMapped,
        year: new Date().getFullYear(),
        percentage: (formData.subjects && formData.subjects.length)
          ? Math.round(((formData.subjects.reduce((a: number, s: any) => a + (s.marks || 0), 0) / (formData.subjects.length * 100)) * 100))
          : 0,
      } : undefined;
      const entranceScores = (formData.entranceScores || []).map((es: any) => ({
        examName: es.exam,
        score: es.score || 0,
        rank: es.rank,
        percentile: es.percentile,
        year: new Date().getFullYear(),
      }));
      
      const profileUpdateData = {
        name: formData.name,
        phone: formData.phone,
        class: classNumeric as any,
        board: boardMapped as any,
        state: formData.state,
        gender: formData.gender as any,
        income: (formData as any).income ? Number((formData as any).income) : undefined,
        interests: formData.interests,
        class12Details: class12Details as any,
        entranceScores: entranceScores as any,
        profileCompleted: true as any,
        lastUpdated: new Date().toISOString(),
      };
      
      await updateProfile(profileUpdateData as any);
      
      // Clear localStorage after successful submission
      localStorage.removeItem('profileFormData');
      localStorage.removeItem('profileSetupStep');
      
      // Save completion timestamp
      localStorage.setItem('profileCompletedAt', new Date().toISOString());
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Backup current form data
  const backupFormData = () => {
    const timestamp = new Date().toISOString();
    const backupData = {
      ...formData,
      backupTimestamp: timestamp,
      currentStep: activeStep,
    };
    localStorage.setItem(`profileBackup_${timestamp}`, JSON.stringify(backupData));
  };

  // Validate required fields for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.name && formData.phone && formData.class && formData.gender);
      case 1:
        return !!(formData.board && formData.state);
      case 2:
        return formData.interests.length > 0;
      default:
        return true;
    }
  };

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const updatedSubjects = [...formData.subjects];
    if (field === 'name') {
      // Check if subject is already selected in another dropdown
      const isAlreadySelected = formData.subjects.some((subject, i) => 
        i !== index && subject.name === value
      );
      
      if (isAlreadySelected) {
        setError(`"${value}" is already selected. Please choose a different subject.`);
        return;
      }
      
      updatedSubjects[index] = { ...updatedSubjects[index], name: value };
      setError(''); // Clear error if valid selection
    } else if (field === 'marks') {
      updatedSubjects[index] = { ...updatedSubjects[index], marks: parseInt(value) || 0 };
    }
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, { name: '', marks: 0 }]
    }));
  };

  const removeSubject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    label="Class"
                  >
                    <MenuItem value="10">10th Grade</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Board</InputLabel>
                  <Select
                    value={formData.board}
                    onChange={(e) => setFormData(prev => ({ ...prev, board: e.target.value }))}
                    label="Board"
                  >
                    <MenuItem value="CBSE">CBSE</MenuItem>
                    <MenuItem value="ICSE">ICSE</MenuItem>
                    <MenuItem value="State Board">State Board</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {formData.class === '12' && (
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Stream</InputLabel>
                    <Select
                      value={formData.stream}
                      onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                      label="Stream"
                    >
                      <MenuItem value="MPC">MPC (Math, Physics, Chemistry)</MenuItem>
                      <MenuItem value="BiPC">BiPC (Biology, Physics, Chemistry)</MenuItem>
                      <MenuItem value="MEC">MEC</MenuItem>
                      <MenuItem value="CEC">CEC</MenuItem>
                      <MenuItem value="HEC">HEC</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth required>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                    <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  label="Annual Family Income (₹)"
                  type="number"
                  value={formData.income}
                  onChange={(e) => setFormData(prev => ({ ...prev, income: e.target.value }))}
                />
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Subject Marks (10th Grade)
            </Typography>
            {formData.subjects.map((subject, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    label="Subject"
                  >
                    {subjectOptions.map(option => {
                      const isAlreadySelected = formData.subjects.some((sub, i) => 
                        i !== index && sub.name === option
                      );
                      return (
                        <MenuItem 
                          key={option} 
                          value={option}
                          disabled={isAlreadySelected}
                          sx={{
                            opacity: isAlreadySelected ? 0.5 : 1,
                            color: isAlreadySelected ? 'text.disabled' : 'text.primary'
                          }}
                        >
                          {option} {isAlreadySelected ? '(Already selected)' : ''}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  label="Marks"
                  type="number"
                  value={subject.marks}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(100, parseInt(e.target.value || '0')));
                    handleSubjectChange(index, 'marks', String(val));
                  }}
                  inputProps={{ min: 0, max: 100 }}
                  sx={{ width: 120 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeSubject(index)}
                  size="small"
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={addSubject}
              startIcon={<Star />}
              sx={{ mb: 3 }}
            >
              Add Subject
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Select Your Interests
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {interestOptions.map(interest => (
                <Chip
                  key={interest}
                  label={interest}
                  onClick={() => handleInterestToggle(interest)}
                  color={formData.interests.includes(interest) ? 'primary' : 'default'}
                  variant={formData.interests.includes(interest) ? 'filled' : 'outlined'}
                  sx={{
                    '&:hover': {
                      backgroundColor: formData.interests.includes(interest) 
                        ? theme.palette.primary.dark 
                        : theme.palette.primary.light,
                      color: 'white',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 4, minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container maxWidth="md">
        <Fade in timeout={1000}>
          <Card
            sx={{
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header */}
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  Complete Your Profile
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Help us personalize your career journey
                </Typography>
              </Box>

              {/* Stepper */}
              <Box sx={{ p: 4 }}>
                <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: activeStep >= index ? theme.palette.primary.main : 'rgba(0, 0, 0, 0.3)',
                              color: 'white',
                            }}
                          >
                            {activeStep > index ? <CheckCircle /> : step.icon}
                          </Box>
                        )}
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {step.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {step.description}
                          </Typography>
                        </Box>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Error Alert */}
                {error && (
                  <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    {error}
                  </Alert>
                )}

                {/* Step Content */}
                <Slide in timeout={500} direction="right">
                  <Box sx={{ mb: 4 }}>
                    {getStepContent(activeStep)}
                  </Box>
                </Slide>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                    sx={{ borderRadius: '12px' }}
                  >
                    Back
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      endIcon={<CheckCircle />}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      {loading ? 'Saving...' : 'Complete Profile'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
};

export default ProfileSetupPage;


