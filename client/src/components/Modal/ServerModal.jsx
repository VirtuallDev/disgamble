import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { RiFileCopy2Line } from 'react-icons/ri';
import './ServerModal.css';
import { apiRequest } from '../../../apiHandler';

export const ServerModal = ({ showServerModal, setShowServerModal, serverId }) => {
  const [server, setServer] = useState({});

  const fetchServer = async (id) => {
    const jsonResponse = await apiRequest(`server/${id}`);
    if (jsonResponse.success) setServer(jsonResponse.success);
  };

  const copyAddress = (serverAddress) => {
    console.log('copied', serverAddress);
  };

  useEffect(() => {
    fetchServer(serverId);
  }, [serverId]);

  return (
    <>
      <Modal
        showModal={showServerModal}
        setShowModal={setShowServerModal}>
        <div className="server-modal-container">
          <button
            className="modal-close"
            onClick={() => setShowServerModal(false)}>
            &#215;
          </button>
          <img
            className="server-modal-image"
            src={server?.serverImage}></img>
          <div className="server-modal-container2">
            <p className="server-modal-name">{server?.servername}</p>
            <p className="modal-label">Address</p>
            <div className="server-modal-address-container">
              <p className="server-modal-address">{server?.serverAddress}</p>
              <div className="icon-container">
                <RiFileCopy2Line
                  size={'1.3em'}
                  onClick={() => copyAddress(server.serverAddress || '')}></RiFileCopy2Line>
                <p className="server-label">Copy Address</p>
              </div>
            </div>
            <p className="modal-label">Users Online</p>
            <div className="users-container">
              {[server?.usersOnline].map((user, index) => {
                return (
                  <div key={index}>
                    <img
                      src={user?.userImage}
                      alt=""></img>
                    <p>{user?.username}</p>
                  </div>
                );
              })}
            </div>
            <p className="modal-label">Description</p>
            <p className="modal-para">{server?.description}</p>
            <p className="modal-label">Creation Date</p>
            <p className="modal-para">{server?.dateCreated && new Date(server.dateCreated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: undefined })}</p>
          </div>
          <span style={{ height: '1em' }}></span>
        </div>
      </Modal>
    </>
  );
};
