import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { useSelector } from 'react-redux';
import './Friend.css';

const FriendsList = ({ setFriend, setCurrent }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { friends } = userObject;
  const [friendOption, setFriendOption] = useState('All');
  const [filteredFriends, setFilteredFriends] = useState(friends);

  const friendClick = (friend) => {
    setCurrent(false);
    setFriend(friend);
  };

  useEffect(() => {
    switch (friendOption) {
      case 'All':
        setFilteredFriends(friends.filter((friend) => friend.status === 'Online' || friend.status === 'Offline' || friend.status === 'DND'));
        break;
      case 'Online':
        setFilteredFriends(friends.filter((friend) => friend.status === 'Online'));
        break;
      case 'Offline':
        setFilteredFriends(friends.filter((friend) => friend.status === 'Offline'));
        break;
      default:
        setFilteredFriends(friends);
    }
  }, [friendOption]);

  return (
    <div className="friend-list">
      <Header
        fontSize={'32px'}
        label={'Friends'}
      />
      <div className="friend-options">
        <button
          onClick={() => setFriendOption('All')}
          className="friend-option"
          style={{ backgroundColor: friendOption === 'All' ? 'var(--bg-primary-3)' : '' }}>
          All
        </button>
        <button
          onClick={() => setFriendOption('Online')}
          className="friend-option"
          style={{ backgroundColor: friendOption === 'Online' ? 'var(--bg-primary-3)' : '' }}>
          Online
        </button>
        <button
          onClick={() => setFriendOption('Offline')}
          className="friend-option"
          style={{ backgroundColor: friendOption === 'Offline' ? 'var(--bg-primary-3)' : '' }}>
          Offline
        </button>
        <button
          onClick={() => setFriendOption('Pending')}
          className="friend-option"
          style={{ backgroundColor: friendOption === 'Pending' ? 'var(--bg-primary-3)' : '' }}>
          Pending
        </button>
      </div>
      {filteredFriends.map((friend, index) => {
        return (
          <div
            key={index}
            className="friends-container"
            onClick={() => friendClick(friend)}>
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
