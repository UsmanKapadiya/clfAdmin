
// About API functions
import apiClient from './api';

//Photos

export const getGalleryList = async () => {
  try {
    return await apiClient('/gallery/list-by-year');
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch gallery list' };
  }
};

export const createGallery = async (data, id) => {
  try {
    // If data is FormData, don't set Content-Type (browser will set it)
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return await apiClient(`/gallery`, {
      method: 'POST',
      body: data,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create gallery item' };
  }
};

export const updateGallery = async (id, data) => {
  try {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return await apiClient(`/gallery/${id}`, {
      method: 'PUT',
      body: data,
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update gallery item' };
  }
};

export const getGalleryById = async (id) => {
  try {
    return await apiClient(`/gallery/${id}`);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch gallery item' };
  }
};

export const deleteGallery = async (id) => {
  try {
    return await apiClient(`/gallery/${id}`, { method: 'DELETE' });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete gallery item' };
  }
};

// Videos

export const getVideoGalleryList = async () => {
  try {
    return await apiClient('/videos');
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch video gallery list' };
  }
};

export const createVideoGallery = async (data) => {
  try {
    return await apiClient('/videos', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to create video gallery item' };
  }
};

export const updateVideoGallery = async (id, data) => {
  try {
    return await apiClient(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to update video gallery item' };
  }
};

export const getVideoGalleryById = async (id) => {
  try {
    return await apiClient(`/videos/${id}`);
  } catch (error) {
    return { success: false, error: error.message || 'Failed to fetch video gallery item' };
  }
};

export const deleteVideoGallery = async (id) => {
  try {
    return await apiClient(`/videos/${id}`, { method: 'DELETE' });
  } catch (error) {
    return { success: false, error: error.message || 'Failed to delete video gallery item' };
  }
};


