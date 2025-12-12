import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { GALLERY_DATA, getAllGalleries } from '../../data/galleryData';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import Pagination from '@mui/material/Pagination';
import './Gallery.css';

const Gallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
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

  // Get all galleries as flat array
  const allGalleries = useMemo(() => getAllGalleries(), []);

  // Get unique years
  const uniqueYears = useMemo(() => {
    return Object.keys(GALLERY_DATA).sort((a, b) => b.localeCompare(a));
  }, []);

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

    return filtered.sort((a, b) => b.year.localeCompare(a.year));
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

  const confirmDelete = useCallback(() => {
    console.log('Delete gallery:', confirmDialog.itemId);
    setConfirmDialog({ isOpen: false, itemId: null, itemName: '' });
  }, [confirmDialog.itemId]);

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

  return (
    <DashboardLayout>
      <div className="gallery-page">
        <div className="page-header">
          <div className="gallery-header">
            <div>
              <h1 className="page-title">Gallery</h1>
              <p className="page-subtitle">Manage photo galleries and albums</p>
            </div>
            <div className="gallery-actions">
              <button className="btn-add" onClick={() => navigate('/gallery/edit/new')}>
                <AddIcon />
                Add Gallery
              </button>
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

          <div className="year-filter-tabs">
            <button 
              className={`year-tab ${selectedYear === 'all' ? 'active' : ''}`}
              onClick={() => handleYearChange('all')}
            >
              All Years ({allGalleries.length})
            </button>
            {uniqueYears.map((year) => {
              const count = GALLERY_DATA[year]?.length || 0;
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
        </div>

        <div className="gallery-grid">
          {paginatedGalleries.length > 0 ? (
            paginatedGalleries.map(gallery => (
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
                      <span>{gallery.photos.length} Photos</span>
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
                      onClick={(e) => handleEdit(gallery.id, e)}
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
