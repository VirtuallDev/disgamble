import React, { useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDeafen, toggleMute } from '../../redux/sounds';
import useAuth from '../../customhooks/useAuth';
import ToolTipIcon from '../../components/Global/ToolTip/ToolTipIcon';
import './user.css';
import { Settings } from '../../components/Modal/Settings';
const API_URL = 'https://doriman.yachts:5001';

const User = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const { username, userId, userImage, status, about, friends, friendRequests, blockedUsers, serverList } = userObject;
  const buttonRef = useRef(null);
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = userSounds;
  const [statusOptions, setStatusOptions] = useState(false);

  const handleUserSettings = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  };

  return (
    <div className="user-container">
      <Settings></Settings>
      <div className="user-options">
        <ToolTipIcon
          handler={() => dispatch(toggleMute())}
          tooltip={isMuted ? 'Unmute' : 'Mute'}
          icon={
            isMuted ? (
              <FaMicrophoneSlash
                size={'1.8em'}
                color={'red'}></FaMicrophoneSlash>
            ) : (
              <FaMicrophone
                size={'1.8em'}
                color={'white'}></FaMicrophone>
            )
          }></ToolTipIcon>
        <ToolTipIcon
          handler={() => dispatch(toggleDeafen())}
          tooltip={isDeafened ? 'Undeafen' : 'Deafen'}
          icon={
            isDeafened ? (
              <MdHeadsetOff
                color={'red'}
                size={'1.8em'}></MdHeadsetOff>
            ) : (
              <MdHeadsetMic
                color={'white'}
                size={'1.8em'}></MdHeadsetMic>
            )
          }></ToolTipIcon>
        <ToolTipIcon
          handler={() => handleUserSettings()}
          tooltip={'User Settings'}
          icon={
            <IoMdSettings
              color={'white'}
              size={'1.8em'}></IoMdSettings>
          }></ToolTipIcon>
      </div>
      <div
        className="user-wrapper"
        ref={buttonRef}
        style={{ backgroundColor: statusOptions && 'var(--bg-primary-3)' }}
        onClick={() => {
          setStatusOptions((status) => !status);
        }}>
        <div className="user-container-username">
          <p>{username}</p>
        </div>
        <div className="user-image-container">
          <img
            src={userImage || 'https://html.com/wp-content/uploads/flamingo-fallback.jpg'}
            className="user-image"
            alt=""
          />
          <div
            className="status"
            style={{ backgroundColor: status === 'Online' ? 'green' : status === 'DND' ? 'red' : 'gray' }}></div>
        </div>
      </div>
      <StatusOptions
        statusOptions={statusOptions}
        setStatusOptions={setStatusOptions}
        buttonRef={buttonRef}></StatusOptions>
    </div>
  );
};

export default User;

const StatusOptions = ({ statusOptions, setStatusOptions, buttonRef }) => {
  const statusOptionsRef = useRef(null);
  const { useApi, useSocket, socket } = useAuth();

  const handleStatusChange = async (statusString) => {
    useSocket('user:changestatus', statusString);
    setStatusOptions(false);
  };

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (statusOptionsRef.current && !statusOptionsRef.current.contains(e.target) && buttonRef.current && !buttonRef.current.contains(e.target)) setStatusOptions(false);
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div
      ref={statusOptionsRef}
      className={`status-options ${statusOptions ? 'show' : 'hide'}`}>
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
