import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // Browser should use the current origin
  if (typeof window !== 'undefined') return window.location.origin;
  
  // Vercel production deployment - hardcode the production URL
  if (process.env.VERCEL_URL) return 'https://www.lifexai.tech';
  
  // Vercel preview deployment
  if (process.env.VERCEL_ENV === 'preview') 
    return `https://${process.env.VERCEL_URL}`;
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

// Create a configured axios instance with baseURL
const api = axios.create({
  baseURL: getBaseUrl()
});

export interface HealthLog {
  _id?: string;
  user_id: string;
  date: string;
  mood: "Happy" | "Sad" | "Anxious" | "Neutral";
  sleep_hours: number;
  meals: number;
  exercise_minutes: number;
  symptoms: string;
  location?: { lat: number; lon: number };
}

export interface UserInsight {
  _id?: string;
  user_id: string;
  week_of: string;
  health_summary: string;
  financial_summary: string;
  recommendations: string[];
}

// Save a health log entry
export const saveHealthLog = async (healthLog: Omit<HealthLog, '_id'>): Promise<HealthLog> => {
  try {
    const response = await api.post('/api/health/logs', healthLog);
    return response.data;
  } catch (err) {
    console.error('Health log save error:', err);
    throw new Error('Failed to save health log');
  }
};

// Get health logs for a user
export const getUserHealthLogs = async (userId: string): Promise<HealthLog[]> => {
  try {
    const response = await api.get(`/api/health/logs?userId=${userId}`);
    return response.data;
  } catch (err) {
    console.error('Health logs fetch error:', err);
    throw new Error('Failed to fetch health logs');
  }
};

// Get the latest health log for a user
export const getLatestHealthLog = async (userId: string): Promise<HealthLog | null> => {
  try {
    const response = await api.get(`/api/health/logs/latest?userId=${userId}`);
    return response.data;
  } catch (err) {
    console.error('Latest health log fetch error:', err);
    throw new Error('Failed to fetch latest health log');
  }
};

// Get health insights for a user
export const getUserHealthInsights = async (userId: string): Promise<UserInsight[]> => {
  try {
    const response = await api.get(`/api/health/insights?userId=${userId}`);
    return response.data;
  } catch (err) {
    console.error('Health insights fetch error:', err);
    throw new Error('Failed to fetch health insights');
  }
};

// Get the latest health insight for a user
export const getLatestHealthInsight = async (userId: string): Promise<UserInsight | null> => {
  try {
    const response = await api.get(`/api/health/insights/latest?userId=${userId}`);
    return response.data;
  } catch (err) {
    console.error('Latest health insight fetch error:', err);
    throw new Error('Failed to fetch latest health insight');
  }
};

// Define the type for regional health trends
export interface RegionalHealthTrend {
  region: string;
  symptoms: Array<{
    name: string;
    count: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  alert_level: 'low' | 'moderate' | 'high';
  prediction: string;
}

// Get regional health trends (for disease prediction)
export const getRegionalHealthTrends = async (): Promise<RegionalHealthTrend[]> => {
  try {
    console.log('Making API request to /api/health/trends/regional');
    const response = await api.get('/api/health/trends/regional', {
      timeout: 10000, // 10 second timeout
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    console.log('API response received:', response.status, response.statusText);
    console.log('Response data:', response.data);
    return response.data;
  } catch (err) {
    console.error('Regional health trends fetch error:', err);
    if (axios.isAxiosError(err)) {
      console.error('Axios error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });
      throw new Error(`Failed to fetch regional health trends: ${err.message}`);
    }
    throw new Error('Failed to fetch regional health trends');
  }
};

// Get health myths and facts
export const getHealthMythsAndFacts = async (): Promise<{ myth: string; fact: string }[]> => {
  try {
    const response = await api.get('/api/health/myths');
    return response.data;
  } catch (err) {
    console.error('Health myths fetch error:', err);
    throw new Error('Failed to fetch health myths and facts');
  }
};
