import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './Server.css';
const API_URL = 'http://localhost:3000';

export const ServerList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { serverList } = userObject;

  const [servers, setServers] = useState([]);

  useEffect(() => {
    const fetchedServers = async () => {
      const response = await fetch(`${API_URL}/servers`);
      const jsonResponse = await response.json();
      if (jsonResponse.success) setServers(jsonResponse.success);
    };
    fetchedServers();
    console.log(servers);
  }, []);

  /*
  servername: String,
  serverId: String,
  serverImage: String,
  serverAddress: String,
  description: String,
  usersOnline: Array,
  dateCreated: Date, 
  */
  const handleServerClick = (id) => {
    console.log(`fetch server info and show a modal by id? ${id}`);
  };

  return (
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
  );
};
