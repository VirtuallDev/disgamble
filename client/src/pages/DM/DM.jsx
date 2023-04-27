import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { BiSend } from 'react-icons/bi';
import SearchInput from '../../components/Global/SearchInput';
import { apiRequest } from '../../apiHandler';
import './dm.css';

const DM = ({ userId }) => {
  const [msgValue, setMsgValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [dmhistory, setDmHistory] = useState([1, 1, 2, 2, 2, 2, , 22, 2, 2, 1, 1, 1, 2]);

  useEffect(() => {
    const fetchHistory = async () => {
      const dmHistory = await apiRequest(`/dmhistory/${userId}`);
      if (dmHistory.success) setDmHistory(dmhistory);
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="dm-container">
      <div className="dm-header">
        <img
          className="dm-image"
          src={'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg'}
          alt=""></img>
        <p className="dm-name">User Name</p>
        <SearchInput
          msgValue={searchValue}
          setMsgValue={setSearchValue}
          width={'25%'}
          placeholder={'Search'}></SearchInput>
      </div>
      <div className="dm-messages">
        {dmhistory.map((message, index) => {
          return (
            <div
              className="msg-container"
              key={index}>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="msg-container-img">
                  <img
                    src={'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?cs=srgb&dl=pexels-pixabay-268533.jpg&fm=jpg'}
                    alt=""></img>
                </div>
                <div>
                  <div className="msg-container-user-time">
                    <p className="msg-container-username">User</p>
                    <p className="msg-container-time">{new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    <HiDotsVertical
                      style={{ marginLeft: 'auto' }}
                      size={'1.5em'}
                      color={'rgb(0, 0, 0)'}></HiDotsVertical>
                  </div>
                  <p className="msg-container-msg">
                    MessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessage
                    MessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessage
                    MessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessageMessage
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput
        msgValue={msgValue}
        setMsgValue={setMsgValue}
        width={'100%'}
        placeholder={'Message'}></MessageInput>
    </div>
  );
};

export default DM;

const MessageInput = ({ msgValue, setMsgValue, width, placeholder }) => {
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
      <div className="msg-send-button">
        <BiSend
          size={'3em'}
          color={'inherit'}></BiSend>
      </div>
    </div>
  );
};
