import React, { useState } from 'react';
import Modal from './Modal';
import './servermodal.css';

const API_URL = 'https://doriman.yachts:5001';

export const LogoutModal = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogOut = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  };

  return (
    <>
      <Modal
        showModal={showLogoutModal}
        setShowModal={setShowLogoutModal}>
        <div className="logout-modal-container">
          <h1>Log Out</h1>
          <p>Are you sure you want to log out?</p>
          <div className="logout-buttons">
            <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
            <button onClick={() => handleLogOut()}>Logout</button>
          </div>
        </div>
      </Modal>
    </>
  );
};
