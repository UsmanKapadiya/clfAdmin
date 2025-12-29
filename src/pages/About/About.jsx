import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { getAboutList, deleteAbout } from '../../services/aboutApi';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import DescriptionIcon from '@mui/icons-material/Description';

import GlobalLoader from '../../components/Loader/GlobalLoader';
import './About.css';



const About = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);
      setError(null);
      const res = await getAboutList();
      if (res.success) {
        setAboutData(res.data?.data);
      } else {
        setError(res.error || 'Failed to fetch about list');
      }
    };
    fetchAbout();
    setLoading(false);
  }, []);

  // Memoized unique categories from API data
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(aboutData.map(item => item.category))).filter(Boolean);
  }, [aboutData]);

  // Memoized filtered and organized data
  const filteredData = useMemo(() => {
  return selectedCategory === 'all'
    ? aboutData
    : aboutData.filter(item => item.category === selectedCategory);
}, [selectedCategory, aboutData]);

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
    const item = aboutData.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.name || 'this item'
    });
  }, [aboutData]);

  const confirmDelete = useCallback(async () => {
    if (!confirmDialog.itemId) return;
    setLoading(true);
    const res = await deleteAbout(confirmDialog.itemId);
    if (res.success) {
      // Refresh about list after delete
      const listRes = await getAboutList();
      if (listRes.success) {
        setAboutData(listRes.data?.data);
      }
      toast.success('Item deleted successfully!');
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    } else {
      toast.error(res.error || res.message || 'Failed to delete item');
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
    }
    setLoading(false);
  }, [confirmDialog.itemId]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  const getCategoryBadge = useCallback((category) => {
    return category ? category.toUpperCase() : '';
  }, []);

  function renderItem(item, isChild = false) {
    const isExpanded = expandedItems.includes(item._id);
    return (
      <>
      <div key={item._id}>
        <div
          className={`about-item ${isChild ? 'child' : 'parent'}`}
          onClick={() => toggleExpand(item._id)}
        >
          <div className="about-item-header">
            <div className="about-item-info">
              <div className="about-item-name">{item.name}</div>
              <div className="about-item-title">{item.title}</div>
              <div className="about-item-badges">
                <span className={`badge`}>
                  {getCategoryBadge(item.category)}
                </span>
                <span className={`badge`}>
                  {item.updatedAt
                    ? `Updated ${dayjs(item.updatedAt).fromNow()}`
                    : item.createdAt
                      ? `Created ${dayjs(item.createdAt).fromNow()}`
                      : ''}
                </span>
              </div>
            </div>
            <div className="about-item-actions">
              <button
                className="btn-icon edit"
                onClick={(e) => handleEdit(item._id, e)}
                title="Edit"
                aria-label={`Edit ${item.name}`}
              >
                <EditIcon />
              </button>
              <button
                className="btn-icon delete"
                onClick={(e) => handleDelete(item._id, e)}
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
        {/* Only render children when parent is expanded */}
        { item.children && item.children.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {item.children.map(child => renderItem(child, true))}
          </div>
        )}
      </div>
      </>
    );
  }

  return (
    <>
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
            All ({aboutData.length})
          </button>
          {uniqueCategories.map((category) => {
            const count = aboutData.filter(i => i.category === category).length;
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
          {loading && <GlobalLoader text="Loading..." />}
          {error ? (
            <div className="empty-state">{error}</div>
          ) : filteredData.length > 0 ? (
            <>
              {filteredData.map(item => renderItem(item))}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><DescriptionIcon style={{ fontSize: 48 }} /></div>
              <div className="empty-state-text">No items found</div>
              {/* <div className="empty-state-subtext">Try changing your filter or add a new item</div> */}
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
    </>
  );
};

export default About;
