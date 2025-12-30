import React, { useState, useMemo, useCallback } from 'react';
import GlobalLoader from '../../components/Loader/GlobalLoader';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { getGalleryList, getVideoGalleryList, deleteGallery, deleteVideoGallery } from '../../services/galleryApi';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '@mui/material/Pagination';
import './Gallery.css';

const Gallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryType, setGalleryType] = useState('photos'); // 'photos' or 'videos'
  const [selectedYear, setSelectedYear] = useState('all');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  });
  const [galleryList, setGalleryList] = useState([]);
  const [videoGalleryList, setVideoGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoPopup, setVideoPopup] = useState({ open: false, url: '' });

  // Fetch gallery list from API on mount
  // Fetch galleries when galleryType changes
  React.useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      setError(null);
      if (galleryType === 'photos') {
        const res = await getGalleryList();
        if (res.success) {
          let data = res.data?.data || res.data;
          setGalleryList(data);
        } else {
          setError(res.error || 'Failed to fetch gallery');
        }
      } else {
        const res = await getVideoGalleryList();
        if (res.success) {
          let data = res.data?.data || res.data;
          setVideoGalleryList(data);
        } else {
          setError(res.error || 'Failed to fetch video gallery');
        }
      }
      setLoading(false);
    };
    fetchGalleries();
  }, [galleryType]);

  // Flatten galleryList object to array of gallery items
  const allGalleries = React.useMemo(() => {
    if (galleryType === 'photos') {
      if (!galleryList || typeof galleryList !== 'object') return [];
      return Object.values(galleryList).flat();
    } else {
      if (!videoGalleryList || typeof videoGalleryList !== 'object') return [];
      return Object.values(videoGalleryList).flat();
    }
  }, [galleryList, videoGalleryList, galleryType]);

  // Get unique years from API response
  const uniqueYears = React.useMemo(() => {
    if (galleryType !== 'photos') return [];
    if (!galleryList || typeof galleryList !== 'object' || Array.isArray(galleryList)) return [];
    const years = Object.keys(galleryList).filter(y => typeof y === 'string');
    return years.sort((a, b) => b.localeCompare(a));
  }, [galleryList, galleryType]);

  // Filtered data
  const filteredGalleries = useMemo(() => {
    let filtered = allGalleries;

    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.year === selectedYear);
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.subTitle.toLowerCase().includes(search) ||
        item.year.includes(search)
      );
    }

    return filtered.sort((a, b) => b.year?.localeCompare(a.year));
  }, [searchTerm, selectedYear, allGalleries]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage);

  const paginatedGalleries = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredGalleries.slice(startIndex, endIndex);
  }, [filteredGalleries, page, itemsPerPage]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const handleYearChange = useCallback((year) => {
    setSelectedYear(year);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleEdit = useCallback((id, e) => {
    e.stopPropagation();
    navigate(`/gallery/edit/${id}`);
  }, [navigate]);

  const handleDelete = useCallback((id, e) => {
    e.stopPropagation();
    const item = allGalleries.find(item => item.id === id);
    setConfirmDialog({
      isOpen: true,
      itemId: id,
      itemName: item?.title || 'this gallery'
    });
  }, [allGalleries]);

  const confirmDelete = useCallback(async () => {
    if (!confirmDialog.itemId) return;
    setLoading(true);
    let res;
    if (galleryType === 'photos') {
      res = await deleteGallery(confirmDialog.itemId);
      setLoading(false);
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
      if (res && res.success) {
        toast.success('Gallery deleted successfully!');
      } else {
        toast.error(res?.error || 'Failed to delete gallery. Please try again.');
      }
    } else {
      res = await deleteVideoGallery(confirmDialog.itemId);
      setLoading(false);
      setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
      if (res && res.success) {
        toast.success('Video deleted successfully!');
      } else {
        toast.error(res?.error || 'Failed to delete video. Please try again.');
      }
    }
    // Refresh list after delete
    if (galleryType === 'photos') {
      const r = await getGalleryList();
      setGalleryList(r.success ? (r.data?.data || r.data) : []);
    } else {
      const r = await getVideoGalleryList();
      setVideoGalleryList(r.success ? (r.data?.data || r.data) : []);
    }
  }, [confirmDialog.itemId, galleryType]);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, []);

  const handleViewGallery = useCallback((gallery) => {
    const images = gallery.photos.map(photo => photo.src);
    setLightbox({
      isOpen: true,
      images: images,
      currentIndex: 0
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ isOpen: false, images: [], currentIndex: 0 });
  }, []);

  const goToPrevImage = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.images.length - 1
    }));
  }, []);

  const goToNextImage = useCallback(() => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: prev.currentIndex < prev.images.length - 1 ? prev.currentIndex + 1 : 0
    }));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (!lightbox.isOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevImage();
    if (e.key === 'ArrowRight') goToNextImage();
  }, [lightbox.isOpen, closeLightbox, goToPrevImage, goToNextImage]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  console.log("galleryList", galleryList)
  return (
    <DashboardLayout>
      <div className="gallery-page">
        <div className="gallery-type-toggle" style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button
            className={`btn-add gallery-type-btn${galleryType === 'photos' ? ' active' : ''}`}
            onClick={() => setGalleryType('photos')}
            type="button"
          >
            <AddIcon style={{ marginRight: 6 }} />
            Photos Gallery
          </button>
          <button
            className={`btn-add gallery-type-btn${galleryType === 'videos' ? ' active' : ''}`}
            onClick={() => setGalleryType('videos')}
            type="button"
          >
            <VideoLibraryIcon style={{ marginRight: 6 }} />
            Video Gallery
          </button>
        </div>
        <div className="page-header">
          <div className="gallery-header">
            <div>
              <h1 className="page-title">Gallery</h1>
              <p className="page-subtitle">Manage photo galleries and albums</p>
            </div>
            <div className="gallery-actions">
              {galleryType === 'photos' ? (
                <button className="btn-add" onClick={() => navigate('/gallery/edit/new')}>
                  <AddIcon />
                  Add Gallery
                </button>
              ) : (
                <button className="btn-add" onClick={() => navigate('/gallery/videos/edit/new')}>
                  <VideoLibraryIcon />
                  Add Video Gallery
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="gallery-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search galleries by title, location, or year..."
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
          {galleryType === 'photos' && (
            <div className="year-filter-tabs">
              <button
                className={`year-tab ${selectedYear === 'all' ? 'active' : ''}`}
                onClick={() => handleYearChange('all')}
              >
                All Years ({allGalleries.length})
              </button>
              {uniqueYears.map((year) => {
                const count = galleryList && galleryList[year] ? galleryList[year].length : 0;
                return (
                  <button
                    key={year}
                    className={`year-tab ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => handleYearChange(year)}
                  >
                    {year} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {loading ? (
          <GlobalLoader text="Loading..." />
        ) : (
          <div className="gallery-grid">
            {paginatedGalleries.length > 0 ? (
              paginatedGalleries.map(gallery => (
                galleryType === 'photos' ? (
                  <div key={gallery.id} className="gallery-card">
                    <div
                      className="gallery-thumbnail"
                      onClick={() => handleViewGallery(gallery)}
                    >
                      <img
                        src={gallery.catalogThumbnail}
                        alt={gallery.title}
                        loading="lazy"
                      />
                      <div className="gallery-overlay">
                        <div className="photo-count">
                          <PhotoLibraryIcon />
                          <span>{gallery?.photos?.length} Photos</span>
                        </div>
                      </div>
                    </div>
                    <div className="gallery-info">
                      <div className="gallery-details">
                        <h3 className="gallery-title">{gallery.title}</h3>
                        <p className="gallery-subtitle">{gallery.subTitle}</p>
                        <span className="gallery-year">{gallery.year}</span>
                      </div>
                      <div className="gallery-card-actions">
                        <button
                          className="btn-icon edit"
                          onClick={(e) => handleEdit(gallery._id, e)}
                          title="Edit"
                          aria-label={`Edit ${gallery.title}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={(e) => handleDelete(gallery.id, e)}
                          title="Delete"
                          aria-label={`Delete ${gallery.title}`}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={gallery.id} className="gallery-card video-card">
                    <div
                      className="gallery-thumbnail"
                      onClick={() => setVideoPopup({ open: true, url: gallery.videoUrl })}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={gallery.catalogThumbnail}
                        alt={gallery.title}
                        loading="lazy"
                      />
                      <div className="gallery-overlay">
                        <div className="photo-count">
                          <VideoLibraryIcon />
                          <span>Video</span>
                        </div>
                      </div>
                    </div>
                    <div className="gallery-info">
                      <div className="gallery-details">
                        <h3 className="gallery-title">{gallery.title}</h3>
                      </div>
                      <div className="gallery-card-actions">
                        <button
                          className="btn-icon edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/gallery/videos/edit/${gallery._id}`);
                          }}
                          title="Edit"
                          aria-label={`Edit ${gallery.title}`}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDialog({
                              isOpen: true,
                              itemId: gallery._id,
                              itemName: gallery.title || 'this video',
                            });
                          }}
                          title="Delete"
                          aria-label={`Delete ${gallery.title}`}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><PhotoLibraryIcon style={{ fontSize: 48 }} /></div>
                <div className="empty-state-text">
                  {searchTerm || selectedYear !== 'all' ? 'No galleries found' : 'No galleries yet'}
                </div>
                <div className="empty-state-subtext">
                  {searchTerm || selectedYear !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Add your first gallery to get started'
                  }
                </div>
              </div>
            )}
          </div>
        )}
        {/* Video Popup */}
        {videoPopup.open && (
          <div className="lightbox-overlay" onClick={() => setVideoPopup({ open: false, url: '' })}>
            <button className="lightbox-close" onClick={() => setVideoPopup({ open: false, url: '' })}>
              <CloseIcon />
            </button>
            <div className="lightbox-content" style={{ width: '90vw', maxWidth: 800, background: '#000', padding: 16 }} onClick={e => e.stopPropagation()}>
              <iframe
                width="100%"
                height="450"
                src={videoPopup.url}
                title="Video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 8 }}
              />
            </div>
          </div>
        )}

        {filteredGalleries.length > 0 && totalPages > 1 && (
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
          title="Delete Gallery"
          message={`Are you sure you want to delete "${confirmDialog.itemName}"? This will also delete all photos in this gallery. This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {lightbox.isOpen && (
          <div className="lightbox-overlay" onClick={closeLightbox}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <CloseIcon />
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}>
              <ChevronLeftIcon />
            </button>
            <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); goToNextImage(); }}>
              <ChevronRightIcon />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightbox.images[lightbox.currentIndex]}
                alt={`Photo ${lightbox.currentIndex + 1}`}
              />
              <div className="lightbox-counter">
                {lightbox.currentIndex + 1} / {lightbox.images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Gallery;
