import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import SecondaryModal from '../Modal/SecondaryModal';
import { RiCloseCircleLine } from 'react-icons/ri';
import { BsShieldCheck } from 'react-icons/bs';
import { FaRegUserCircle } from 'react-icons/fa';
import { BiUserVoice } from 'react-icons/bi';
import { MdLogout } from 'react-icons/md';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import { API_URL } from '../../customhooks/useAuth';
import Profile from './Profile/Profile';
import Voice from './Voice/Voice';
import Security from './Security/Security';
import './settings.css';

const Settings = ({ showSettingsModal, setShowSettingsModal }) => {
  const [current, setCurrent] = useState('profile');
  const [showSecondaryModal, setShowSecondaryModal] = useState('');
  const [isOpen, setIsOpen] = useState(true);

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
          <div className={`settings-container ${isOpen ? 'settings-open' : 'settings-closed'}`}>
            <div className="settings-sidebar-buttons">
              {[
                { current: 'profile', label: 'Profile', icon: FaRegUserCircle },
                { current: 'voice', label: 'Voice', icon: BiUserVoice },
                { current: 'security', label: 'Security', icon: BsShieldCheck },
              ].map((object, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => setCurrent(object.current)}
                    style={{ backgroundColor: current === object.current && 'var(--bg-primary-9)' }}>
                    <object.icon className="sidebar-icon" />
                    <p
                      style={{ display: !isOpen && 'none' }}
                      className="sidebar-p">
                      {object.label}
                    </p>
                  </button>
                );
              })}
              <button
                style={{ color: 'indianred', marginTop: 'auto' }}
                onClick={() => setShowSecondaryModal('Logout')}>
                <MdLogout className="sidebar-icon" />
                <p
                  style={{ display: !isOpen && 'none' }}
                  className="sidebar-p">
                  Log Out
                </p>
              </button>
            </div>
          </div>
          <span data-custom={isOpen && 'margin-right'}></span>
          <HiMenuAlt2
            data-custom={isOpen && 'margin-left'}
            onClick={() => setIsOpen((current) => !current)}
            className={`menu-button ${isOpen ? 'open' : 'closed'}`}
          />
          <HiX
            data-custom={isOpen && 'margin-left'}
            onClick={() => setIsOpen((current) => !current)}
            className={`menu-button ${isOpen ? 'closed' : 'open'}`}
          />
          <div className="settings-main">
            <RiCloseCircleLine
              className="settings-close"
              onClick={() => setShowSettingsModal(false)}></RiCloseCircleLine>
            {current === 'profile' ? (
              <Profile
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
              />
            ) : current === 'security' ? (
              <Security
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
              />
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
