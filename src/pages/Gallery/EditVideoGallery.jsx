
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

import { getVideoGalleryById, updateVideoGallery, createVideoGallery } from '../../services/galleryApi';

const EditVideoGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewItem = id === 'new';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    catalogThumbnail: '',
    videoUrl: ''
  });

  useEffect(() => {
    if (!isNewItem) {
      setLoading(true);
      setError('');
      getVideoGalleryById(id)
        .then(res => {
          if (res.success && res.data) {
            const item = res.data?.data || res.data;
            setFormData({
              id: item._id,
              title: item.title,
              catalogThumbnail: item.catalogThumbnail,
              videoUrl: item.videoUrl
            });
          } else {
            setError(res.error || 'Video not found');
          }
        })
        .catch(() => setError('Video not found'))
        .finally(() => setLoading(false));
    }
  }, [id, isNewItem]);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearMessages();
  }, [clearMessages]);

  const validateForm = useCallback(() => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.catalogThumbnail.trim()) {
      setError('Thumbnail URL is required');
      return false;
    }
    if (!formData.videoUrl.trim()) {
      setError('YouTube embed URL is required');
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    clearMessages();
    try {
      let res;
      if (isNewItem) {
        res = await createVideoGallery(formData);
      } else {
        res = await updateVideoGallery(formData.id, formData);
      }
      if (res.success) {
        toast.success('Video gallery saved successfully!');
        navigate('/gallery'); // Redirect to listing
      } else {
        setError(res.error || 'Failed to save video gallery. Please try again.');
        toast.error(res.error || 'Failed to save video gallery. Please try again.');
      }
    } catch (err) {
      setError('Failed to save video gallery. Please try again.');
      toast.error('Failed to save video gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, clearMessages, isNewItem, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="edit-gallery-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isNewItem ? 'Add Video Gallery' : 'Edit Video Gallery'}
            </h1>
            <p className="edit-form-subtitle">
              {isNewItem ? 'Create a new video gallery' : `Editing: ${formData.title || 'Loading...'}`}
            </p>
          </div>
          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title" className="form-label form-label-required">
                  Video Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="e.g., React Tutorial"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">Main title of the video</p>
              </div>
              <div className="form-group">
                <label htmlFor="catalogThumbnail" className="form-label form-label-required">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  id="catalogThumbnail"
                  name="catalogThumbnail"
                  className="form-input"
                  placeholder="https://img.youtube.com/vi/xxxx/hqdefault.jpg"
                  value={formData.catalogThumbnail}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">Main thumbnail for video card</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="videoUrl" className="form-label form-label-required">
                  YouTube Embed URL
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  className="form-input"
                  placeholder="https://www.youtube.com/embed/xxxx"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">Paste the YouTube embed URL (not the share link)</p>
              </div>
            </div>
            {formData.catalogThumbnail && (
              <div className="thumbnail-preview">
                <label className="form-label">Thumbnail Preview:</label>
                <img
                  src={formData.catalogThumbnail}
                  alt="Thumbnail preview"
                  onError={e => (e.target.style.display = 'none')}
                  onLoad={e => (e.target.style.display = 'block')}
                />
              </div>
            )}
            {formData.videoUrl && (
              <div className="video-preview">
                <label className="form-label">Video Preview:</label>
                <iframe
                  width="100%"
                  height="315"
                  src={formData.videoUrl}
                  title="Video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 8, marginTop: 8 }}
                />
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-add" disabled={loading}>
                <VideoLibraryIcon style={{ marginRight: 6 }} />
                {isNewItem ? 'Add Video' : 'Save Changes'}
              </button>
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditVideoGallery;
