import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { ABOUT_DATA } from '../../data/aboutData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';
import './About.css';

const ORDERED_CATEGORIES = ['style', 'biography'];
const CATEGORY_LABELS = {
  style: 'STYLE',
  biography: 'BIOGRAPHIES'
};

const About = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  // Memoized unique categories with custom order
  const uniqueCategories = useMemo(() => {
    const allCategories = [...new Set(ABOUT_DATA.map(item => item.category))];
    return [
      ...ORDERED_CATEGORIES.filter(cat => allCategories.includes(cat)),
      ...allCategories.filter(cat => !ORDERED_CATEGORIES.includes(cat))
    ];
  }, []);

  // Memoized filtered and organized data
  const { organizedData, orphanedChildren } = useMemo(() => {
    const filteredData = selectedCategory === 'all' 
      ? ABOUT_DATA 
      : ABOUT_DATA.filter(item => item.category === selectedCategory);

    const organized = filteredData
      .filter(item => item.parent_id === null)
      .map(parent => ({
        ...parent,
        children: filteredData.filter(child => child.parent_id === parent.id)
      }));

    const orphaned = filteredData.filter(item => 
      item.parent_id !== null && 
      !filteredData.some(parent => parent.id === item.parent_id)
    );

    return { organizedData: organized, orphanedChildren: orphaned };
  }, [selectedCategory]);

  const toggleExpand = useCallback((id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleEdit = useCallback((id, e) => {
    e.stopPropagation();
    navigate(`/about/edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    const item = ABOUT_DATA.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.name || 'this item'
    });
  }, []);

  const confirmDelete = useCallback(() => {
    console.log('Delete item:', confirmDialog.itemId);
    // Add delete functionality here
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, [confirmDialog.itemId]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  const getCategoryBadge = useCallback((category) => {
    return CATEGORY_LABELS[category] || category.toUpperCase();
  }, []);

  const renderItem = useCallback((item, isChild = false) => {
    const isExpanded = expandedItems.includes(item.id);
    
    return (
      <div key={item.id}>
        <div 
          className={`about-item ${isChild ? 'child' : 'parent'}`}
          onClick={() => toggleExpand(item.id)}
        >
          <div className="about-item-header">
            <div className="about-item-info">
              <div className="about-item-name">{item.name}</div>
              <div className="about-item-title">{item.title}</div>
              <div className="about-item-badges">
                <span className={`badge category-${item.category}`}>
                  {getCategoryBadge(item.category)}
                </span>
              </div>
            </div>
            <div className="about-item-actions">
              <button 
                className="btn-icon edit" 
                onClick={(e) => handleEdit(item.id, e)}
                title="Edit"
                aria-label={`Edit ${item.name}`}
              >
                <EditIcon />
              </button>
              <button 
                className="btn-icon delete" 
                onClick={(e) => handleDelete(item.id, e)}
                title="Delete"
                aria-label={`Delete ${item.name}`}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div className="about-item-description">
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          )}
        </div>
        {!isChild && item.children?.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {item.children.map(child => renderItem(child, true))}
          </div>
        )}
      </div>
    );
  }, [expandedItems, toggleExpand, getCategoryBadge, handleEdit, handleDelete]);

  return (
    <DashboardLayout>
      <div className="about-page">
        <div className="page-header">
          <div className="about-header">
            <div>
              <h1 className="page-title">About Content</h1>
              <p className="page-subtitle">Manage martial arts and instructor information</p>
            </div>
            <div className="about-actions">
              <button className="btn-add" onClick={() => navigate('/about/edit/new')}>
                <AddIcon />
                Add New Item
              </button>
            </div>
          </div>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({ABOUT_DATA.length})
          </button>
          {uniqueCategories.map((category) => {
            const count = ABOUT_DATA.filter(i => i.category === category).length;
            return (
              <button 
                key={category}
                className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        <div className="about-list">
          {organizedData.length > 0 || orphanedChildren.length > 0 ? (
            <>
              {organizedData.map(item => renderItem(item))}
              {orphanedChildren.map(item => renderItem(item, true))}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><DescriptionIcon style={{ fontSize: 48 }} /></div>
              <div className="empty-state-text">No items found</div>
              <div className="empty-state-subtext">Try changing your filter or add a new item</div>
            </div>
          )}
        </div>

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDelete}
          title="Delete Item"
          message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
};

export default About;
