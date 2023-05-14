import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDeafen, toggleMute } from '../../../redux/sounds';
import { BsTelephoneXFill, BsTelephonePlusFill } from 'react-icons/bs';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import ToolTipIcon from '../ToolTip/ToolTipIcon';
import useAuth from '../../../customhooks/useAuth';

const CallWindow = ({ answer, friendImage, callObject }) => {
  const dispatch = useDispatch();
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened, pushToTalk, isTalking } = userSounds;
  const userObject = useSelector((state) => state.user.userObject);
  const { userImage, userId } = userObject;
  const { useApi, useSocket, socket } = useAuth();

  return (
    <>
      <div className="call-container">
        <div className="call-images">
          <div style={{ backgroundColor: isTalking ? 'green' : 'transparent' }}>
            <img
              src={friendImage}
              alt=""></img>
          </div>
          <div style={{ backgroundColor: pushToTalk ? 'green' : 'transparent' }}>
            <img
              src={userImage}
              alt=""></img>
          </div>
        </div>
        <div
          className="call-buttons"
          style={{ color: 'indianRed' }}>
          {`Connected: ${callObject?.isConnected}`}
          {callObject?.isConnected || callObject?.callerId === userId ? (
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
                handler={() => useSocket('user:callDisconnect', callObject?.callId)}
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
                handler={() => useSocket('user:callDecline', callObject?.callId)}
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
