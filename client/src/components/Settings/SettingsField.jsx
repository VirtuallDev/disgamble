import React, { useContext } from 'react';
import SecondaryModal from '../Modal/SecondaryModal';
import { RiCloseCircleLine } from 'react-icons/ri';
import { AuthContext } from '../../App';

const SettingsField = ({
  title,
  value,
  showSecondaryModal,
  setShowSecondaryModal,
  placeholder,
  type = 'text',
  handler,
  error = '',
  label,
}) => {
  const { useApi, useSocket, socket } = useContext(AuthContext);

  return (
    <>
      <SecondaryModal
        showModal={showSecondaryModal === title}
        setShowModal={setShowSecondaryModal}>
        <div className="modal-container">
          <RiCloseCircleLine
            style={{ width: '1.8em', height: '1.8em' }}
            className="settings-close"
            onClick={() => setShowSecondaryModal('')}></RiCloseCircleLine>
          <div className="credentials">
            <h1>Change your {title}</h1>
            <div className="input-container">
              <input
                autoComplete={type === 'password' ? 'new-password' : 'off'}
                name="input"
                type={type}
                required
                placeholder={placeholder}
                value={value}
                onChange={(e) => handler(e)}></input>
              <label htmlFor="input">{placeholder}</label>
            </div>
            <p
              className="status-msg"
              style={{ maxWidth: '350px', color: 'darkred', display: error !== '' ? 'initial' : 'none' }}>
              {error}
            </p>
            <div className="modal-buttons">
              <button
                className="join-btn"
                onClick={() => setShowSecondaryModal('')}>
                Cancel
              </button>
              <button
                className="join-btn"
                onClick={() => {
                  if (error !== '') return;
                  useSocket(`user:change${title}`, value);
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
        <p style={{ color: !label && 'indianred' }}>{label || 'Unavailable'}</p>
        <button onClick={() => setShowSecondaryModal(title)}>EDIT</button>
      </div>
    </>
  );
};

export default SettingsField;
