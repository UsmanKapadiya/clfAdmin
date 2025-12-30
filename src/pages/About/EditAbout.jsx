import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { getAboutById, createAbout, updateAbout } from '../../services/aboutApi';
import './EditAbout.css';

const ORDERED_CATEGORIES = ['style', 'biography'];

const EditAbout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewItem = id === 'new';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    title: '',
    category: '',
    description: '',
    parent_id: null
  });

  // Store all about items for category/parent selection
  const [aboutList, setAboutList] = useState([]);

  // Fetch all about items for dropdowns (not just the one being edited)
  useEffect(() => {
    const fetchAllAbout = async () => {
      const res = await import('../../services/aboutApi').then(m => m.getAboutList());
      if (res.success && Array.isArray(res.data?.data)) {
        setAboutList(res.data?.data);
      }
    };
    fetchAllAbout();
  }, []);

  // Memoized categories with custom order
  const uniqueCategories = useMemo(() => {
    const allCategories = [...new Set(aboutList.map(item => item.category))];
    return [
      ...ORDERED_CATEGORIES.filter(cat => allCategories.includes(cat)),
      ...allCategories.filter(cat => !ORDERED_CATEGORIES.includes(cat))
    ];
  }, [aboutList]);

  // Memoized parent items

  const parentItems = useMemo(() => {
    // Use the current category (from parent or input)
    const currentCategory = formData.category || categoryInput;
    return aboutList.filter(item =>
      item.parent_id === null &&
      item._id !== formData.id &&
      item._id !== formData.parent_id &&
      (!currentCategory || item.category === currentCategory)
    );
  }, [aboutList, formData._id, formData.parent_id, formData.category, categoryInput]);

  // Filtered categories based on input
  const filteredCategories = useMemo(() => {
    if (!categoryInput) return uniqueCategories;
    return uniqueCategories.filter(cat =>
      cat.toLowerCase().includes(categoryInput.toLowerCase())
    );
  }, [categoryInput, uniqueCategories]);

  // Load existing data if editing
  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      setError('');
      const res = await getAboutById(id);
      if (res.success && res.data.data) {
        const parent = res.data.data.parent_id;
        setFormData({
          id: res.data.data._id,
          name: res.data.data.name,
          title: res.data.data.title,
          category: res.data.data.category,
          description: res.data.data.description,
          parent_id: parent && typeof parent === 'object' ? parent._id : (parent || null)
        });
        setCategoryInput(res.data.data.category);
      } else {
        setError(res.error || 'Item not found');
      }
      setLoading(false);
    };
    if (!isNewItem) {
      fetchAbout();
    }
  }, [id, isNewItem]);

  // Clear messages when form changes
  const clearMessages = useCallback(() => {
    setError('');
    setSuccess('');
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'parent_id') {
      const parent = aboutList.find(item => (item.id || item._id) === value);
      setFormData(prev => ({
        ...prev,
        parent_id: value === '' ? null : value,
        category: parent ? parent.category : ''
      }));
      setCategoryInput(parent ? parent.category : '');
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      if (name === 'category') setCategoryInput(value);
    }
    clearMessages();
  }, [clearMessages, aboutList]);

  const handleDescriptionChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, description: value }));
    clearMessages();
  }, [clearMessages]);

  const handleCategoryInputChange = useCallback((e) => {
    const value = e.target.value;
    setCategoryInput(value);
    setFormData(prev => ({ ...prev, category: value }));
    setShowCategoryDropdown(true);
    clearMessages();
  }, [clearMessages]);

  const handleCategorySelect = useCallback((category) => {
    setCategoryInput(category);
    setFormData(prev => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  }, []);

  const handleCategoryBlur = useCallback(() => {
    setTimeout(() => setShowCategoryDropdown(false), 200);
  }, []);

  const validateForm = useCallback(() => {
    // Always validate category, even if set by parent selection
    if (!formData.name || !formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.title || !formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    // If parent is selected, category should be set by parent
    if ((formData.parent_id !== null && (!formData.category || !formData.category.trim())) ||
      (formData.parent_id === null && (!formData.category || !formData.category.trim()))) {
      setError('Category is required');
      return false;
    }
    if (!formData.description || !formData.description.trim()) {
      setError('Description is required');
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
      let res;
      if (isNewItem) {
        res = await createAbout(formData);
      } else {
        res = await updateAbout(formData.id || formData._id, formData);
      }
      if (res.success) {
        setSuccess(res.data?.message || 'Item saved successfully!');
        toast.success(res.data?.message || 'Item saved successfully!');
        setTimeout(() => navigate('/about'), 1500);
      } else {
        setError(res.data?.error || 'Failed to save item. Please try again.');
        toast.error(res.data?.error || 'Failed to save item. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to save item. Please try again.');
      setLoading(false);
    }
  }, [formData, validateForm, clearMessages, navigate, isNewItem]);

  const handleCancel = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="edit-about-page">
        <div className="edit-form-card">
          <div className="edit-form-header">
            <h1 className="edit-form-title">
              {isNewItem ? 'Add New Item' : 'Edit Item'}
            </h1>
            <p className="edit-form-subtitle">
              {isNewItem
                ? 'Create a new about content item'
                : `Editing: ${formData.name || 'Loading...'}`
              }
            </p>
          </div>

          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label form-label-required">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">The English name/title of the item</p>
              </div>

              <div className="form-group">
                <label htmlFor="title" className="form-label form-label-required">
                  Title (Chinese)
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  placeholder="Enter Chinese title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="form-help-text">The Chinese title of the item</p>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category" className="form-label form-label-required">
                  Category
                </label>
                <div className="category-input-wrapper">
                  <input
                    type="text"
                    id="category"
                    name="category"
                    className="form-input"
                    placeholder="Type to search or create new category"
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
                    onFocus={() => setShowCategoryDropdown(true)}
                    onBlur={handleCategoryBlur}
                    required
                    autoComplete="off"
                    disabled={formData.parent_id !== null || aboutList.length === 0}
                  />
                  {showCategoryDropdown && formData.parent_id === null && (
                    <div className="category-dropdown">
                      {filteredCategories.length > 0 ? (
                        <>
                          <div className="category-dropdown-label">Existing Categories:</div>
                          {filteredCategories.map(cat => (
                            <div
                              key={cat}
                              className="category-dropdown-item"
                              onClick={() => handleCategorySelect(cat)}
                            >
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </div>
                          ))}
                        </>
                      ) : null}
                      {categoryInput && !uniqueCategories.includes(categoryInput.toLowerCase()) && (
                        <>
                          <div className="category-dropdown-label">Create New:</div>
                          <div
                            className="category-dropdown-item category-create-new"
                            onClick={() => handleCategorySelect(categoryInput.toLowerCase())}
                          >
                            <strong>+ Create "{categoryInput}"</strong>
                          </div>
                        </>
                      )}
                      {filteredCategories.length === 0 && !categoryInput && (
                        <div className="category-dropdown-empty">No categories available</div>
                      )}
                    </div>
                  )}
                </div>
                {formData.parent_id !== null ? (
                  <p className="form-help-text">Category is set by parent item.</p>
                ) : (
                  <p className="form-help-text">Type to search existing categories or create a new one</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="parent_id" className="form-label">
                  Parent Item (Optional)
                </label>
                <select
                  id="parent_id"
                  name="parent_id"
                  className="form-select"
                  value={formData.parent_id || ''}
                  onChange={handleChange}
                  disabled={aboutList.length === 0}
                >
                  <option value="">None (Top Level)</option>
                  {parentItems.map(item => (
                    <option key={item.id || item._id} value={item.id || item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                {formData.parent_id !== null && (
                  <div className="selected-parent-name">
                    <strong>Selected Parent:</strong> {(() => {
                      const parent = aboutList.find(item => (item.id || item._id) === formData.parent_id);
                      return parent ? parent.name : '';
                    })()}
                  </div>
                )}
                <p className="form-help-text">Select a parent if this is a sub-item</p>
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
                      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['link', 'image'],
                      ['blockquote', 'code-block'],
                      [{ 'indent': '-1' }, { 'indent': '+1' }],
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
                Use the toolbar to format text, add links, tables, and more.
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
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditAbout;
