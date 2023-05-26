import React, { useContext, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import SecondaryModal from '../../../components/Modal/SecondaryModal';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../../App';

const CreateServerModal = ({ showCreateServer, setShowCreateServer }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const { useApi, useSocket, socket } = useContext(AuthContext);
  const [data, setData] = useState({ name: '', description: '' });
  const [msg, setMsg] = useState({ name: '', description: '' });

  const handleNameChange = (e) => {
    setData((prevData) => ({ ...prevData, name: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setData((prevData) => ({ ...prevData, description: e.target.value }));
  };

  return (
    <>
      <SecondaryModal
        showModal={showCreateServer}
        setShowModal={setShowCreateServer}>
        <div className="modal-container">
          <RiCloseCircleLine
            style={{ width: '1.8em', height: '1.8em' }}
            className="settings-close"
            onClick={() => setShowCreateServer('')}></RiCloseCircleLine>
          <div className="credentials">
            <h1>Create a Server</h1>
            {[
              {
                name: 'name',
                type: 'text',
                placeholder: 'Server Name',
                label: 'Server Name',
                handler: (e) => handleNameChange(e),
                value: data.name,
              },
              {
                name: 'description',
                type: 'text',
                placeholder: 'Server Description',
                label: 'Server Description',
                handler: (e) => handleDescriptionChange(e),
                value: data.description,
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
                onClick={() => setShowCreateServer('')}>
                Cancel
              </button>
              <button
                className="join-btn"
                onClick={() => {
                  if (msg.name !== '' || msg.description !== '') return;
                  useSocket(`user:createServer`, data);
                  setShowCreateServer('');
                }}>
                Create
              </button>
            </div>
          </div>
        </div>
      </SecondaryModal>
    </>
  );
};

export default CreateServerModal;
