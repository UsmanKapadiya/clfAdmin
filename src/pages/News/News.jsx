import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { NEWS_DATA } from '../../data/newsData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import Pagination from '@mui/material/Pagination';
import './News.css';

const News = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  // Memoized filtered and sorted data
  const filteredNews = useMemo(() => {
    let filtered = NEWS_DATA;
    
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.date.toLowerCase().includes(search)
      );
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  
  const paginatedNews = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNews.slice(startIndex, endIndex);
  }, [filteredNews, page, itemsPerPage]);

  // Reset to page 1 when search changes
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleExpand = useCallback((id) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleEdit = useCallback((id, e) => {
    e.stopPropagation();
    navigate(`/news/edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    const item = NEWS_DATA.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.title || 'this news item'
    });
  }, []);

  const confirmDelete = useCallback(() => {
    console.log('Delete news item:', confirmDialog.itemId);
    // Add delete functionality here
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, [confirmDialog.itemId]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  const renderNewsItem = useCallback((item) => {
    const isExpanded = expandedItems.includes(item.id);
    
    return (
      <div key={item.id}>
        <div 
          className="news-item"
          onClick={() => toggleExpand(item.id)}
        >
          <div className="news-item-header">
            <div className="news-item-info">
              <div className="news-item-title">{item.title}</div>
              <div className="news-item-date">
                <span className="date-badge">{item.date}</span>
              </div>
              <div className="news-item-slug">{item.slug}</div>
            </div>
            <div className="news-item-actions">
              <button 
                className="btn-icon edit" 
                onClick={(e) => handleEdit(item.id, e)}
                title="Edit"
                aria-label={`Edit ${item.title}`}
              >
                <EditIcon />
              </button>
              <button 
                className="btn-icon delete" 
                onClick={(e) => handleDelete(item.id, e)}
                title="Delete"
                aria-label={`Delete ${item.title}`}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
          {isExpanded && (
            <div className="news-item-description">
              <div dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          )}
        </div>
      </div>
    );
  }, [expandedItems, toggleExpand, handleEdit, handleDelete]);

  return (
    <DashboardLayout>
      <div className="news-page">
        <div className="page-header">
          <div className="news-header">
            <div>
              <h1 className="page-title">News</h1>
              <p className="page-subtitle">Manage announcements and upcoming events</p>
            </div>
            <div className="news-actions">
              <button className="btn-add" onClick={() => navigate('/news/edit/new')}>
                <AddIcon />
                Add News Item
              </button>
            </div>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search news by title, description, or date..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="news-list">
          {paginatedNews.length > 0 ? (
            paginatedNews.map(item => renderNewsItem(item))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
              <div className="empty-state-text">
                {searchTerm ? 'No news items found' : 'No news items yet'}
              </div>
              <div className="empty-state-subtext">
                {searchTerm 
                  ? 'Try a different search term' 
                  : 'Add your first news item to get started'
                }
              </div>
            </div>
          )}
        </div>

        {filteredNews.length > 0 && totalPages > 1 && (
          <div className="pagination-container">
            <Pagination 
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </div>
        )}

        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={closeConfirmDialog}
          onConfirm={confirmDelete}
          title="Delete News Item"
          message={`Are you sure you want to delete "${confirmDialog.itemName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </DashboardLayout>
  );
};

export default News;
