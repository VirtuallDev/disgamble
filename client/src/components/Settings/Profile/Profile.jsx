import React, { useState } from 'react';
import useAuth from '../../../customhooks/useAuth';
import { RiCloseCircleLine } from 'react-icons/ri';
import SecondaryModal from '../../Modal/SecondaryModal';
import { useSelector } from 'react-redux';
import ProfileModal from '../../Modal/ProfileModal';

const Profile = ({ showSecondaryModal, setShowSecondaryModal }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
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
            src={image ? URL.createObjectURL(image) : userInfo.image}
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
          { title: 'Username', value: userInfo.username },
          { title: 'About', value: userInfo.about },
        ].map((object) => {
          return (
            <React.Fragment key={object.title}>
              <SettingsField
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
                title={object.title}
                value={object.value}
                rows={object.title === 'About' ? 6 : 1}></SettingsField>
            </React.Fragment>
          );
        })}
        <h1 className="preview">Profile Preview</h1>
        <ProfileModal image={image ? URL.createObjectURL(image) : userInfo.image}></ProfileModal>
      </div>
    </>
  );
};

export default Profile;

const SettingsField = ({ title, value, showSecondaryModal, setShowSecondaryModal, rows }) => {
  const { useApi, useSocket, socket } = useAuth();
  const [inputValue, setInputValue] = useState(value);

  return (
    <>
      <SecondaryModal
        showModal={showSecondaryModal === title}
        setShowModal={setShowSecondaryModal}>
        <div className="settings-edit-container">
          <RiCloseCircleLine
            style={{ width: '1.8em', height: '1.8em' }}
            className="settings-close"
            onClick={() => setShowSecondaryModal('')}></RiCloseCircleLine>
          <h1>Change your {title}</h1>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={rows}
          />
          <div>
            <button
              style={{ color: 'indianred' }}
              onClick={() => setShowSecondaryModal('')}>
              Cancel
            </button>
            <button
              onClick={() => {
                useSocket(`user:change${title}`, inputValue);
                setShowSecondaryModal('');
              }}>
              Confirm
            </button>
          </div>
        </div>
      </SecondaryModal>
      <div className="settings-profile-field">
        <h1>{title}:</h1>
        <p style={{ color: !value && 'indianred' }}>{value || 'Unavailable'}</p>
        <button onClick={() => setShowSecondaryModal(title)}>EDIT</button>
      </div>
    </>
  );
};
