import axios from 'axios';
import { getApiConfig } from '../utils/config';

// Get API configuration
const apiConfig = getApiConfig();

// Create axios instance with default config
const scholarshipApi = axios.create({
  baseURL: apiConfig.isDemoMode 
    ? 'https://jsonplaceholder.typicode.com/posts' // Demo endpoint
    : `${apiConfig.originalUrl}/api/scholarships`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
scholarshipApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ScholarshipFilters {
  search?: string;
  type?: string;
  sector?: string;
  minAmount?: number;
  maxAmount?: number;
  eligibilityOnly?: boolean;
  limit?: number;
  page?: number;
  sort?: 'amount' | 'deadline' | 'name' | 'matchScore';
  sortOrder?: 'asc' | 'desc';
}

export interface UserProfile {
  category: string;
  state: string;
  gender: string;
  pwd: boolean;
  percentage: number;
  familyIncome: number;
  course: string;
}

export interface ScholarshipResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  stats?: {
    total: number;
    eligible: number;
    totalFunding: number;
    avgAmount: number;
  };
  data: any[];
}

export interface ScholarshipStatsResponse {
  success: boolean;
  data: {
    total: number;
    totalFunding: number;
    averageAmount: number;
    byType: Array<{ _id: string; count: number; totalAmount: number }>;
    bySector: Array<{ _id: string; count: number; totalAmount: number }>;
    personalizedStats?: {
      eligible: number;
      partiallyEligible: number;
      eligibleFunding: number;
      eligibilityRate: number;
    };
  };
}

export const scholarshipService = {
  /**
   * Get scholarships with filtering and user profile matching
   */
  async getScholarships(filters: ScholarshipFilters = {}, userProfile?: UserProfile): Promise<ScholarshipResponse> {
    try {
      const params: any = { ...filters };
      
      if (userProfile) {
        params.userProfile = JSON.stringify(userProfile);
      }

      const response = await scholarshipApi.get('/', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching scholarships:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch scholarships');
    }
  },

  /**
   * Get scholarship by ID with optional user profile for eligibility calculation
   */
  async getScholarshipById(id: string, userProfile?: UserProfile) {
    try {
      const params: any = {};
      
      if (userProfile) {
        params.userProfile = JSON.stringify(userProfile);
      }

      const response = await scholarshipApi.get(`/${id}`, { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching scholarship:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch scholarship');
    }
  },

  /**
   * Get eligible scholarships for a user profile
   */
  async getEligibleScholarships(userProfile: UserProfile, limit = 20, page = 1): Promise<ScholarshipResponse> {
    try {
      const response = await scholarshipApi.post('/eligible', {
        userProfile,
        limit,
        page,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching eligible scholarships:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch eligible scholarships');
    }
  },

  /**
   * Get scholarship statistics
   */
  async getScholarshipStats(userProfile?: UserProfile): Promise<ScholarshipStatsResponse> {
    try {
      const params: any = {};
      
      if (userProfile) {
        params.userProfile = JSON.stringify(userProfile);
      }

      const response = await scholarshipApi.get('/stats', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching scholarship stats:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch scholarship statistics');
    }
  },

  /**
   * Add a single scholarship (admin only)
   */
  async addScholarship(scholarshipData: any) {
    try {
      const response = await scholarshipApi.post('/', scholarshipData);
      return response.data;
    } catch (error: any) {
      console.error('Error adding scholarship:', error);
      throw new Error(error.response?.data?.message || 'Failed to add scholarship');
    }
  },

  /**
   * Bulk add scholarships (admin only)
   */
  async bulkAddScholarships(scholarships: any[]) {
    try {
      const response = await scholarshipApi.post('/bulk', { scholarships });
      return response.data;
    } catch (error: any) {
      console.error('Error bulk adding scholarships:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk add scholarships');
    }
  },

  /**
   * Update scholarship (admin only)
   */
  async updateScholarship(id: string, scholarshipData: any) {
    try {
      const response = await scholarshipApi.put(`/${id}`, scholarshipData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating scholarship:', error);
      throw new Error(error.response?.data?.message || 'Failed to update scholarship');
    }
  },

  /**
   * Delete scholarship (admin only)
   */
  async deleteScholarship(id: string) {
    try {
      const response = await scholarshipApi.delete(`/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting scholarship:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete scholarship');
    }
  },
};

export default scholarshipService;