import React from 'react';
import ProfileModalPreview from './ProfileModalPreview';
import Modal from '../../../components/Modal/Modal';

const ProfileModal = ({ showUserProfile, setShowUserProfile, user, handler }) => {
  return (
    <>
      {user && (
        <Modal
          showModal={showUserProfile}
          setShowModal={setShowUserProfile}>
          <ProfileModalPreview
            userInfo={user.userInfo}
            setShowModal={setShowUserProfile}
            handler={() => handler(user)}></ProfileModalPreview>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
