import React, { useEffect, useRef, useState } from 'react';
import Header from '../../components/Global/Header/Header';
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { BiEnvelope } from 'react-icons/bi';
import useAuth from '../../customhooks/useAuth';
import Options from '../../components/Global/Options/Options';
import DropDown from '../../components/Global/DropDown/DropDown';
import './friendlist.css';

const FriendsList = ({ setFriend, setCurrent, selectedFriend }) => {
  const userObject = useSelector((state) => state.user.userObject);
  const { friends, friendRequests } = userObject;
  const [friendOption, setFriendOption] = useState('All (0)');
  const [filteredFriends, setFilteredFriends] = useState(friends);
  const { useApi, useSocket, socket } = useAuth();
  const [options, setOptions] = useState(['All (0)', 'Online (0)', 'Offline (0)', 'Pending (0)']);

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

  useEffect(() => {
    switch (friendOption.split(' ')[0]) {
      case 'All':
        setFilteredFriends(friends);
        break;
      case 'Online':
        setFilteredFriends(friends.filter((friend) => friend.status === 'Online'));
        break;
      case 'Offline':
        setFilteredFriends(friends.filter((friend) => friend.status === 'Offline'));
        break;
      case 'Pending':
        setFilteredFriends(friends.filter((friend) => friend.status !== 'Online' && friend.status !== 'Offline' && friend.status !== 'DND'));
        break;
      default:
        setFilteredFriends(friends);
    }
  }, [friendOption]);

  useEffect(() => {
    const online = friends.filter((friend) => friend.status === 'Online' || friend.status === 'DND');
    const offline = friends.filter((friend) => friend.status === 'Offline');
    const pending = friends.filter((friend) => friend.status !== 'Online' && friend.status !== 'Offline' && friend.status !== 'DND');
    setOptions([`All (${friends.length})`, `Online (${online.length})`, `Offline (${offline.length})`, `Pending (${pending.length})`]);
  }, [friends]);

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
        options={options}
      />
      {filteredFriends.map((friend, index) => {
        return friend?.status !== 'Pending' ? (
          <div
            key={index}
            className="friends-container"
            style={{ backgroundColor: selectedFriend?.userId === friend?.userId && 'var(--bg-primary-2)' }}
            onClick={() => friendClick(friend)}>
            <div className="unread-messages">
              <p>12</p>
              <BiEnvelope size={'3em'}></BiEnvelope>
            </div>
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
                object={friend}
              />
            </div>
          </div>
        ) : (
          <div
            key={index}
            className="friends-container">
            <div className="image-container">
              <img
                src={friend.userImage}
                className="user-image"
                alt=""
              />
            </div>
            <p className="friend-name">{friend.username}</p>
            <div className="pending-buttons">
              <div
                className="accept"
                onClick={() => useSocket('user:accept', friend.userId)}>
                <FaCheck
                  color={'inherit'}
                  size={'1.6em'}
                />
              </div>
              <div
                className="decline"
                onClick={() => useSocket('user:decline', friend.userId)}>
                <FaTimes
                  color={'inherit'}
                  size={'1.6em'}
                />
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
