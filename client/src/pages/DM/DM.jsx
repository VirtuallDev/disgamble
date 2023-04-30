import React, { useEffect, useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { BiSend } from 'react-icons/bi';
import SearchInput from '../../components/Global/SearchInput';
import { socketRequest } from '../../apiHandler';
import { useSelector } from 'react-redux';
import './dm.css';

const DM = ({ friend }) => {
  const messagesArray = useSelector((state) => state.messages.messagesArray);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDmHistory, setFilteredDmHistory] = useState([]);

  useEffect(() => {
    setFilteredDmHistory(messagesArray.filter((message) => message.recipients.includes(friend?.userId)));
  }, [friend, messagesArray]);

  return (
    <div className="dm-container">
      <div className="dm-header">
        <img
          className="dm-image"
          src={friend?.userImage}
          alt=""></img>
        <p className="dm-name">{friend?.username}</p>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          width={'25%'}
          placeholder={'Search'}></SearchInput>
      </div>
      <div className="dm-messages">
        {filteredDmHistory
          .filter((message) => message?.message?.toLowerCase().includes(searchValue.toLowerCase()))
          .map((message, index) => {
            return (
              <div
                className="msg-container"
                key={index}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div className="msg-container-img">
                    <img
                      src={message?.authorImage}
                      alt=""></img>
                  </div>
                  <div style={{ width: '100%' }}>
                    <div className="msg-container-user-time">
                      <p className="msg-container-username">{message?.authorName}</p>
                      <p className="msg-container-time">
                        {new Date(message?.sentAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}
                      </p>
                      <MsgOptions message={message}></MsgOptions>
                    </div>
                    <p className="msg-container-msg">{message?.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <MessageInput
        width={'100%'}
        placeholder={`Message @${friend?.username}`}
        userId={friend?.userId}></MessageInput>
    </div>
  );
};

export default DM;

const MessageInput = ({ width, placeholder, userId }) => {
  const [msgValue, setMsgValue] = useState('');

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
        onClick={() => socketRequest('dm:message', msgValue, userId)}>
        <BiSend
          size={'3em'}
          color={'inherit'}></BiSend>
      </div>
    </div>
  );
};

const MsgOptions = ({ message }) => {
  const [msgOptions, setMsgOptions] = useState('');
  const msgOptionsRef = useRef(null);

  const copyMessage = (messageId) => {
    console.log(messageId);
    setMsgOptions('');
  };

  const editMessage = (messageId) => {
    socketRequest('dm:edit', messageId);
    setMsgOptions('');
  };

  const deleteMessage = (messageId) => {
    socketRequest('dm:delete', messageId);
    setMsgOptions('');
  };

  useEffect(() => {
    window.addEventListener('mousedown', (e) => {
      if (msgOptionsRef.current && !msgOptionsRef.current.contains(e.target)) {
        setMsgOptions('');
      }
    });
    return () => {
      window.removeEventListener('mousedown', (e) => {
        if (msgOptionsRef.current && !msgOptionsRef.current.contains(e.target)) {
          setMsgOptions('');
        }
      });
    };
  }, []);
  return (
    <div className="msg-options">
      <div
        ref={msgOptionsRef}
        className="msg-options-container"
        style={{ display: msgOptions === message?.messageId ? 'initial' : 'none' }}>
        <button onClick={() => copyMessage(message?.messageId)}>COPY</button>
        <button onClick={() => editMessage(message?.messageId)}>EDIT</button>
        <button
          onClick={() => deleteMessage(message?.messageId)}
          style={{ color: 'indianRed' }}>
          DELETE
        </button>
      </div>
      <HiDotsVertical
        onClick={() => setMsgOptions(message?.messageId)}
        size={'1.5em'}
        color={'var(--gray-2)'}></HiDotsVertical>
    </div>
  );
};
