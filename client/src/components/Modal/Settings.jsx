import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import SecondaryModal from './SecondaryModal';
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
  const [image, setImage] = useState(null);
  const [fileToSend, setFileToSend] = useState(null);
  const { useApi, useSocket, socket } = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
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
            src={image ? URL.createObjectURL(image) : userImage}
            alt=""></img>
          <div className="upload">
            <label
              htmlFor="fileInput"
              className="custom-file-label">
              CHOOSE IMAGE (8MB)
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden-input"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <button onClick={() => handleFileUpload()}>APPLY</button>
        </div>
        {[
          { title: 'Username', value: username },
          { title: 'Email', value: 'Email' },
          { title: 'About', value: about },
        ].map((object) => {
          return (
            <React.Fragment key={object.title}>
              <SettingsField
                title={object.title}
                value={object.value}></SettingsField>
            </React.Fragment>
          );
        })}
        <h1 className="preview">Profile Preview</h1>
        <ProfileModal image={image ? URL.createObjectURL(image) : userImage}></ProfileModal>
      </div>
    </>
  );
};

const SettingsField = ({ title, value }) => {
  const { useApi, useSocket, socket } = useAuth();
  const [showFieldModal, setShowFieldModal] = useState('');
  const inputRef = useRef(null);

  return (
    <>
      <SecondaryModal
        showModal={showFieldModal === title}
        setShowModal={setShowFieldModal}>
        <div className="settings-edit-container">
          <RiCloseCircleLine
            style={{ width: '1.8em', height: '1.8em' }}
            className="settings-close"
            onClick={() => setShowFieldModal('')}></RiCloseCircleLine>
          <h1>Change your {title}</h1>
          <p
            ref={inputRef}
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: value }}></p>
          <div>
            <button onClick={() => setShowFieldModal('')}>Cancel</button>
            <button
              onClick={() => {
                useSocket(`user:change${title}`, inputRef.current.textContent);
                setShowFieldModal('');
              }}>
              Confirm
            </button>
          </div>
        </div>
      </SecondaryModal>
      <div className="settings-profile-field">
        <h1>{title}:</h1>
        <p style={{ color: !value && 'indianred' }}>{value || 'Unavailable'}</p>
        <button onClick={() => setShowFieldModal(title)}>EDIT</button>
      </div>
    </>
  );
};
