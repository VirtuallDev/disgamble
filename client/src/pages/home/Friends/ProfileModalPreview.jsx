import React from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';

const ProfileModalPreview = ({ userInfo, setShowModal, closeButton = true, handler }) => {
  return (
    <>
      <div className={closeButton ? 'modal-container' : 'modal-container-preview'}>
        {closeButton && (
          <RiCloseCircleLine
            className="modal-close"
            onClick={() => setShowModal(false)}></RiCloseCircleLine>
        )}
        <div className="modal-image">
          <img src={userInfo.image}></img>
          <div style={{ backgroundColor: userInfo.status === 'Online' ? 'green' : userInfo.status === 'DND' ? 'red' : 'gray' }}></div>
        </div>
        <div style={{ width: '90%', marginBottom: '0.5em' }}>
          <button
            onClick={() => {
              handler();
              setShowModal(false);
            }}
            style={{ borderRadius: '5px' }}
            className="friend-button">
            Send Message
          </button>
        </div>
        <div className="modal-container2">
          <p className="modal-name">{userInfo.username}</p>
          <p className="modal-label">About Me</p>
          <p className="modal-para">{userInfo.about}</p>
          <p className="modal-label">Date of Birth</p>

          <p className="modal-para">
            {new Date(userInfo.dateOfBirth).toLocaleString('en-US', { year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}
          </p>
          <p className="modal-label">Account Creation Date</p>
          <p className="modal-para">
            {new Date(userInfo.creationDate).toLocaleString('en-US', { year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}
          </p>
        </div>
        <span style={{ height: '1em' }}></span>
      </div>
    </>
  );
};

export default ProfileModalPreview;
