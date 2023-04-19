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
          <p>{server?.servername}</p>
          <p>{server?.serverId}</p>
          <p>{server?.serverImage}</p>
          <p>{server?.serverAddress}</p>
          <p>{server?.description}</p>
          <p>{server?.usersOnline}</p>
          <p>{server?.dateCreated}</p>
        </div>
      </Modal>
    </>
  );
};
