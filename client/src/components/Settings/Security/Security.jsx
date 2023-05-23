import React from 'react';
import { useSelector } from 'react-redux';

const Security = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;

  return (
    <>
      <div className="settings-profile-container"></div>
    </>
  );
};

export default Security;
