import React, { useContext, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import SecondaryModal from '../../Modal/SecondaryModal';
import { useSelector } from 'react-redux';
import SettingsField from '../SettingsField';
import { AuthContext } from '../../../App';

const Security = ({ showSecondaryModal, setShowSecondaryModal }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const [passwordObject, setPasswordObject] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const { useApi, useSocket, socket } = useContext(AuthContext);

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
                placeholder={object.title}
                type={object.title === 'Email' ? 'email' : 'text'}></SettingsField>
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
            <div className="credentials">
              <h1>Change your password</h1>
              <div className="input-container">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={passwordObject.currentPassword}
                  onChange={(e) => setPasswordObject({ ...passwordObject, currentPassword: e.target.value })}></input>
                <label htmlFor="password">Current Password</label>
              </div>

              <div className="input-container">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={passwordObject.newPassword}
                  onChange={(e) => setPasswordObject({ ...passwordObject, newPassword: e.target.value })}></input>
                <label htmlFor="password">New Password</label>
              </div>

              <div className="input-container">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={passwordObject.confirmNewPassword}
                  onChange={(e) => setPasswordObject({ ...passwordObject, confirmNewPassword: e.target.value })}></input>
                <label htmlFor="password">Confirm New Password</label>
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
                    useSocket(`user:changePassword`, inputValue);
                    setShowSecondaryModal('');
                  }}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </SecondaryModal>
      </div>
    </>
  );
};

export default Security;
