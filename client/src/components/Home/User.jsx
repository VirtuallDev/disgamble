import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDeafen, toggleMute } from '../../redux/sounds';
import { apiRequest } from '../../apiHandler';
import './user.css';

const User = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const { username, userId, userImage, status, bio, friends, friendRequests, blockedUsers, serverList } = userObject;

  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = userSounds;
  const [statusOptions, setStatusOptions] = useState(false);

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
      <div className="user-container-username">
        <p>{username}</p>
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
      <StatusOptions
        statusOptions={statusOptions}
        setStatusOptions={setStatusOptions}></StatusOptions>
    </div>
  );
};

export default User;

const StatusOptions = ({ statusOptions, setStatusOptions }) => {
  const statusOptionsRef = useRef(null);

  const handleStatusChange = async (statusString) => {
    await apiRequest('changestatus', 'POST', {
      statusString: statusString,
    });
    setStatusOptions(false);
  };

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (statusOptionsRef.current && !statusOptionsRef.current.contains(e.target)) {
        setStatusOptions(false);
      }
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div
      ref={statusOptionsRef}
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
  );
};
