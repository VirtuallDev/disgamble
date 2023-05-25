import React from 'react';
import ProfileModalPreview from './ProfileModalPreview';
import Modal from './Modal';

const ProfileModal = ({ showUserProfile, setShowUserProfile, user, setFriend }) => {
  return (
    <>
      {user && (
        <Modal
          showModal={showUserProfile}
          setShowModal={setShowUserProfile}>
          <div className="profile-modal-container">
            <ProfileModalPreview
              userInfo={user.userInfo}
              setShowModal={setShowUserProfile}
              setFriend={() => setFriend(user)}></ProfileModalPreview>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
