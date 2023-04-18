import React from 'react';
import './Friend.css';
import { Header } from './Header';
import { useSelector } from 'react-redux';

export const FriendsList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { friends } = userObject;

  const handleFriendClick = (id) => {
    console.log(`redirect to dm ${id}`);
  };

  return (
    <div className="friend-list">
      <Header
        fontSize={'32px'}
        label={'Friends'}
      />
      {friends.map((friend, index) => {
        return (
          <div
            key={index}
            className="friends-container"
            onClick={() => handleFriendClick(friend.userId)}>
            <div className="image-container">
              <img
                src={friend.userImage}
                className="user-image"
                alt=""
              />
              <div
                className="status"
                style={{ backgroundColor: friend.status === 'Online' ? 'green' : friend.status === 'DND' ? 'red' : 'gray' }}></div>
            </div>
            <p className="friend-name">{friend.username}</p>
          </div>
        );
      })}
    </div>
  );
};
