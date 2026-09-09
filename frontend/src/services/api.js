// AGRINOVA Centralized API Client

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to build full request URL and attach query params
 */
const buildUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${cleanEndpoint}`;
};

/**
 * Standard request execution wrapper
 */
const request = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const token = localStorage.getItem('agrinova-token');

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (import.meta.env.DEV) {
    console.log(`API REQUEST: ${config.method || 'GET'} ${url}`);
  }

  try {
    const response = await fetch(url, config);
    let data = null;

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, message: text };
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `HTTP error ${response.status}: ${response.statusText}`;
      const errorCode = data?.errorCode || `HTTP_${response.status}`;
      return {
        success: false,
        message: errorMessage,
        errorCode,
        status: response.status,
        data: null
      };
    }

    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[API Network Error] ${config.method || 'GET'} ${url}:`, error.message);
    }
    return {
      success: false,
      message: error.message === 'Failed to fetch' 
        ? 'Cannot connect to SA Group server. Please ensure backend is running.' 
        : error.message,
      errorCode: 'NETWORK_ERROR',
      data: null
    };
  }
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body)
  }),

  put: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'PUT',
    body: typeof body === 'string' ? body : JSON.stringify(body)
  }),

  patch: (endpoint, body, options = {}) => request(endpoint, {
    ...options,
    method: 'PATCH',
    body: typeof body === 'string' ? body : JSON.stringify(body)
  }),

  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' })
};

export default api;
