import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

function SecondaryModal({ showModal, setShowModal, children, zIndex = 11 }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.className === 'secondary-modal-overlay') {
        setShowModal(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setShowModal]);

  return createPortal(
    <>
      <div
        className="secondary-modal-overlay"
        style={{ display: showModal ? 'flex' : 'none', zIndex: `${zIndex}` }}>
        {children}
      </div>
    </>,
    document.getElementById('secondarymodal')
  );
}

export default SecondaryModal;
