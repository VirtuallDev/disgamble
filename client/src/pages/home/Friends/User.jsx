import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDeafen, toggleMute } from '../../../redux/sounds';
import ToolTipIcon from '../../../components/Global/ToolTip/ToolTipIcon';
import Settings from '../../../components/Settings/Settings';
import { AuthContext } from '../../../App';
import './user.css';

const User = () => {
  const dispatch = useDispatch();
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const buttonRef = useRef(null);
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = userSounds;
  const [statusOptions, setStatusOptions] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <div className="user-container">
      <Settings
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}></Settings>
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
          handler={() => setShowSettingsModal(true)}
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
        style={{ backgroundColor: statusOptions && 'var(--bg-primary-8)' }}
        onClick={() => {
          setStatusOptions((status) => !status);
        }}>
        <div className="user-container-username">
          <p>{userInfo.username}</p>
        </div>
        <div className="user-image-container">
          <img
            src={userInfo.image}
            className="user-image"
            alt=""
          />
          <div
            className="status"
            style={{ backgroundColor: userInfo.status === 'Online' ? 'green' : userInfo.status === 'DND' ? 'red' : 'gray' }}></div>
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
  const { useApi, useSocket, socket } = useContext(AuthContext);

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
