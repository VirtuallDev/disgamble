import React, { useEffect, useState } from 'react';
import { ServerList } from '../../components/Home/Server';
import { FriendsList } from '../../components/Home/Friend';
import { Header } from '../../components/Home/Header';
import { Divider } from '../../components/Home/Divider';
import { FaMicrophone } from 'react-icons/fa';
import { MdHeadsetMic } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { apiRequest } from '../../../apiHandler';
import { setUserObject } from '../../redux/user';
import { useSelector, useDispatch } from 'react-redux';
import './home.css';
import { Ads } from '../../components/Ads';

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
        <div className="ads">
          <Ads />
        </div>
        <ServerList />
        <div className="nav">NAV</div>
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
  const userObject = useSelector((state) => state.user.userObject);
  const { username, userId, userImage, status, bio, friends, friendRequests, blockedUsers, serverList } = userObject;

  const [statusOptions, setStatusOptions] = useState(false);

  const handleStatusChange = async (statusString) => {
    await apiRequest('changestatus', 'POST', {
      statusString: statusString,
    });
  };

  const handleMute = () => {
    console.log('redux?');
  };
  const handleDeafen = () => {
    console.log('redux?');
  };
  const handleUserSettings = () => {
    console.log('?');
  };

  return (
    <div className="user-container">
      <div className="user-options">
        <div
          className="user-option"
          onClick={() => handleMute}>
          <p>Mute</p>
          <FaMicrophone
            size={'1.8em'}
            color={'#0cae7d'}></FaMicrophone>
        </div>
        <div
          className="user-option"
          onClick={() => handleDeafen}>
          <p>Deafen</p>
          <MdHeadsetMic
            color={'#0cae7d'}
            size={'1.8em'}></MdHeadsetMic>
        </div>
        <div
          className="user-option"
          onClick={() => handleUserSettings}>
          <p>User Settings</p>
          <IoMdSettings
            color={'#0cae7d'}
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
