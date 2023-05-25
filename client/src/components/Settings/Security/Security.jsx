import React, { useContext, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import SecondaryModal from '../../Modal/SecondaryModal';
import { useSelector } from 'react-redux';
import SettingsField from '../SettingsField';
import { AuthContext } from '../../../App';

const Security = ({ showSecondaryModal, setShowSecondaryModal }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const { useApi, useSocket, socket } = useContext(AuthContext);
  const [data, setData] = useState({ password: '', confirmNewPassword: '', newPassword: '', email: '', phone: '' });
  const [msg, setMsg] = useState({ confirmNewPassword: '', newPassword: '', email: '', phone: '' });

  const handleEmailChange = (e) => {
    setData((prevData) => ({ ...prevData, email: e.target.value }));
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) return setMsg((prevMsg) => ({ ...prevMsg, email: 'Email does not match the required pattern!' }));
    setMsg((prevMsg) => ({ ...prevMsg, email: '' }));
  };

  const handlePhoneChange = (e) => {
    setData((prevData) => ({ ...prevData, phone: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setData((prevData) => ({ ...prevData, password: e.target.value }));
  };

  const handleNewPasswordChange = (e) => {
    setData((prevData) => ({ ...prevData, newPassword: e.target.value }));
    if (e.target.value !== data.confirmNewPassword) {
      setMsg((prevMsg) => ({ ...prevMsg, confirmNewPassword: 'Passwords do not match.' }));
    } else {
      setMsg((prevMsg) => ({ ...prevMsg, confirmNewPassword: '' }));
    }
    if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/))
      return setMsg((prevMsg) => ({ ...prevMsg, newPassword: 'Password should have at least one alphabetic letter, one capital letter and one numeric letter!' }));
    setMsg((prevMsg) => ({ ...prevMsg, newPassword: '' }));
  };

  const handleConfirmPasswordChange = (e) => {
    setData((prevData) => ({ ...prevData, confirmNewPassword: e.target.value }));
    if (e.target.value !== data.newPassword) return setMsg((prevMsg) => ({ ...prevMsg, confirmNewPassword: 'Passwords do not match.' }));
    setMsg((prevMsg) => ({ ...prevMsg, confirmNewPassword: '' }));
  };

  return (
    <>
      <div className="settings-profile-container">
        {[
          { title: 'Email', value: data.email, handler: handleEmailChange, error: msg.email, label: userAuth.email },
          { title: 'Phone Number', value: data.phone, handler: handlePhoneChange, error: msg.phone, label: userAuth?.phone },
        ].map((object) => {
          return (
            <React.Fragment key={object.title}>
              <SettingsField
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
                title={object.title}
                value={object.value}
                placeholder={object.title}
                type={object.title === 'Email' ? 'email' : 'text'}
                handler={object.handler}
                error={object.error}
                label={object.label}></SettingsField>
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
              {[
                {
                  name: 'password',
                  type: 'password',
                  placeholder: 'Password',
                  label: 'Current Password',
                  handler: (e) => handlePasswordChange(e),
                  value: data.currentPassword,
                },
                {
                  name: 'password2',
                  type: 'password',
                  placeholder: 'New Password',
                  label: 'New Password',
                  handler: (e) => handleNewPasswordChange(e),
                  value: data.newPassword,
                  error: msg.newPassword,
                },
                {
                  name: 'password3',
                  type: 'password',
                  placeholder: 'Confirm New Password',
                  label: 'Confirm New Password',
                  handler: (e) => handleConfirmPasswordChange(e),
                  value: data.confirmNewPassword,
                  error: msg.confirmNewPassword,
                },
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <div className="input-container">
                    <input
                      autoComplete={item.type === 'password' ? 'new-password' : 'off'}
                      name={item.name}
                      type={item.type}
                      required
                      placeholder={item.placeholder}
                      value={item.value}
                      onChange={(e) => item.handler(e)}></input>
                    <label htmlFor={item.name}>{item.label}</label>
                  </div>
                  <p
                    className="status-msg"
                    style={{ maxWidth: '350px', color: 'darkred', display: item.error !== '' ? 'initial' : 'none' }}>
                    {item.error}
                  </p>
                </React.Fragment>
              ))}
              <div className="modal-buttons">
                <button
                  className="join-btn"
                  onClick={() => setShowSecondaryModal('')}>
                  Cancel
                </button>
                <button
                  className="join-btn"
                  onClick={() => {
                    if (msg.newPassword !== '' || msg.confirmNewPassword !== '') return;
                    useSocket(`user:changePassword`, data);
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
