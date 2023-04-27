import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiDotsVertical } from 'react-icons/hi';
import { apiRequest } from '../../apiHandler';
import './dm.css';

const DM = ({ userId }) => {
  const [msgValue, setMsgValue] = useState('');
  const [dmhistory, setDmHistory] = useState([1, 1, 1, 1, 1, 2]);

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
          src=""
          alt=""></img>
        <p className="dm-name">User Name</p>
      </div>
      <div className="dm-messages">
        {dmhistory.map((message) => {
          return (
            <div className="msg-container">
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
        <MessageInput
          msgValue={msgValue}
          setMsgValue={setMsgValue}
          width={'100%'}
          placeholder={'Message'}></MessageInput>
      </div>
    </div>
  );
};

export default DM;

const MessageInput = ({ msgValue, setMsgValue, width, placeholder }) => {
  return (
    <div
      className="search-container"
      style={{ width: width }}>
      <input
        className="search"
        placeholder={placeholder}
        type="text"
        value={msgValue}
        onChange={(e) => setMsgValue(e.target.value)}></input>
      <FaSearch
        style={{ position: 'absolute', right: '1em' }}
        size={'1.8em'}
        color={'rgb(139, 139, 139)'}></FaSearch>
    </div>
  );
};
