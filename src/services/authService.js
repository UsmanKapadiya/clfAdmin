import apiClient from './api';

// Admin login service
export const loginAdmin = async (username, password) => {
  try {
    const response = await apiClient('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.success) {
      // Store token and user data
      const { token, data: admin } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      if (admin) {
        localStorage.setItem('user', JSON.stringify(admin));
      }

      return { 
        success: true, 
        user: admin,
        token: token
      };
    }

    return response;
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Login failed' 
    };
  }
};

// Admin logout service
export const logoutAdmin = async () => {
  try {
    // Call logout API endpoint
    const response = await apiClient('/admin/logout', {
      method: 'POST',
    });

    // Clear local storage regardless of API response
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return { success: true };
  } catch (error) {
    // Even if API call fails, clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { 
      success: true, // Return success since we cleared local data
      error: error.message 
    };
  }
};


// Get current admin profile
export const getAdminProfile = async () => {
  try {
    const response = await apiClient('/admin/profile', {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Failed to fetch profile' 
    };
  }
};
