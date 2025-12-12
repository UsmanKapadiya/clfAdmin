import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { getGalleryById } from '../../data/galleryData';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import './EditGallery.css';

const EditGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewItem = id === 'new';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    year: new Date().getFullYear().toString(),
    subTitle: '',
    catalogThumbnail: '',
    photos: []
  });

  useEffect(() => {
    if (!isNewItem) {
      const item = getGalleryById(id);
      if (item) {
        setFormData({
          id: item.id,
          title: item.title,
          year: item.year,
          subTitle: item.subTitle,
          catalogThumbnail: item.catalogThumbnail,
          photos: item.photos
        });
      } else {
        setError('Gallery not found');
      }
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

  const handleFileInputClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        // Here you would typically upload files to server and get URLs
        // For now, creating temporary URLs for preview
        const newPhotos = files.map((file, index) => ({
          id: Date.now() + index,
          src: URL.createObjectURL(file),
          file: file // Store file object for later upload
        }));
        
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...newPhotos]
        }));
      }
    };
    
    input.click();
  }, []);

  const handleAddMultiplePhotos = useCallback((urls) => {
    const newPhotos = urls.map((url, index) => ({
      id: Date.now() + index,
      src: url.trim()
    })).filter(photo => photo.src);
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  }, []);

  const handlePhotoChange = useCallback((photoId, value) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map(photo =>
        photo.id === photoId ? { ...photo, src: value } : photo
      )
    }));
    clearMessages();
  }, [clearMessages]);

  const handleBulkPhotoInput = useCallback((text) => {
    const urls = text.split('\n').map(url => url.trim()).filter(url => url);
    if (urls.length > 0) {
      handleAddMultiplePhotos(urls);
    }
  }, [handleAddMultiplePhotos]);

  const handleDeletePhoto = useCallback((photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  }, []);

  const validateForm = useCallback(() => {
    const validations = [
      { field: 'title', message: 'Title is required' },
      { field: 'year', message: 'Year is required' },
      { field: 'subTitle', message: 'Location/Subtitle is required' },
      { field: 'catalogThumbnail', message: 'Catalog thumbnail URL is required' }
    ];

    for (const { field, message } of validations) {
      const value = formData[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        setError(message);
        return false;
      }
    }

    if (formData.photos.length === 0) {
      setError('Please add at least one photo');
      return false;
    }

    for (let i = 0; i < formData.photos.length; i++) {
      const photo = formData.photos[i];
      if (!photo.src || !photo.src.trim()) {
        setError(`Photo ${i + 1}: Image URL is required`);
        return false;
      }
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving gallery data:', formData);
      
      setSuccess('Gallery saved successfully!');
      setTimeout(() => navigate('/gallery'), 1500);
    } catch (err) {
      setError('Failed to save gallery. Please try again.');
      setLoading(false);
    }
  }, [formData, validateForm, clearMessages, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/gallery');
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="edit-gallery-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isNewItem ? 'Add Gallery' : 'Edit Gallery'}
            </h1>
            <p className="edit-form-subtitle">
              {isNewItem 
                ? 'Create a new photo gallery' 
                : `Editing: ${formData.title || 'Loading...'}`
              }
            </p>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title" className="form-label form-label-required">
                  Gallery Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="e.g., 2025 Annual BBQ"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">Main title of the gallery</p>
              </div>

              <div className="form-group">
                <label htmlFor="year" className="form-label form-label-required">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  className="form-input"
                  value={formData.year}
                  onChange={handleChange}
                  required
                >
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <p className="form-help-text">Year of the event</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subTitle" className="form-label form-label-required">
                  Location/Subtitle
                </label>
                <input
                  type="text"
                  id="subTitle"
                  name="subTitle"
                  className="form-input"
                  placeholder="e.g., Richmond"
                  value={formData.subTitle}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">Location or subtitle for the gallery</p>
              </div>

              <div className="form-group">
                <label htmlFor="catalogThumbnail" className="form-label form-label-required">
                  Catalog Thumbnail
                </label>
                <div className="thumbnail-upload-section">
                  <input
                    type="url"
                    id="catalogThumbnail"
                    name="catalogThumbnail"
                    className="form-input"
                    placeholder="https://example.com/image.jpg or upload image"
                    value={formData.catalogThumbnail}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="btn-upload-thumbnail"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setFormData(prev => ({ ...prev, catalogThumbnail: url }));
                        }
                      };
                      input.click();
                    }}
                  >
                    <AddPhotoAlternateIcon />
                    Upload
                  </button>
                </div>
                <p className="form-help-text">Main thumbnail for gallery catalog</p>
              </div>
            </div>

            {formData.catalogThumbnail && (
              <div className="thumbnail-preview">
                <label className="form-label">Thumbnail Preview:</label>
                <img 
                  src={formData.catalogThumbnail} 
                  alt="Catalog thumbnail preview"
                  onError={(e) => e.target.style.display = 'none'}
                  onLoad={(e) => e.target.style.display = 'block'}
                />
              </div>
            )}

            <div className="photos-section">
              <div className="photos-header">
                <label className="form-label form-label-required">
                  Photos ({formData.photos.length})
                </label>
                <div className="photo-actions">
                  <button
                    type="button"
                    className="btn-add-photo"
                    onClick={handleFileInputClick}
                  >
                    <AddPhotoAlternateIcon />
                    Upload Images
                  </button>
                </div>
              </div>

              <div className="bulk-upload-section">
                <label className="form-label">Add Multiple Photos (Paste URLs)</label>
                <textarea
                  className="bulk-input"
                  placeholder="Paste image URLs here (one per line)&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  rows="5"
                  onPaste={(e) => {
                    setTimeout(() => {
                      handleBulkPhotoInput(e.target.value);
                      e.target.value = '';
                    }, 100);
                  }}
                />
                <p className="form-help-text">Paste multiple image URLs (one per line) and they will be added automatically</p>
              </div>

              {formData.photos.length === 0 ? (
                <div className="no-photos">
                  <AddPhotoAlternateIcon style={{ fontSize: 48, color: '#ccc' }} />
                  <p>No photos added yet</p>
                  <p className="help-text">Add single photos or paste multiple URLs above</p>
                </div>
              ) : (
                <div className="photos-grid">
                  {formData.photos.map((photo, index) => (
                    <div key={photo.id} className="photo-card">
                      <div className="photo-card-header">
                        <span className="photo-number">#{index + 1}</span>
                        <button
                          type="button"
                          className="btn-delete-photo"
                          onClick={() => handleDeletePhoto(photo.id)}
                          title="Delete photo"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                      
                      {/* <div className="photo-input-group">
                        <input
                          type="url"
                          className="form-input photo-url-input"
                          placeholder="https://example.com/image.jpg"
                          value={photo.src}
                          onChange={(e) => handlePhotoChange(photo.id, e.target.value)}
                          required
                        />
                      </div> */}

                      {photo.src && (
                        <div className="photo-preview">
                          <img 
                            src={photo.src} 
                            alt={`Photo ${index + 1}`}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                              e.target.nextSibling.style.display = 'none';
                            }}
                          />
                          <div className="image-error" style={{ display: 'none' }}>
                            <span>❌ Invalid URL</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-save"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Gallery'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditGallery;
