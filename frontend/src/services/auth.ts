import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { getApiConfig } from '../utils/config'

// Get API configuration
const apiConfig = getApiConfig()

// Create axios instance with base URL
const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Lightweight retry settings on the request config
type RetryConfig = {
  __retryCount?: number
  retry?: number
  retryDelayMs?: number
}

const isIdempotentMethod = (method?: string) => {
  const m = (method || 'get').toUpperCase()
  return m === 'GET' || m === 'HEAD' || m === 'OPTIONS' || m === 'DELETE'
}

const shouldRetryError = (error: AxiosError) => {
  const status = error.response?.status
  // Retry on network errors, timeouts, and 5xx
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) return true
  if (!status) return true
  return status >= 500 && status < 600
}

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
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/signin'
    }
    
    // Handle 400 Bad Request errors with more detailed logging
    if (error.response?.status === 400) {
      console.error('Bad Request Error:', {
        endpoint: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        responseData: error.response?.data
      })
    }
    
    // Retry logic (idempotent methods only)
    const config = (error.config || {}) as AxiosRequestConfig & RetryConfig
    if (isIdempotentMethod(config.method) && shouldRetryError(error)) {
      config.__retryCount = config.__retryCount || 0
      const maxRetries = config.retry ?? 2
      const baseDelay = config.retryDelayMs ?? 500
      if (config.__retryCount < maxRetries) {
        config.__retryCount += 1
        const delay = baseDelay * Math.pow(2, config.__retryCount - 1) + Math.random() * 100
        await new Promise((r) => setTimeout(r, delay))
        return api(config)
      }
    }

    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  sendOtp: (email: string) => api.post('/auth/send-otp', { email }),
  login: (email: string, otp: string) => api.post('/auth/login', { email, otp }),
  loginWithGoogle: (token: string) => api.post('/auth/google', { token }),
  getProfile: () => api.get('/auth/me'),
}

// User services
export const userService = {
  updateProfile: (profileData: any) => api.put('/users/profile', profileData),
  updatePreferences: (preferences: any) => api.put('/users/preferences', preferences),
  getRecommendations: () => api.get('/users/recommendations'),
  getProfileSummary: () => api.get('/users/profile-summary'),
  saveItem: (type: 'college' | 'scholarship' | 'loan', itemId: string) =>
    api.post('/users/saved-items', { type, itemId }),
  getSavedItems: (type?: 'college' | 'scholarship' | 'loan') =>
    api.get('/users/saved-items', { params: { type } }),
}

// Test services
export const testService = {
  getAcademicQuestions: () =>
    api.get('/tests/academic'),
  submitAcademicTest: (data: { 
    answers: Array<{ questionId: string; selectedOption: number }>, 
    testDuration?: number,
    violations?: number 
  }) =>
    api.post('/tests/academic/submit', data),
  getTestResults: (testId: string) =>
    api.get(`/tests/results/${testId}`),
  getQuestions: (classLevel: '10th' | '12th', count: number = 15) =>
    api.get(`/mcqs?class=${classLevel}&count=${count}`),
  submitTest: (answers: Array<{ questionId: string; answer: string }>) =>
    api.post('/tests/submit', { answers }),
  getRecommendationsFromTest: (testId: string) =>
    api.get(`/tests/${testId}/recommendations`),
}

// Recommender services
export const recommenderService = {
  getStreamRecommendations: (userId: string) =>
    api.get(`/recommendations/stream/${userId}`),
  getCollegePredictions: (params: {
    examType: string
    score: number
    category: string
    state: string
  }) => api.post('/recommendations/colleges', params),
  getCareerOptions: (stream: string) =>
    api.get(`/recommendations/careers/${stream}`),
  getPersonalizedRecommendations: (userId: string) =>
    api.get(`/recommendations/personalized/${userId}`),
}

// College services
export const collegeService = {
  getColleges: (params: any) => api.get('/colleges', { params }),
  getCollegeById: (id: string) => api.get(`/colleges/${id}`),
  compareColleges: (collegeIds: string[]) =>
    api.post('/colleges/compare', { collegeIds }),
  predict: (input: { exam: 'JEE' | 'NEET' | 'EAMCET'; score: number; category?: string; homeState?: string }) =>
    api.post('/colleges/predict', input),
  getCollegeRankings: (params: { category: string; year: number }) =>
    api.get('/colleges/rankings', { params }),
  getCollegeReviews: (collegeId: string) =>
    api.get(`/colleges/${collegeId}/reviews`),
  submitCollegeReview: (collegeId: string, reviewData: any) =>
    api.post(`/colleges/${collegeId}/reviews`, reviewData),
}

// AI College Predictor services (12th class end-to-end)
export const collegePredictorService = {
  predict: (payload: { entranceScores: any[]; preferences?: any }) =>
    api.post('/college-predictor/predict', payload),
  compare: (collegeIds: string[]) =>
    api.post('/college-predictor/compare', { collegeIds }),
  whatIf: (payload: { entranceScores: any[]; preferences?: any; tweaks: any }) =>
    api.post('/college-predictor/what-if', payload),
}

// Scholarship services
export const scholarshipService = {
  getScholarships: (params: any) => api.get('/scholarships', { params }),
  getScholarshipById: (id: string) => api.get(`/scholarships/${id}`),
  getEligible: (input: { stream?: string; category?: string; income?: number; state?: string; }) =>
    api.post('/scholarships/eligible', input),
  applyForScholarship: (scholarshipId: string, applicationData: any) =>
    api.post(`/scholarships/${scholarshipId}/apply`, applicationData),
  getApplicationStatus: (applicationId: string) =>
    api.get(`/scholarships/application/${applicationId}`),
}

// Loan services
export const loanService = {
  getLoans: (params: any) => api.get('/loans', { params }),
  getLoanById: (id: string) => api.get(`/loans/${id}`),
  getEligible: (input: { stream?: string; amount?: number; collateral?: boolean }) =>
    api.post('/loans/eligible', input),
  calculateEMI: (params: { principal: number; interestRate: number; tenureYears: number }) =>
    api.post('/loans/calculate-emi', params),
  compareLoans: (loanIds: string[]) =>
    api.post('/loans/compare', { loanIds }),
}

export default api