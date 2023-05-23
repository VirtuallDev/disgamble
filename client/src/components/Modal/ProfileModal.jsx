import React from 'react';
import { useSelector } from 'react-redux';
import './profilemodal.css';

export const ProfileModal = ({ image }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;

  return (
    <>
      <div className="user-modal-container">
        <div className="user-modal-image">
          <img src={image}></img>
          <div style={{ backgroundColor: userInfo.status === 'Online' ? 'green' : userInfo.status === 'DND' ? 'red' : 'gray' }}></div>
        </div>
        <div className="user-modal-container2">
          <p className="user-modal-name">{userInfo.username}</p>
          <p className="user-modal-label">About Me</p>
          <p className="user-modal-para">{userInfo.about}</p>
          <p className="user-modal-label">Date of Birth</p>

          <p className="user-modal-para">
            {new Date(userInfo.dateOfBirth).toLocaleString('en-US', { year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}
          </p>
          <p className="user-modal-label">Account Creation Date</p>
          <p className="user-modal-para">
            {new Date(userInfo.creationDate).toLocaleString('en-US', { year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}
          </p>
        </div>
        <span style={{ height: '1em' }}></span>
      </div>
    </>
  );
};
