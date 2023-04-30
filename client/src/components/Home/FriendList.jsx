import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import { useSelector } from 'react-redux';
import { socketRequest } from '../../apiHandler';
import { FaCheck, FaTimes } from 'react-icons/fa';
import './Friend.css';

const FriendsList = ({ setFriend, setCurrent }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { friends, friendRequests } = userObject;
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
      <AddFriend></AddFriend>
      <FriendsFilter
        setFriendOption={setFriendOption}
        friendOption={friendOption}></FriendsFilter>
      {friendOption !== 'Pending'
        ? filteredFriends.map((friend, index) => {
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
          })
        : friendRequests.map((user, index) => {
            return (
              <div
                key={index}
                className="friends-container">
                <div className="image-container">
                  <img
                    src={user.userImage}
                    className="user-image"
                    alt=""
                  />
                </div>
                <p className="friend-name">{user.username}</p>
                <div className="pending-buttons">
                  <div
                    className="accept"
                    onClick={() => socketRequest('user:accept', user.userId)}>
                    <FaCheck
                      color={'inherit'}
                      size={'1.6em'}></FaCheck>
                  </div>
                  <div
                    className="decline"
                    onClick={() => socketRequest('user:decline', user.userId)}>
                    <FaTimes
                      color={'inherit'}
                      size={'1.6em'}></FaTimes>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default FriendsList;

const FriendsFilter = ({ setFriendOption, friendOption }) => {
  return (
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
  );
};

const AddFriend = () => {
  const [username, setUsername] = useState('');

  return (
    <div className="add-friend">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}></input>
      <button onClick={() => socketRequest('user:addfriend', username)}>Add Friend</button>
    </div>
  );
};
