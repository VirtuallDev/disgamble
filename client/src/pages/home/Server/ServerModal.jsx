import React from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import Modal from '../../../components/Modal/Modal';

const ServerModal = ({ showServerModal, setShowServerModal, serverObject }) => {
  return (
    <>
      {serverObject && (
        <Modal
          showModal={showServerModal}
          setShowModal={setShowServerModal}>
          <div className="modal-container">
            <RiCloseCircleLine
              className="modal-close"
              onClick={() => setShowServerModal(false)}></RiCloseCircleLine>
            <div className="modal-image">
              <img src={serverObject.server.image}></img>
            </div>
            <div style={{ width: '90%', marginBottom: '0.5em' }}></div>
            <div className="modal-container2">
              <p className="modal-name">{serverObject.server.name}</p>
              <p className="modal-label">Description</p>
              <p className="modal-para">{serverObject.server.description}</p>
              <p className="modal-label">Server Creation Date</p>
              <p className="modal-para">
                {new Date(serverObject.server.creationDate).toLocaleString('en-US', {
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span style={{ height: '1em' }}></span>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ServerModal;
