import React, { useState, useMemo, useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { getAllNews, deleteNews } from '../../services/newsApi';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import Pagination from '@mui/material/Pagination';
import './News.css';
import GlobalLoader from '../../components/Loader/GlobalLoader';

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
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      const res = await getAllNews(page, itemsPerPage);
      if (res.success) {
        setNewsData(res.data?.data || []);
        setTotalPages(res.data?.totalpages || 1);
        setTotalItems(res.data?.length || 0);
      } else {
        setError(res.error || 'Failed to fetch news');
      }
      setLoading(false);
    };
    fetchNews();
  }, [page, itemsPerPage]);

  // Memoized filtered and sorted data (client-side search only)
  const filteredNews = useMemo(() => {
    if (!searchTerm.trim()) return newsData;
    const search = searchTerm.toLowerCase();
    return newsData.filter(item =>
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      (item.date && item.date.toLowerCase().includes(search))
    );
  }, [searchTerm, newsData]);

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
    const item = newsData.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.title || 'this news item'
    });
  }, [newsData]);

  const confirmDelete = useCallback(async () => {
    if (!confirmDialog.itemId) return;
    setLoading(true);
    const res = await deleteNews(confirmDialog.itemId);
    if (res.success) {
      // Refresh news list after delete
      const listRes = await getAllNews();
      if (listRes.success) {
        setNewsData(listRes.data?.data || []);
      }
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
      toast.success('News item deleted successfully!');
    } else {
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
      toast.error(res.error || 'Failed to delete news item');
    }
    setLoading(false);
  }, [confirmDialog.itemId]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  const renderNewsItem = useCallback((item) => {
    const isExpanded = expandedItems.includes(item._id);
    return (
      <div className="news-item-wrapper" key={item._id}>
        <div
          className="news-item"
          onClick={() => toggleExpand(item._id)}
        >
          <div className="news-item-header">
            <div className="news-item-info">
              <div className="news-item-title">{item.title}</div>
              <div className="news-item-date">
                <span className="date-badge">{dayjs(item.date).isValid() ? dayjs(item.date).format('DD-MMM-YYYY') : item.date}</span>
                <span className={`date-badge`}>
                  {item.updatedAt
                    ? `Updated ${dayjs(item.updatedAt).fromNow()}`
                    : item.createdAt
                      ? `Created ${dayjs(item.createdAt).fromNow()}`
                      : ''}
                </span>
              </div>
              {/* Slug */}
              {/* <div className="news-item-slug">{item.slug}</div> */}
            </div>
            <div className="news-item-actions">
              <button
                className="btn-icon edit"
                onClick={(e) => handleEdit(item._id, e)}
                title="Edit"
                aria-label={`Edit ${item.title}`}
              >
                <EditIcon />
              </button>
              <button
                className="btn-icon delete"
                onClick={(e) => handleDelete(item._id, e)}
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
          {loading && <GlobalLoader text="Loading..." />}
          {error ? (
            <div className="empty-state">{error}</div>
          ) : filteredNews.length > 0 ? (
            filteredNews.map(item => (
              <div key={item._id}>{renderNewsItem(item)}</div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><ArticleIcon style={{ fontSize: 48 }} /></div>
              <div className="empty-state-text">
                {searchTerm ? 'No news items found' : 'No news items yet'}
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
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
