import React from 'react';
import './confirmation-popup.css';

export default function ConfirmationPopup({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirmar", cancelText = "Cancelar" }) {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-popup">
        <div className="confirmation-header">
          <h3 className="confirmation-title">{title}</h3>
        </div>
        <div className="confirmation-body">
          <p className="confirmation-message">{message}</p>
        </div>
        <div className="confirmation-actions">
          <button 
            className="confirmation-btn confirmation-btn--cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="confirmation-btn confirmation-btn--confirm" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}