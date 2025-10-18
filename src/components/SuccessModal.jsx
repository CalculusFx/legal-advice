import React, { useEffect } from 'react'

export default function SuccessModal({ isOpen, onClose, title, message, type = 'success' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    dev: '🔧'
  }

  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    dev: '#E5C061'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon-wrapper" style={{ backgroundColor: colors[type] }}>
          <div className="modal-icon">{icons[type]}</div>
        </div>
        
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        
        <button className="modal-btn" onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  )
}
