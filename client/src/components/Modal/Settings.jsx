import React, { useState } from 'react';
import Modal from './Modal';
import './settings.css';
import { ProfileModal } from './ProfileModal';
import { useSelector } from 'react-redux';

export const Settings = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(true);

  return (
    <>
      <Modal
        showModal={showLogoutModal}
        setShowModal={setShowLogoutModal}>
        <div className="settings-modal-container">
          <div className="settings-container">
            <div className="settings-sidebar">
              <div className="settings-sidebar-buttons">
                <button>Profile</button>
                <button>Security</button>
                <button>Voice</button>
                <button style={{ color: 'indianred', marginTop: 'auto', marginBottom: '1.5em' }}>Log Out</button>
              </div>
            </div>
            <div className="settings-main">
              <Profile></Profile>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const Profile = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage, username, about, status } = userObject;

  return (
    <>
      <div className="settings-profile-container">
        <div className="settings-profile-field-image">
          <img
            src={userImage}
            alt=""></img>
          <button>CHANGE</button>
        </div>
        <div className="settings-profile-field">
          <h1>Username:</h1>
          <p>{username}</p>
          <button>EDIT</button>
        </div>
        <div className="settings-profile-field">
          <h1>Email:</h1>
          <p>BlaBla@gmail.com</p>
          <button>EDIT</button>
        </div>
        <div className="settings-profile-field">
          <h1>About:</h1>
          <p style={{ color: !about && 'indianred' }}>{about || 'Unavailable'}</p>
          <button>EDIT</button>
        </div>
        <h1 className="preview">Profile Preview</h1>
        <ProfileModal></ProfileModal>
      </div>
    </>
  );
};
