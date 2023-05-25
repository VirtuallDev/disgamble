import React, { useContext } from 'react';
import { BsTelephonePlusFill, BsTelephoneXFill } from 'react-icons/bs';
import ToolTipIcon from '../ToolTip/ToolTipIcon';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../../App';
import './callstack.css';

const CallStack = ({ answer }) => {
  const callsArray = useSelector((state) => state.calls.callsArray);
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const { useApi, useSocket, socket } = useContext(AuthContext);

  return (
    <>
      <div className="call-stack-container">
        {callsArray
          .filter((call) => call.author.userId !== userInfo.userId && call.isConnected === false)
          .map((call, index) => {
            return (
              <div
                className="call-noti"
                key={index}>
                <div className="call-noti-user-info">
                  <img
                    className="call-noti-image"
                    src={friends.friends.find((friend) => friend?.userInfo?.userId === call.author.userId)?.userInfo?.image}
                    alt=""></img>
                  <p className="caller-name">{friends.friends.find((friend) => friend?.userInfo?.userId === call.author.userId)?.userInfo?.username}</p>
                </div>
                <div className="call-noti-buttons">
                  <ToolTipIcon
                    handler={() => useSocket('user:callDecline', call.callId)}
                    tooltip={'Decline'}
                    direction="top"
                    icon={
                      <BsTelephoneXFill
                        size={'1.4em'}
                        color={'indianRed'}></BsTelephoneXFill>
                    }></ToolTipIcon>
                  <ToolTipIcon
                    handler={() => answer(call.callId)}
                    tooltip={'Answer'}
                    direction="top"
                    icon={
                      <BsTelephonePlusFill
                        size={'1.4em'}
                        color={'green'}></BsTelephonePlusFill>
                    }></ToolTipIcon>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};
export default CallStack;
