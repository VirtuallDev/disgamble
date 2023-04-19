import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Server.css';
import { ServerModal } from '../ServerModal';
const API_URL = 'http://localhost:3000';

export const ServerList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { serverList } = userObject;

  const [servers, setServers] = useState([]);
  const [currentServer, setCurrentServer] = useState('');
  const [showServerModal, setShowServerModal] = useState(false);

  const fetchServers = async () => {
    const response = await fetch(`${API_URL}/servers`);
    const jsonResponse = await response.json();
    if (jsonResponse.success) setServers(jsonResponse.success);
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleServerClick = (id) => {
    setCurrentServer(id);
    setShowServerModal(true);
  };

  return (
    <>
      {showServerModal && (
        <ServerModal
          showServerModal={showServerModal}
          setShowServerModal={setShowServerModal}
          serverId={currentServer}
        />
      )}
      <div className="server-list">
        {servers.map((server, index) => {
          return (
            <div
              key={index}
              className="server-container"
              onClick={() => handleServerClick(server?.serverId)}>
              <div className="server">
                <img
                  src={server?.serverImage}
                  className="server-image"
                  alt=""
                />
                <p className="server-name">{server?.servername}</p>
                <p className="server-clients">{server?.usersOnline.length}</p>
              </div>
              <div className="breakline"></div>
            </div>
          );
        })}
      </div>
    </>
  );
};
