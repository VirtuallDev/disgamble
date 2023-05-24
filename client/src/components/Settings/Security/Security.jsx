import React, { useState } from 'react';
import useAuth from '../../../customhooks/useAuth';
import { RiCloseCircleLine } from 'react-icons/ri';
import SecondaryModal from '../../Modal/SecondaryModal';
import { useSelector } from 'react-redux';

const Security = ({ showSecondaryModal, setShowSecondaryModal }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const [passwordObject, setPasswordObject] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const { useApi, useSocket, socket } = useAuth();

  return (
    <>
      <div className="settings-profile-container">
        {[
          { title: 'Email', value: userAuth.email },
          { title: 'Phone Number', value: userInfo.about },
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
        <button
          style={{ width: '12em' }}
          className="mic-test-button"
          onClick={() => setShowSecondaryModal('Password')}>
          CHANGE PASSWORD
        </button>
        <SecondaryModal
          showModal={showSecondaryModal === 'Password'}
          setShowModal={setShowSecondaryModal}>
          <div className="settings-edit-container">
            <RiCloseCircleLine
              style={{ width: '1.8em', height: '1.8em' }}
              className="settings-close"
              onClick={() => setShowSecondaryModal('')}></RiCloseCircleLine>
            <h1>Change your password</h1>
            <p>Current Password</p>
            <textarea
              value={passwordObject.currentPassword}
              onChange={(e) => setPasswordObject({ ...passwordObject, currentPassword: e.target.value })}
              rows={1}
            />
            <p>New Password</p>
            <textarea
              value={passwordObject.newPassword}
              onChange={(e) => setPasswordObject({ ...passwordObject, newPassword: e.target.value })}
              rows={1}
            />
            <p>Confirm New Password</p>
            <textarea
              value={passwordObject.confirmNewPassword}
              onChange={(e) => setPasswordObject({ ...passwordObject, confirmNewPassword: e.target.value })}
              rows={1}
            />
            <div>
              <button
                style={{ color: 'indianred' }}
                onClick={() => setShowSecondaryModal('')}>
                Cancel
              </button>
              <button
                onClick={() => {
                  useSocket(`user:changePassword`, inputValue);
                  setShowSecondaryModal('');
                }}>
                Confirm
              </button>
            </div>
          </div>
        </SecondaryModal>
      </div>
    </>
  );
};

export default Security;

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
