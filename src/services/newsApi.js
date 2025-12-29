import apiClient from './api';

const API_BASE = '/news';

export const getAllNews = async (page, limit) => {
    try {
        return await apiClient(`${API_BASE}?page=${page}&limit=${limit}`);
    } catch (error) {
        return { success: false, error: error.message || 'Failed to fetch about list' };
    }
};

export const getNewsById = async (id) => {
  try {
    return await apiClient(`${API_BASE}/${id}`);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch about item' };
  }
};

export const createNews = async (data) => {
  try {
    return await apiClient(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create news item' };
  }
};

export const updateNews = async (id, data) => {
  try {
    return await apiClient(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update news item' };
  }
};

export const deleteNews = async (id) => {
  try {
    return await apiClient(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete news item' };
  }
};
