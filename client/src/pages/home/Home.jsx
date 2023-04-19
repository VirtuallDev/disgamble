import React, { useEffect, useState } from 'react';
import { ServerList } from '../../components/Home/Server';
import { FriendsList } from '../../components/Home/Friend';
import { Header } from '../../components/Home/Header';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { apiRequest } from '../../../apiHandler';
import { setUserObject } from '../../redux/user';
import { useSelector, useDispatch } from 'react-redux';
import { Ads } from '../../components/Ads';
import { Nav } from '../../components/Nav';

import './home.css';
import { toggleDeafen, toggleMute } from '../../redux/sounds';

const Home = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const { username, userId, userImage, status, bio, friends, friendRequests, blockedUsers, serverList } = userObject;

  const getUserInfo = async () => {
    const userInfo = await apiRequest('getuserinfo');
    if (userInfo.success) dispatch(setUserObject(userInfo.success));
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="home-container">
      <div className="left-side">
        <Ads />
        <Header
          fontSize={'32px'}
          label={'Servers'}
        />
        <div className='serverlist-container'>

          <Nav />
          <ServerList />
        </div>
      </div>
      <div className="right-side">
        <FriendsList />
        <User />
      </div>
    </div>
  );
};

export default Home;

const User = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const { username, userId, userImage, status, bio, friends, friendRequests, blockedUsers, serverList } = userObject;

  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = userSounds;

  const [statusOptions, setStatusOptions] = useState(false);

  const handleStatusChange = async (statusString) => {
    await apiRequest('changestatus', 'POST', {
      statusString: statusString,
    });
  };

  const handleUserSettings = () => {
    console.log('?');
  };

  return (
    <div className="user-container">
      <div className="user-options">
        <div
          className="user-option"
          onClick={() => dispatch(toggleMute())}>
          <p>{isMuted ? 'Unmute' : 'Mute'}</p>
          {isMuted ? (
            <FaMicrophoneSlash
              size={'1.8em'}
              color={'red'}></FaMicrophoneSlash>
          ) : (
            <FaMicrophone
              size={'1.8em'}
              color={'white'}></FaMicrophone>
          )}
        </div>
        <div
          className="user-option"
          onClick={() => dispatch(toggleDeafen())}>
          <p>{isDeafened ? 'Undeafen' : 'Deafen'}</p>
          {isDeafened ? (
            <MdHeadsetOff
              color={'red'}
              size={'1.8em'}></MdHeadsetOff>
          ) : (
            <MdHeadsetMic
              color={'white'}
              size={'1.8em'}></MdHeadsetMic>
          )}
        </div>
        <div
          className="user-option"
          onClick={() => handleUserSettings}>
          <p>User Settings</p>
          <IoMdSettings
            color={'white'}
            size={'1.8em'}></IoMdSettings>
        </div>
      </div>
      <div
        className="status-options"
        style={{ display: statusOptions ? 'flex' : 'none' }}>
        <button
          className="status-option"
          onClick={() => handleStatusChange('Online')}>
          <div className="status-icon"></div>Online
        </button>
        <button
          className="status-option"
          onClick={() => handleStatusChange('DND')}>
          <div className="status-icon dnd"></div>Do Not Disturb
        </button>
        <button
          className="status-option"
          onClick={() => handleStatusChange('Invisible')}>
          <div className="status-icon invisible"></div>Invisible
        </button>
      </div>
      <div
        className="user-image-container"
        onClick={() => setStatusOptions((status) => !status)}>
        <img
          src={userImage}
          className="user-image"
          alt=""
        />
        <div
          className="status"
          style={{ backgroundColor: status === 'Online' ? 'green' : status === 'DND' ? 'red' : 'gray' }}></div>
      </div>
    </div>
  );
};
