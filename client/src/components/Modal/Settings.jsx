import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import SecondaryModal from './SecondaryModal';
import { ProfileModal } from './ProfileModal';
import { useSelector } from 'react-redux';
import { RiCloseCircleLine } from 'react-icons/ri';
import { BiRightArrow } from 'react-icons/bi';
import { ImRadioUnchecked, ImRadioChecked } from 'react-icons/im';
import useAuth, { API_URL } from '../../customhooks/useAuth';
import './settings.css';

export const Settings = ({ showSettingsModal, setShowSettingsModal }) => {
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

const Voice = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage, username, about, status } = userObject;
  const [inputMode, setInputMode] = useState('push');
  const [pushToTalkKey, setPushToTalkKey] = useState('1');
  const [isListenerActive, setIsListenerActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isListenerActive) {
        setPushToTalkKey(event.key);
        setIsListenerActive(false);
      }
    };
    if (isListenerActive) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isListenerActive]);

  return (
    <>
      <div className="settings-profile-container">
        <div className="voice-field-container">
          <p>Incoming Volume</p>
          <input
            className="slider"
            type="range"
            min="0"
            max="100"
          />
        </div>
        <div className="voice-field-container">
          <p>Input Mode</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              className="voice-button"
              onClick={() => setInputMode('push')}>
              {inputMode === 'push' ? <ImRadioChecked style={{ marginRight: '0.5em' }} /> : <ImRadioUnchecked style={{ marginRight: '0.5em' }} />}
              Push To Talk
            </button>
            <button
              className="voice-button"
              onClick={() => setInputMode('continuous')}>
              {inputMode === 'continuous' ? <ImRadioChecked style={{ marginRight: '0.5em' }} /> : <ImRadioUnchecked style={{ marginRight: '0.5em' }} />}
              Continuous Transmission
            </button>
          </div>
          {inputMode === 'push' && (
            <div
              className="settings-profile-field"
              style={{ width: '100%' }}>
              <h1 style={{ whiteSpace: 'nowrap' }}>Push To Talk Key:</h1>
              <p style={{ color: !isListenerActive ? 'white' : 'indianred' }}>{!isListenerActive ? pushToTalkKey : 'Press a Key'}</p>
              <button onClick={() => setIsListenerActive(true)}>EDIT</button>
            </div>
          )}
        </div>
        <div>Mic Test</div>
      </div>
    </>
  );
};

const Security = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage, username, about, status } = userObject;

  return (
    <>
      <div className="settings-profile-container"></div>
    </>
  );
};

const Profile = ({ showSecondaryModal, setShowSecondaryModal }) => {
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
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
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

const SettingsField = ({ title, value, showSecondaryModal, setShowSecondaryModal }) => {
  const { useApi, useSocket, socket } = useAuth();
  const inputRef = useRef(null);

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
          <p
            ref={inputRef}
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: value }}></p>
          <div>
            <button
              style={{ color: 'indianred' }}
              onClick={() => setShowSecondaryModal('')}>
              Cancel
            </button>
            <button
              onClick={() => {
                useSocket(`user:change${title}`, inputRef.current.textContent);
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
