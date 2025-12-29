


// About API functions
import apiClient from './api';


export const getAboutList = async () => {
  try {
    return await apiClient('/about');
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch about list' };
  }
};

export const createAbout = async (data) => {
  try {
    return await apiClient(`/about`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create about item' };
  }
};

export const updateAbout = async (id, data) => {
  try {
    return await apiClient(`/about/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update about item' };
  }
};

export const getAboutById = async (id) => {
  try {
    return await apiClient(`/about/${id}`);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch about item' };
  }
};

export const deleteAbout = async (id) => {
  try {
    return await apiClient(`/about/${id}`, { method: 'DELETE' });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete about item' };
  }
};
