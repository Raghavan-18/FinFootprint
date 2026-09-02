/**
 * Clean REST API Service Layer for FinFootprint
 *
 * Handles all frontend -> backend HTTP communication with FastAPI server.
 * Connects to Evidence Engine and ML Services while supporting structured errors.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

/**
 * Standard HTTP request wrapper with timeout and robust error formatting
 *
 * @param {string} endpoint - Path (e.g. '/api/health' or '/api/analyze/activity')
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<Object>} Formatted API response
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { raw: text };
    }

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        data?.detail ||
        `Request failed with status ${response.status}`;

      return {
        success: false,
        status: response.status,
        error: {
          code: data?.error?.code || `HTTP_${response.status}`,
          message: errorMessage,
        },
      };
    }

    // If backend already returned { success: true, data: ... }
    if (data && typeof data === 'object' && 'success' in data) {
      return data;
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error(`[FinFootprint API Error] ${endpoint}:`, err);
    return {
      success: false,
      status: 0,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the analysis service. Please check your connection or backend server.',
        originalError: err.message,
      },
    };
  }
}

/**
 * API Service Object
 */
export const apiService = {
  /**
   * Health check endpoint to verify Python FastAPI backend status
   *
   * @returns {Promise<{success: boolean, data?: {status: string, service: string}, error?: Object}>}
   */
  async getHealthCheck() {
    return request('/api/health', { method: 'GET' });
  },

  /**
   * Analyze a single financial activity using Evidence Engine on the Python backend
   *
   * @param {Object} activityData - Financial activity record
   * @returns {Promise<{success: boolean, data?: {evidence: Object, analysis: Object}, error?: Object}>}
   */
  async analyzeFinancialActivity(activityData) {
    return request('/api/analyze/activity', {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },

  /**
   * Analyze worker's profile of activities using Python ML engines (behavior & anomalies)
   *
   * @param {Object} profileData - Contains { activities: Array<Object> }
   * @returns {Promise<{success: boolean, data?: {metrics: Array, anomalies: Array, hasSufficientData: boolean}, error?: Object}>}
   */
  async analyzeFinancialProfile(profileData) {
    return request('/api/analyze/profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Submit/Record activity alias
   *
   * @param {Object} payload
   */
  async submitFinancialActivity(payload) {
    return this.analyzeFinancialActivity(payload);
  },

  /**
   * Fetch aggregate profile info (FastAPI endpoint)
   */
  async getProfile() {
    return request('/api/profile', { method: 'GET' });
  },

  /**
   * Fetch financial stats (FastAPI endpoint)
   */
  async getFinancialStats() {
    return request('/api/financial-stats', { method: 'GET' });
  },

  /**
   * Fetch monthly cashflows (FastAPI endpoint)
   */
  async getCashflows() {
    return request('/api/cashflows', { method: 'GET' });
  },

  /**
   * Fetch transactions (FastAPI endpoint)
   */
  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/api/transactions${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  /**
   * Fetch full analysis report (FastAPI endpoint)
   */
  async getAnalysis() {
    return request('/api/analysis', { method: 'GET' });
  },

  /**
   * Fetch institutional lender report (FastAPI endpoint)
   */
  async getLenderReport() {
    return request('/api/lender-report', { method: 'GET' });
  },
};

// Also export standalone helper functions for direct import
export const getHealthCheck = () => apiService.getHealthCheck();
export const analyzeFinancialActivity = (data) => apiService.analyzeFinancialActivity(data);
export const analyzeFinancialProfile = (data) => apiService.analyzeFinancialProfile(data);

export default apiService;
