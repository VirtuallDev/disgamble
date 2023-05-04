import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Global/Header/Header';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';
import useAuth from '../../customhooks/useAuth';
import Options from '../../components/Global/Options/Options';
import DropDown from '../../components/Global/DropDown/DropDown';
import './friendlist.css';

const FriendsList = ({ setFriend, setCurrent, selectedFriend }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { friends, friendRequests } = userObject;
  const [friendOption, setFriendOption] = useState('All');
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const { useApi, useSocket, socket } = useAuth();

  const friendClick = (friend) => {
    setCurrent(false);
    setFriend(friend);
  };

  const profileFriend = (friend) => {
    console.log(friend.userId);
  };

  const deleteFriend = (friend) => {
    console.log(friend.userId);
  };

  const buttonsArray = [
    { name: 'PROFILE', color: 'white', handler: profileFriend },
    { name: 'DELETE', color: 'red', handler: deleteFriend },
  ];
  const options = ['All', 'Online', 'Offline', 'Pending'];

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
      <DropDown
        value={friendOption}
        setValue={setFriendOption}
        name={'Filter'}
        options={options}></DropDown>
      {friendOption !== 'Pending'
        ? filteredFriends.map((friend, index) => {
            return (
              <div
                key={index}
                className="friends-container"
                style={{ backgroundColor: selectedFriend?.userId === friend?.userId && 'var(--bg-primary-2)' }}
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
                <div style={{ position: 'absolute', right: '0.2em', top: '0.2em' }}>
                  <Options
                    currentValue={friend.userId}
                    buttons={buttonsArray}
                    object={friend}></Options>
                </div>
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
                    onClick={() => useSocket('user:accept', user.userId)}>
                    <FaCheck
                      color={'inherit'}
                      size={'1.6em'}></FaCheck>
                  </div>
                  <div
                    className="decline"
                    onClick={() => useSocket('user:decline', user.userId)}>
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

const AddFriend = () => {
  const [username, setUsername] = useState('');
  const { useApi, useSocket, socket } = useAuth();

  return (
    <div
      className="add-friend"
      style={{ marginBottom: '0.5em' }}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}></input>
      <button
        className="friend-button"
        onClick={() => useSocket('user:addfriend', username)}>
        Add Friend
      </button>
    </div>
  );
};
