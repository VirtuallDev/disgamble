import React, { useContext, useEffect, useRef, useState } from 'react';
import { BiSend } from 'react-icons/bi';
import SearchInput from '../SearchInput/SearchInput';
import { useSelector } from 'react-redux';
import Options from '../Options/Options';
import { CgPhone } from 'react-icons/cg';
import ToolTipIcon from '../ToolTip/ToolTipIcon';
import CallWindow from './CallWindow';
import { AuthContext } from '../../../App';
import './dm.css';

const DM = ({ friend, call, answer }) => {
  const [searchValue, setSearchValue] = useState('');
  const callsArray = useSelector((state) => state.calls.callsArray);
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;

  const [isCallAvailable, setIsCallAvailable] = useState(
    callsArray.some(
      (call) =>
        (call.author.userId === friend?.userInfo?.userId && call.recipient.userId === userInfo.userId) ||
        (call.author.userId === userInfo.userId && call.recipient.userId === friend?.userInfo?.userId)
    )
  );

  useEffect(() => {
    setIsCallAvailable(
      callsArray.some(
        (call) =>
          (call.author.userId === friend?.userInfo?.userId && call.recipient.userId === userInfo.userId) ||
          (call.author.userId === userInfo.userId && call.recipient.userId === friend?.userInfo?.userId)
      )
    );
  }, [callsArray]);

  return (
    <div className="dm-container">
      <div className="dm-header">
        <img
          className="dm-image"
          src={friend?.userInfo?.image}
          alt=""></img>
        <p className="dm-name">{friend?.userInfo?.username}</p>
        <div style={{ marginLeft: 'auto', marginRight: '0.5em' }}>
          {!isCallAvailable && (
            <ToolTipIcon
              handler={() => call(friend?.userInfo?.userId)}
              tooltip={'Call'}
              direction="bottom"
              icon={
                <CgPhone
                  size={'2em'}
                  color={'white'}></CgPhone>
              }></ToolTipIcon>
          )}
        </div>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          width={'25%'}
          placeholder={'Search'}></SearchInput>
      </div>
      {isCallAvailable && (
        <CallWindow
          answer={() => answer(callsArray.find((call) => call.author.userId === friend?.userInfo?.userId && call.recipient.userId === userInfo.userId).callId)}
          friendImage={friend?.userInfo?.image}
          callObject={callsArray.find((call) => call?.author?.userId === friend?.userInfo?.userId || call?.author?.userId === userInfo.userId)}></CallWindow>
      )}
      <Messages
        isCallAvailable={isCallAvailable}
        friend={friend}
        searchValue={searchValue}></Messages>
      <MessageInput
        width={'100%'}
        placeholder={`Message @${friend?.userInfo?.username}`}
        userId={friend?.userInfo?.userId}></MessageInput>
    </div>
  );
};

export default DM;

const Messages = ({ friend, searchValue, isCallAvailable }) => {
  const { useApi, useSocket, socket } = useContext(AuthContext);
  const editedMessageRef = useRef(null);
  const [editing, setEditing] = useState('');
  const messagesArray = useSelector((state) => state.messages.messagesArray);
  const [filteredDmHistory, setFilteredDmHistory] = useState([]);
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const scrollRef = useRef(null);

  const copyMessage = (messageObject) => {
    navigator.clipboard.writeText(messageObject.message.message);
  };

  const deleteMessage = (messageObject) => {
    useSocket('dm:delete', messageObject.message.id);
  };

  const editMessage = (messageObject) => {
    setEditing(messageObject.message.id);
  };

  const handleEdit = () => {
    useSocket('dm:edit', editedMessageRef.current.id, editedMessageRef.current.textContent);
    setEditing('');
  };

  const buttonsArray = [
    { name: 'COPY', color: 'white', handler: copyMessage },
    { name: 'EDIT', color: 'white', handler: editMessage },
    { name: 'DELETE', color: 'red', handler: deleteMessage },
  ];

  useEffect(() => {
    setFilteredDmHistory(messagesArray.filter((message) => message.recipients.includes(friend?.userInfo?.userId)));
  }, [friend, messagesArray]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [filteredDmHistory]);

  return (
    <div
      className="dm-messages"
      style={{ height: isCallAvailable ? 'calc(100% - 28em)' : 'calc(100% - 8em)' }}>
      {filteredDmHistory
        .filter((messageObject) => messageObject.message.message.toLowerCase().includes(searchValue.toLowerCase()))
        .map((messageObject, index) => {
          return (
            <div
              ref={index === filteredDmHistory.length - 1 ? scrollRef : null}
              className="msg-container"
              key={index}>
              {messageObject.author.userId === userInfo.userId ? (
                <Options
                  currentValue={friend?.userInfo?.userId}
                  buttons={buttonsArray}
                  object={messageObject}
                />
              ) : (
                <Options
                  currentValue={friend?.userInfo?.userId}
                  buttons={[{ name: 'COPY', color: 'white', handler: copyMessage }]}
                  object={messageObject}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="msg-container-img">
                  <img
                    src={messageObject.author.image}
                    alt=""></img>
                </div>
                <div style={{ width: 'calc(100% - 5em)' }}>
                  <div className="msg-container-user-time">
                    <p className="msg-container-username">{messageObject.author.username}</p>
                    <p className="msg-container-time">
                      {new Date(messageObject.message.sentAt).toLocaleString('en-US', {
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {editing !== messageObject.message.id ? (
                    <p className="msg-container-msg">{messageObject.message.message}</p>
                  ) : (
                    <>
                      <div className="edit-container">
                        <p
                          ref={editedMessageRef}
                          className="msg-container-msg"
                          contentEditable={true}
                          dangerouslySetInnerHTML={{ __html: messageObject.message.message }}
                          id={messageObject.message.id}></p>
                        <div className="edit-buttons">
                          <button onClick={handleEdit}>Save</button>
                          <button onClick={() => setEditing('')}>Cancel</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {messageObject.message.isEdited && <p className="isedited">Edited</p>}
            </div>
          );
        })}
    </div>
  );
};

const MessageInput = ({ width, placeholder, userId }) => {
  const [msgValue, setMsgValue] = useState('');
  const { useApi, useSocket, socket } = useContext(AuthContext);

  return (
    <div
      className="msg-input-container"
      style={{ width: width }}>
      <input
        className="msg-input"
        placeholder={placeholder}
        type="text"
        value={msgValue}
        onChange={(e) => setMsgValue(e.target.value)}></input>
      <div
        className="msg-send-button"
        onClick={() => useSocket('dm:message', msgValue, userId)}>
        <BiSend
          size={'3em'}
          color={'inherit'}></BiSend>
      </div>
    </div>
  );
};
