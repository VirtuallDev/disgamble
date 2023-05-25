import React from 'react';
import ProfileModalPreview from './ProfileModalPreview';
import Modal from './Modal';

const ProfileModal = ({ showUserProfile, setShowUserProfile, userInfo }) => {
  return (
    <>
      {userInfo && (
        <Modal
          showModal={showUserProfile}
          setShowModal={setShowUserProfile}>
          <div className="profile-modal-container">
            <ProfileModalPreview
              userInfo={userInfo}
              setShowModal={setShowUserProfile}></ProfileModalPreview>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
