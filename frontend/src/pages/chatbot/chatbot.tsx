import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Stack,
  Fade,
  Zoom,
  useTheme,
  styled,
  alpha
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  Refresh as RefreshIcon,

} from '@mui/icons-material';
import api from '@/services/auth';


// Styled components for modern look
const ChatContainer = styled(Paper)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.background.paper,
  border: 'none',
  boxShadow: 'none',
  overflow: 'hidden'
}));



const MessageBubble = styled(Box)<{ isUser?: boolean }>(({ theme, isUser }) => ({
  maxWidth: '85%',
  padding: theme.spacing(1.2, 1.8),
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  background: isUser 
    ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    : 'rgba(255, 255, 255, 0.9)',
  color: isUser ? 'white' : theme.palette.text.primary,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, isUser ? 0 : 0.1)}`,
  boxShadow: isUser 
    ? '0 4px 16px rgba(0, 0, 0, 0.15)' 
    : '0 2px 12px rgba(0, 0, 0, 0.08)',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  margin: theme.spacing(0.3, 0),
  wordBreak: 'break-word',
  fontSize: '0.875rem',
  lineHeight: 1.4
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  '& .dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    animation: 'typing 1.4s infinite ease-in-out',
    '&:nth-of-type(1)': { animationDelay: '-0.32s' },
    '&:nth-of-type(2)': { animationDelay: '-0.16s' }
  },
  '@keyframes typing': {
    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.5 },
    '40%': { transform: 'scale(1)', opacity: 1 }
  }
}));

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CareerChatbotProps {
  className?: string;
  userClass?: '10' | '12';
  userStream?: string;
}

const CareerChatbot: React.FC<CareerChatbotProps> = ({
  className,
  userClass = '12',
  userStream
}) => {
  const theme = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Load saved messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Error loading saved messages:', error);
        localStorage.removeItem('chatbot-messages'); // Remove corrupted data
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load initial suggestions and welcome message only if no saved messages
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-messages');
    if (!savedMessages || JSON.parse(savedMessages).length === 0) {
      loadSuggestions();
    } else {
      // Still load suggestions for the UI, but don't add welcome message
      loadSuggestionsOnly();
    }
  }, [userClass, userStream]);

  const loadSuggestionsOnly = async () => {
    try {
      const response = await api.get('/chatbot/suggestions', {
        params: {
          userClass,
          stream: userStream,
          interests: []
        }
      });

      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
        setWelcomeMessage(response.data.data.welcomeMessage);
      }
    } catch (error) {
      console.error('Failed to load chatbot suggestions:', error);
      setWelcomeMessage("Hi! I'm your CareerVista AI counselor. How can I help you with your career planning today?");
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await api.get('/chatbot/suggestions', {
        params: {
          userClass,
          stream: userStream,
          interests: [] // TODO: Get from user profile
        }
      });

      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
        setWelcomeMessage(response.data.data.welcomeMessage);
        
        // Only add welcome message if no messages exist (fresh start)
        const savedMessages = localStorage.getItem('chatbot-messages');
        if (!savedMessages || JSON.parse(savedMessages).length === 0) {
          setMessages([{
            role: 'assistant',
            content: response.data.data.welcomeMessage,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (error) {
      console.error('Failed to load chatbot suggestions:', error);
      const defaultWelcome = "Hi! I'm your CareerVista AI counselor. How can I help you with your career planning today?";
      setWelcomeMessage(defaultWelcome);
      
      // Only add welcome message if no messages exist
      const savedMessages = localStorage.getItem('chatbot-messages');
      if (!savedMessages || JSON.parse(savedMessages).length === 0) {
        setMessages([{
          role: 'assistant',
          content: defaultWelcome,
          timestamp: new Date().toISOString()
        }]);
      }
    }
  };

  const sendMessage = async (messageText: string = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/chat', {
        message: messageText.trim(),
        userContext: {
          class: userClass,
          stream: userStream,
          interests: [], // TODO: Get from user profile
          previousChats: messages.slice(-10) // Send last 10 messages for context
        }
      });

      if (response.data.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.data.data.message,
          timestamp: response.data.data.timestamp
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage = error.response?.data?.message || 
        "I'm sorry, I encountered an error. Please try again in a moment.";
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMsg = {
      role: 'assistant' as const,
      content: welcomeMessage,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
    // Clear localStorage when chat is cleared
    localStorage.removeItem('chatbot-messages');
    // Save the welcome message
    localStorage.setItem('chatbot-messages', JSON.stringify([welcomeMsg]));
  };

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .split('\n')
      .map((line, index) => (
        <Typography 
          key={index} 
          variant="body2" 
          component="div"
          sx={{ 
            mb: line.trim() ? 1 : 0,
            '&:last-child': { mb: 0 }
          }}
        >
          {line.trim() || ' '}
        </Typography>
      ));
  };

  return (
    <ChatContainer className={className}>
      {/* Messages Area */}
      <Box 
        sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          height: 'calc(100% - 80px)',
          background: 'transparent',
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { 
            background: alpha(theme.palette.primary.main, 0.3),
            borderRadius: 2
          }
        }}
      >
        {messages.map((message, index) => (
          <Fade key={index} in timeout={500}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1,
              flexDirection: message.role === 'user' ? 'row' : 'row',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 0.5
            }}>
              {message.role === 'assistant' && (
                <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main, fontSize: '0.75rem' }}>
                  <BotIcon sx={{ fontSize: 14 }} />
                </Avatar>
              )}
              
              <MessageBubble isUser={message.role === 'user'}>
                {formatMessage(message.content)}
              </MessageBubble>
              
              {message.role === 'user' && (
                <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.secondary.main, fontSize: '0.75rem' }}>
                  <UserIcon sx={{ fontSize: 14 }} />
                </Avatar>
              )}
            </Box>
          </Fade>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <Zoom in>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main }}>
                <BotIcon sx={{ fontSize: 14 }} />
              </Avatar>
              <MessageBubble>
                <TypingIndicator>
                  <Typography variant="caption" sx={{ mr: 1, fontSize: '0.75rem' }}>
                    AI is thinking
                  </Typography>
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </TypingIndicator>
              </MessageBubble>
            </Box>
          </Zoom>
        )}

        {/* Quick Suggestions */}
        {messages.length <= 1 && suggestions.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block', fontSize: '0.75rem' }}>
              💡 Try asking:
            </Typography>
            <Stack direction="column" spacing={0.5}>
              {suggestions.slice(0, 2).map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  variant="outlined"
                  size="small"
                  onClick={() => sendMessage(suggestion)}
                  sx={{ 
                    alignSelf: 'flex-start',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    height: 'auto',
                    '& .MuiChip-label': { 
                      py: 0.5,
                      px: 1,
                      whiteSpace: 'normal',
                      textAlign: 'left'
                    },
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={{ 
        p: 1.5, 
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '0 0 20px 20px'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={2}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about careers, streams, colleges..."
            disabled={isLoading}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.875rem',
                '& fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                }
              },
              '& .MuiInputBase-input': {
                py: 1
              }
            }}
          />
          <IconButton
            onClick={clearChat}
            disabled={isLoading}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.2) }
            }}
            title="Clear chat"
          >
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            onClick={() => sendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            size="small"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { bgcolor: theme.palette.primary.dark },
              '&:disabled': { bgcolor: alpha(theme.palette.action.disabled, 0.3) }
            }}
          >
            {isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>
      </Box>
    </ChatContainer>
  );
};

export default CareerChatbot;