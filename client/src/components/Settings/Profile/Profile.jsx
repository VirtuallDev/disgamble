import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileModalPreview from '../../Modal/ProfileModalPreview';
import SettingsField from '../SettingsField';
import { AuthContext } from '../../../App';

const Profile = ({ showSecondaryModal, setShowSecondaryModal }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const [image, setImage] = useState(null);
  const [fileToSend, setFileToSend] = useState(null);
  const { useApi, useSocket, socket } = useContext(AuthContext);
  const [data, setData] = useState({ username: '', about: '' });
  const [msg, setMsg] = useState({ username: '', about: '' });

  const handleUsernameChange = (e) => {
    setData((prevData) => ({ ...prevData, username: e.target.value }));
    if (e.target.value.length > 15) return setMsg((prevMsg) => ({ ...prevMsg, username: 'Username can not be longer than 15 characters!' }));
    setMsg((prevMsg) => ({ ...prevMsg, username: '' }));
  };

  const handleAboutChange = (e) => {
    setData((prevData) => ({ ...prevData, about: e.target.value }));
    if (e.target.value.length > 150) return setMsg((prevMsg) => ({ ...prevMsg, about: 'Can not be longer than 150 characters!' }));
    setMsg((prevMsg) => ({ ...prevMsg, about: '' }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const formData = new FormData();
    formData.append('file', file);
    setFileToSend(formData);
  };

  async function handleFileUpload() {
    await useApi('upload', 'POST', fileToSend, false);
  }

  return (
    <>
      <div className="settings-profile-container">
        <div className="settings-profile-field-image">
          <img
            src={image ? URL.createObjectURL(image) : userInfo.image}
            alt=""></img>
          <div className="upload">
            <label
              htmlFor="fileInput"
              className="custom-file-label">
              CHOOSE IMAGE (8MB)
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden-input"
              onChange={(e) => handleFileChange(e)}
            />
          </div>
          <button onClick={() => handleFileUpload()}>APPLY</button>
        </div>
        {[
          { title: 'Username', value: data.username, handler: handleUsernameChange, error: msg.username, label: userInfo.username },
          { title: 'About', value: data.about, handler: handleAboutChange, error: msg.about, label: userInfo.about },
        ].map((object) => {
          return (
            <React.Fragment key={object.title}>
              <SettingsField
                showSecondaryModal={showSecondaryModal}
                setShowSecondaryModal={setShowSecondaryModal}
                title={object.title}
                value={object.value}
                placeholder={object.title}
                type={'text'}
                handler={object.handler}
                error={object.error}
                label={object.label}></SettingsField>
            </React.Fragment>
          );
        })}
        <h1 className="preview">Profile Preview</h1>
        <ProfileModalPreview
          userInfo={{ ...userInfo, image: image ? URL.createObjectURL(image) : userInfo.image }}
          closeButton={false}></ProfileModalPreview>
      </div>
    </>
  );
};

export default Profile;
