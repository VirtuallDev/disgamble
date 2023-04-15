import React from 'react';
import './Friend.css';
const randomIMG = 'https://www.thisiscolossal.com/wp-content/uploads/2019/02/d1aehdnbq0h21-960x960@2x.jpg';

export const Friend = () => {
  return (
    <div className="friends-container">
      <div className="image-container">
        <img
          src={randomIMG}
          className="friend-image"
          alt=""
        />
        <div className="status"></div>
      </div>
      <p className="friend-name">Friend Name</p>
    </div>
  );
};
