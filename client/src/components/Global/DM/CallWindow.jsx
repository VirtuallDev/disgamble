import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDeafen, toggleMute } from '../../../redux/sounds';
import { BsTelephoneXFill, BsTelephonePlusFill } from 'react-icons/bs';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import ToolTipIcon from '../ToolTip/ToolTipIcon';
import useAuth from '../../../customhooks/useAuth';

const CallWindow = ({ answer, disconnect, friendImage, isConnected }) => {
  const dispatch = useDispatch();
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened } = userSounds;
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage } = userObject;
  const { useApi, useSocket, socket } = useAuth();

  return (
    <>
      <div className="call-container">
        <div className="call-images">
          <img
            src={friendImage}
            alt=""></img>
          <img
            src={userImage}
            alt=""></img>
        </div>
        <div className="call-buttons">
          {isConnected ? (
            <>
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
                handler={() => disconnect()}
                tooltip={'Disconnect'}
                direction="top"
                icon={
                  <BsTelephoneXFill
                    size={'1.6em'}
                    color={'indianRed'}></BsTelephoneXFill>
                }></ToolTipIcon>
            </>
          ) : (
            <>
              <ToolTipIcon
                handler={() => console.log('declined')}
                tooltip={'Decline'}
                direction="top"
                icon={
                  <BsTelephoneXFill
                    size={'1.6em'}
                    color={'indianRed'}></BsTelephoneXFill>
                }></ToolTipIcon>
              <ToolTipIcon
                handler={() => answer()}
                tooltip={'Answer'}
                direction="top"
                icon={
                  <BsTelephonePlusFill
                    size={'1.6em'}
                    color={'green'}></BsTelephonePlusFill>
                }></ToolTipIcon>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CallWindow;
