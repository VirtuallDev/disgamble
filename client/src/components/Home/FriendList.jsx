import React from 'react';
import { Header } from './Header';
import { useSelector } from 'react-redux';
import './Friend.css';

const FriendsList = ({ setUserId }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { friends } = userObject;

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
            onClick={() => setUserId(friend.userId)}>
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

export default FriendsList;
