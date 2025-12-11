import React from 'react';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger' // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <div className="confirm-overlay" onClick={onClose} />
      <div className="confirm-dialog">
        <button className="confirm-close" onClick={onClose}>
          <CloseIcon />
        </button>
        
        <div className={`confirm-icon ${type}`}>
          <WarningAmberIcon style={{ fontSize: 48 }} />
        </div>
        
        <h2 className="confirm-title">{title}</h2>
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button 
            className="confirm-btn cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-btn confirm ${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
