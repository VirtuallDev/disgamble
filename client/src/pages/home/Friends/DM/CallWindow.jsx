import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsTelephoneXFill, BsTelephonePlusFill } from 'react-icons/bs';
import { MdHeadsetMic, MdHeadsetOff } from 'react-icons/md';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { AuthContext } from '../../../../App';
import { toggleDeafen, toggleMute } from '../../../../redux/sounds';
import ToolTipIcon from '../../../../components/Global/ToolTip/ToolTipIcon';

const CallWindow = ({ answer, friendImage, callObject }) => {
  const dispatch = useDispatch();
  const userSounds = useSelector((state) => state.sounds.soundObject);
  const { isMuted, isDeafened, pushToTalk, isTalking } = userSounds;
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const { useApi, useSocket, socket } = useContext(AuthContext);

  return (
    <>
      {callObject && (
        <div className="call-container">
          <div className="call-images">
            <div
              className={`call-image ${callObject.author.userId === userInfo.userId && !callObject.isConnected ? 'not-connected' : ''}`}
              style={{ backgroundColor: isTalking && !isDeafened ? 'green' : 'transparent' }}>
              <img
                src={friendImage}
                alt=""
              />
            </div>
            <div
              className={`call-image ${callObject.author.userId !== userInfo.userId && !callObject.isConnected ? 'not-connected' : ''}`}
              style={{ backgroundColor: pushToTalk && !isMuted && !isDeafened ? 'green' : 'transparent' }}>
              <img
                src={userInfo.image}
                alt=""
              />
            </div>
          </div>
          <div
            className="call-buttons"
            style={{ color: 'indianRed' }}>
            {`Connected: ${callObject.isConnected}`}
            {callObject.isConnected || callObject.author.userId === userInfo.userId ? (
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
                  handler={() => useSocket('user:callDisconnect', callObject.callId)}
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
                  handler={() => useSocket('user:callDecline', callObject.callId)}
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
      )}
    </>
  );
};

export default CallWindow;