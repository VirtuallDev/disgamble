import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import SecondaryModal from '../Modal/SecondaryModal';
import { RiCloseCircleLine } from 'react-icons/ri';
import { BiRightArrow } from 'react-icons/bi';
import { API_URL } from '../../customhooks/useAuth';
import Profile from './Profile/Profile';
import Voice from './Voice/Voice';
import Security from './Security/Security';
import './settings.css';

const Settings = ({ showSettingsModal, setShowSettingsModal }) => {
  const [current, setCurrent] = useState('profile');
  const [showSecondaryModal, setShowSecondaryModal] = useState('');

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    window.location.replace('/login');
  };

  return (
    <>
      <SecondaryModal
        showModal={showSecondaryModal === 'Logout'}
        setShowModal={setShowSecondaryModal}>
        <div
          className="settings-edit-container"
          style={{ height: '135px' }}>
          <RiCloseCircleLine
            style={{ width: '1.8em', height: '1.8em' }}
            className="settings-close"
            onClick={() => setShowSecondaryModal('')}></RiCloseCircleLine>
          <h1>
            Are you sure you want to
            <br />
            proceed with the logout?
          </h1>
          <div>
            <button
              style={{ color: 'indianred' }}
              onClick={() => setShowSecondaryModal('')}>
              Cancel
            </button>
            <button onClick={() => handleLogout()}>Confirm</button>
          </div>
        </div>
      </SecondaryModal>
      <Modal
        showModal={showSettingsModal}
        setShowModal={setShowSettingsModal}>
        <div className="settings-modal-container">
          <RiCloseCircleLine
            className="settings-close"
            onClick={() => setShowSettingsModal(false)}></RiCloseCircleLine>
          <div className="settings-container">
            <div className="settings-sidebar-buttons">
              <button onClick={() => setCurrent('profile')}>
                Profile
                {current === 'profile' && <BiRightArrow className="arrow" />}
              </button>
              <button onClick={() => setCurrent('voice')}>
                Voice
                {current === 'voice' && <BiRightArrow className="arrow" />}
              </button>
              <button onClick={() => setCurrent('security')}>
                Security
                {current === 'security' && <BiRightArrow className="arrow" />}
              </button>
              <button
                style={{ color: 'indianred', marginTop: 'auto' }}
                onClick={() => setShowSecondaryModal('Logout')}>
                Log Out
              </button>
            </div>
          </div>
          <div className="settings-main">
            {current === 'profile' ? (
              <Profile
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
              />
            ) : current === 'security' ? (
              <Security />
            ) : (
              <Voice />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Settings;
