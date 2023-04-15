import React from 'react';
import './Server.css';
const randomIMG = 'https://www.thisiscolossal.com/wp-content/uploads/2019/02/d1aehdnbq0h21-960x960@2x.jpg';

export const Server = () => {
  return (
    <div className="server-container">
      <img
        src={randomIMG}
        className="server-image"
        alt=""
      />
      <p className="server-name">Server Name</p>
      <p className="server-clients">10/20</p>
    </div>
  );
};
