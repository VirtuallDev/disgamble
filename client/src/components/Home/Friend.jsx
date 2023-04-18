import React from 'react';
import './Friend.css';
import { Header } from './Header';
const randomIMG = 'https://www.thisiscolossal.com/wp-content/uploads/2019/02/d1aehdnbq0h21-960x960@2x.jpg';

export const FriendsList = () => {
  return (
    <div className="friend-list">
      <Header
        fontSize={'32px'}
        label={'Friends'}
      />
      {[1, 2, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5].map((e, index) => {
        return <Friend key={index} />;
      })}
    </div>
  );
};

const Friend = (props) => {
  const handleFriendClick = (id) => {
    console.log(`redirect to specific dm ${id}`);
  };

  return (
    <div
      className="friends-container"
      onClick={() => handleFriendClick('friend id?')}>
      <div className="image-container">
        <img
          src={randomIMG}
          className="user-image"
          alt=""
        />
        <div className="status"></div>
      </div>
      <p className="friend-name">Friend Name</p>
    </div>
  );
};
