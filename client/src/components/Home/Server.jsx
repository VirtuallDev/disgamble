import React from 'react';
import { useSelector } from 'react-redux';
import './Server.css';

export const ServerList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { serverList } = userObject;

  const handleServerClick = (id) => {
    console.log(`fetch server info and show a modal by id? ${id}`);
  };
  return (
    <div className="server-list">
      {serverList.map((server, index) => {
        return (
          <div
            key={index}
            className="server-container"
            onClick={() => handleServerClick('id of a server from props')}>
            <div className="server">
              <img
                src={server?.image}
                className="server-image"
                alt=""
              />
              <p className="server-name">{server?.name}</p>
              <p className="server-clients">{server?.usersOnline}</p>
            </div>
            <div className="breakline"></div>
          </div>
        );
      })}
    </div>
  );
};
