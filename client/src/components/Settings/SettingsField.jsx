import React, { useState } from 'react';
import useAuth from '../../customhooks/useAuth';
import SecondaryModal from '../Modal/SecondaryModal';
import { RiCloseCircleLine } from 'react-icons/ri';

const SettingsField = ({ title, value, showSecondaryModal, setShowSecondaryModal, placeholder, type = 'text' }) => {
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
          <div className="credentials">
            <h1>Change your {title}</h1>
            <div className="input-container">
              <input
                name="input"
                type={type}
                required
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}></input>
              <label htmlFor="input">{placeholder}</label>
            </div>
            <div className="modal-buttons">
              <button
                className="join-btn"
                onClick={() => setShowSecondaryModal('')}>
                Cancel
              </button>
              <button
                className="join-btn"
                onClick={() => {
                  useSocket(`user:change${title}`, inputValue);
                  setShowSecondaryModal('');
                }}>
                Confirm
              </button>
            </div>
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

export default SettingsField;
