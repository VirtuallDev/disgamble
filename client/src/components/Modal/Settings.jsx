import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { ProfileModal } from './ProfileModal';
import { useSelector } from 'react-redux';
import { RiCloseCircleLine } from 'react-icons/ri';
import useAuth, { API_URL } from '../../customhooks/useAuth';
import './settings.css';

export const Settings = ({ showSettingsModal, setShowSettingsModal }) => {
  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  };

  return (
    <>
      <Modal
        showModal={showSettingsModal}
        setShowModal={setShowSettingsModal}>
        <div className="settings-modal-container">
          <RiCloseCircleLine
            className="settings-close"
            onClick={() => setShowSettingsModal(false)}></RiCloseCircleLine>
          <div className="settings-container">
            <div className="settings-sidebar-buttons">
              <button>Profile</button>
              <button>Security</button>
              <button>Voice</button>
              <button style={{ color: 'indianred', marginTop: 'auto' }}>Log Out</button>
            </div>
          </div>
          <div className="settings-main">
            <Profile></Profile>
          </div>
        </div>
      </Modal>
    </>
  );
};

const Profile = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage, username, about, status } = userObject;
  const [fileToSend, setFileToSend] = useState(null);
  const { useApi, useSocket, socket } = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setFileToSend(formData);
  };

  async function handleFileUpload() {
    await useApi('upload', 'POST', fileToSend, false);
  }

  return (
    <>
      <div className="settings-profile-container">
        <div className="settings-profile-field-image">
          <img
            src={userImage}
            alt=""></img>
          <input
            type="file"
            onChange={(e) => handleFileChange(e)}
          />
          <button onClick={() => handleFileUpload()}>CHANGE</button>
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
