import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

function Modal({ showModal, setShowModal, children, zIndex = 10 }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (event.target.className === 'modal-overlay') {
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
        className="modal-overlay"
        style={{ display: showModal ? 'flex' : 'none', zIndex: `${zIndex}` }}>
        {children}
      </div>
    </>,
    document.getElementById('modal')
  );
}

export default Modal;
