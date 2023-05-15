import React from 'react';
import { useSelector } from 'react-redux';
import './profilemodal.css';

export const ProfileModal = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage, username, about, status } = userObject;

  return (
    <>
      <div className="user-modal-container">
        <div className="user-modal-image">
          <img src={userImage}></img>
          <div style={{ backgroundColor: status === 'Online' ? 'green' : status === 'DND' ? 'red' : 'gray' }}></div>
        </div>
        <div className="user-modal-container2">
          <p className="user-modal-name">{username}</p>
          <p className="user-modal-label">About Me</p>
          <p className="user-modal-para">{about}Extra</p>
          <p className="user-modal-label">Date of Birth</p>
          <p className="user-modal-para">{new Date(11111).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>
          <p className="user-modal-label">Account Creation Date</p>
          <p className="user-modal-para">{new Date(11111).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>
        </div>
        <span style={{ height: '1em' }}></span>
      </div>
    </>
  );
};
