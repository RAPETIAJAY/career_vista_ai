import axios, { AxiosError } from 'axios'
import { getApiConfig, showDemoModeWarning } from '../utils/config'

// Get API configuration
const apiConfig = getApiConfig()

// Show demo mode warning if applicable
showDemoModeWarning()

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle network/connection errors gracefully
    if (!error.response) {
      console.warn('🌐 API connection failed. Running in offline/demo mode.')
      // You could return mock data here for demo purposes
      return Promise.reject({
        ...error,
        message: 'API unavailable - running in demo mode',
        isOffline: true
      })
    }

    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/signin'
    }
    
    return Promise.reject(error)
  }
)

// AI services for stream prediction and analysis
export const aiService = {
  // Get stream prediction based on user's test results and profile
  predictStream: () => api.get('/ai/predict-stream'),
  
  // Get detailed test analysis
  analyzeTest: () => api.get('/ai/analyze-test'),
  
  // Get stream narrative information
  getStreamNarrative: (params: {
    stream: string;
    state?: string;
    category?: string;
    interests?: string[];
    scores?: any;
  }) => api.post('/ai/stream-narrative', params),
  
  // Get weight explanation for predictions
  explainWeights: () => api.get('/ai/explain-weights'),
  
  // Get salary insights for career fields
  getSalaryInsights: (params: {
    careerField: string;
    location?: string;
    stream?: string;
    experience?: string;
  }) => api.post('/ai/salary-insights', params),
}

// Chatbot services
export const chatbotService = {
  // Chat with AI counselor
  chat: (params: {
    message: string;
    userContext?: {
      class?: '10' | '12';
      stream?: string;
      interests?: string[];
      previousChats?: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
      }>;
    };
  }) => api.post('/chatbot/chat', params),
  
  // Get conversation suggestions
  getSuggestions: (params?: {
    userClass?: '10' | '12';
    stream?: string;
    interests?: string[];
  }) => api.get('/chatbot/suggestions', { params }),
  
  // Get personalized recommendation based on user data
  getPersonalizedRecommendation: () => api.get('/chatbot/personalized-recommendation'),
}

export default api