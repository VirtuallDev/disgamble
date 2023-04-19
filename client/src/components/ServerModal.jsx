import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import './ServerModal.css';
const API_URL = 'http://localhost:3000';

export const ServerModal = ({ showServerModal, setShowServerModal, serverId }) => {
  const [server, setServer] = useState({});

  const fetchServer = async (id) => {
    try {
      const response = await fetch(`${API_URL}/server/${id}`);
      const jsonResponse = await response.json();
      if (jsonResponse.success) setServer(jsonResponse.success);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServer(serverId);
  }, [showServerModal]);

  return (
    <>
      <Modal
        showModal={showServerModal}
        setShowModal={setShowServerModal}>
        <div className="server-modal-container">
          <img
            className="server-modal-image"
            src={server?.serverImage}></img>
          <p className="server-modal-name">{server?.servername}</p>
          <div className="server-modal-address-container">
            <p>Copy Address</p>
            <button className="server-modal-address">{server?.serverAddress}</button>
          </div>
          <p className="server-modal-description">{server?.description}</p>
          <p>{server?.dateCreated}</p>
          <p>{server?.usersOnline?.length}</p>
        </div>
      </Modal>
    </>
  );
};
