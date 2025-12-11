import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { NEWS_DATA } from '../../data/newsData';
import './EditNews.css';

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewItem = id === 'new';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    date: '',
    slug: ''
  });

  // Load existing data if editing
  useEffect(() => {
    if (!isNewItem) {
      const item = NEWS_DATA.find(item => item.id === parseInt(id));
      if (item) {
        setFormData({
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date,
          slug: item.slug
        });
      } else {
        setError('News item not found');
      }
    }
  }, [id, isNewItem]);

  // Clear messages when form changes
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  // Auto-generate slug from title
  const generateSlug = useCallback((title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate slug when title changes
      if (name === 'title') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
    clearMessages();
  }, [clearMessages, generateSlug]);

  const handleDescriptionChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, description: value }));
    clearMessages();
  }, [clearMessages]);

  const handleDateChange = useCallback((e) => {
    const dateValue = e.target.value;
    // Convert from YYYY-MM-DD to "MONTH DD, YYYY" format
    const date = new Date(dateValue);
    const formatted = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).toUpperCase();
    
    setFormData(prev => ({ ...prev, date: formatted }));
    clearMessages();
  }, [clearMessages]);

  const validateForm = useCallback(() => {
    const validations = [
      { field: 'title', message: 'Title is required' },
      { field: 'description', message: 'Description is required' },
      { field: 'date', message: 'Date is required' },
      { field: 'slug', message: 'Slug is required' }
    ];

    for (const { field, message } of validations) {
      const value = formData[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        setError(message);
        return false;
      }
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      setError('Slug can only contain lowercase letters, numbers, and hyphens');
      return false;
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving news data:', formData);
      
      setSuccess('News item saved successfully!');
      setTimeout(() => navigate('/news'), 1500);
    } catch (err) {
      setError('Failed to save news item. Please try again.');
      setLoading(false);
    }
  }, [formData, validateForm, clearMessages, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/news');
  }, [navigate]);



  // Convert date format for input (from "MONTH DD, YYYY" to "YYYY-MM-DD")
  const getDateInputValue = useCallback(() => {
    if (!formData.date) return '';
    try {
      const date = new Date(formData.date);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }, [formData.date]);

  return (
    <DashboardLayout>
      <div className="edit-news-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isNewItem ? 'Add News Item' : 'Edit News Item'}
            </h1>
            <p className="edit-form-subtitle">
              {isNewItem 
                ? 'Create a new news announcement or event' 
                : `Editing: ${formData.title || 'Loading...'}`
              }
            </p>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group form-group-full">
              <label htmlFor="title" className="form-label form-label-required">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                placeholder="Enter news title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <p className="form-help-text">The main headline of the news item</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date" className="form-label form-label-required">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={getDateInputValue()}
                  onChange={handleDateChange}
                  required
                />
                <p className="form-help-text">Publication date of the news item</p>
                {formData.date && (
                  <p className="form-help-text display-date">
                    Display format: <strong>{formData.date}</strong>
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="slug" className="form-label form-label-required">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  className="form-input"
                  placeholder="url-friendly-slug"
                  value={formData.slug}
                  disabled
                  readOnly
                  required
                />
                <p className="form-help-text">Auto-generated from title (lowercase, hyphens only)</p>
              </div>
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="description" className="form-label form-label-required">
                Description
              </label>
              <div className="editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.description || ''}
                  onChange={handleDescriptionChange}
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['link', 'image'],
                      ['blockquote', 'code-block'],
                      [{ 'indent': '-1'}, { 'indent': '+1' }],
                      ['clean']
                    ]
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike',
                    'color', 'background',
                    'list', 'bullet',
                    'align',
                    'link', 'image',
                    'blockquote', 'code-block',
                    'indent'
                  ]}
                  style={{ height: '300px' }}
                />
              </div>
              <p className="form-help-text">
                Use the toolbar to format text, add links, images, and more.
              </p>
              
              {formData.description && formData.description.trim() && (
                <>
                  <button 
                    type="button" 
                    className="preview-toggle"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>

                  {showPreview && (
                    <div className="html-preview">
                      <div dangerouslySetInnerHTML={{ __html: formData.description }} />
                    </div>
                  )}
                </>
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
                {loading ? 'Saving...' : 'Save News Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditNews;
