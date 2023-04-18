import React, { useEffect, useState } from 'react';
import './home.css';
import { ServerList } from '../../components/Home/Server';
import { FriendsList } from '../../components/Home/Friend';
import { Header } from '../../components/Home/Header';
import { Divider } from '../../components/Home/Divider';
import { FaMicrophone } from 'react-icons/fa';
import { MdHeadsetMic } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { apiRequest } from '../../../apiHandler';

const Home = () => {
  useEffect(() => {
    const getUserInfo = async () => {
      const userinfo = await apiRequest('getuserinfo');
      console.log(userinfo);
    };
    getUserInfo();
  }, []);

  return (
    <div className="home-container">
      <div className="left-side">
        <div className="ads">ADS</div>
        <ServerList />
        <div className="nav">NAV</div>
      </div>
      <div className="right-side">
        <FriendsList />
        <UserShelf />
      </div>
    </div>
  );
};

export default Home;

const UserShelf = () => {
  const [statusOptions, setStatusOptions] = useState(false);

  const handleStatusChange = (status) => {
    console.log('socket or http request', status);
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
            size={'1.5em'}
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
          src="https://scontent.ftlv1-1.fna.fbcdn.net/v/t1.6435-9/185533119_4148921461842219_3844749577676356191_n.png?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=MCl_UNz1aNgAX8BH_so&_nc_ht=scontent.ftlv1-1.fna&oh=00_AfD5BwjMdZV87QbtCEehU5TRsVUnEJKEY72qQ1isFLh9uQ&oe=6465C39F"
          className="user-image"
          alt=""
        />
        <div className="status"></div>
      </div>
    </div>
  );
};
