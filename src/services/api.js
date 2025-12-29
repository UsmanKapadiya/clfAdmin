// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API client with common configuration
const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Only set Content-Type to application/json if not sending FormData
  let headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const config = {
    headers,
    ...options,
  };

  // Add token to headers if it exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

export default apiClient;
