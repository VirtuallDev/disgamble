import React from 'react';
import './Server.css';
import { Header } from './Header';
const randomIMG = 'https://www.thisiscolossal.com/wp-content/uploads/2019/02/d1aehdnbq0h21-960x960@2x.jpg';

export const ServerList = () => {
  return (
    <div className="server-list">
      <Header
        fontSize={'32px'}
        label={'Servers'}
      />
      {[1, 2, 3, 4, 5].map((e, index) => {
        return <Server key={index} />;
      })}
    </div>
  );
};

const Server = () => {
  const handleServerClick = (id) => {
    console.log(`fetch server info and show a modal by id? ${id}`);
  };

  return (
    <div
      className="server-container"
      onClick={() => handleServerClick('id of a server from props')}>
      <div className="server">
        <img
          src={randomIMG}
          className="server-image"
          alt=""
        />
        <p className="server-name">Server Name</p>
        <p className="server-clients">10/20</p>
      </div>
      <div className="breakline"></div>
    </div>
  );
};
