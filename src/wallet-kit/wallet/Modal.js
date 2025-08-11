'use client'
import { X } from 'lucide-react'
import './celokit-ui.css'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon, 
  buttonText, 
  onButtonClick 
}) {
  if (!isOpen) return null

  return (
    <div className="celokit-modal-overlay">
      <div className="celokit-modal-content">
        <button 
          onClick={onClose}
          className="celokit-modal-close"
        >
          <X size={20} />
        </button>
        
        <div className='modal'>
         <p className='icon'> {icon}</p>
          <h3 className="celokit-modal-title">{title}</h3>
          <p className="celokit-modal-description">{description}</p>
          
          <button
            onClick={onButtonClick || onClose}
            className="celokit-modal-button"
          >
            {buttonText || 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}