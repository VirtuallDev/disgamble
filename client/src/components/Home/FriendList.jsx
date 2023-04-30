import React, { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { useSelector } from 'react-redux';
import { socketRequest } from '../../apiHandler';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';

import './Friend.css';

const FriendsList = ({ setFriend, setCurrent, selectedFriend }) => {
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
                style={{ backgroundColor: selectedFriend?.userId === friend?.userId && 'var(--bg-primary-8)' }}
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
  const [isOpen, setIsOpen] = useState(false);
  const options = ['All', 'Online', 'Offline', 'Pending'];
  const filterOptionsRef = useRef(null);

  const handleFilterClick = (option) => {
    setFriendOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (filterOptionsRef.current && !filterOptionsRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <>
      <div
        className="friend-options-container"
        ref={filterOptionsRef}>
        <button
          className="filter-button"
          onClick={() => setIsOpen((prev) => !prev)}>
          Filter
          <RiArrowDropDownLine
            className="filter-svg"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            color={'inherit'}
            size={'2.8em'}></RiArrowDropDownLine>
        </button>
        <div
          className="friend-options"
          style={{ display: isOpen ? 'flex' : 'none' }}>
          {options.map((option, index) => {
            return (
              <button
                key={index}
                onClick={() => handleFilterClick(option)}
                className="friend-option"
                style={{ backgroundColor: friendOption === option ? 'var(--bg-primary-3)' : '' }}>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

const AddFriend = () => {
  const [username, setUsername] = useState('');

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
        onClick={() => socketRequest('user:addfriend', username)}>
        Add Friend
      </button>
    </div>
  );
};
