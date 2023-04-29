import React, { useEffect, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { BiSend } from 'react-icons/bi';
import SearchInput from '../../components/Global/SearchInput';
import { useParams } from 'react-router-dom';
import { apiRequest, socketRequest } from '../../apiHandler';
import './dm.css';

const DM = () => {
  const [msgValue, setMsgValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [dmhistory, setDmHistory] = useState({});
  const { id: userId } = useParams();

  useEffect(() => {
    const fetchHistory = async () => {
      const jsonResponse = await apiRequest(`/dmhistory/${userId}`);
      if (jsonResponse.success) setDmHistory(jsonResponse.success);
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="dm-container">
      <div className="dm-header">
        <img
          className="dm-image"
          src={dmhistory?.receipentImage}
          alt=""></img>
        <p className="dm-name">{dmhistory?.receipentName}</p>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          width={'25%'}
          placeholder={'Search'}></SearchInput>
      </div>
      <div className="dm-messages">
        {dmhistory?.messages
          ?.filter((message) => message?.message?.toLowerCase().includes(searchValue.toLowerCase()))
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
                      <div className="msg-options">
                        <HiDotsVertical
                          size={'1.5em'}
                          color={'var(--gray-2)'}></HiDotsVertical>
                      </div>
                    </div>
                    <p className="msg-container-msg">{message?.message}</p>
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
        placeholder={`Message @${dmhistory?.receipentName}`}
        userId={userId}></MessageInput>
    </div>
  );
};

export default DM;

const MessageInput = ({ msgValue, setMsgValue, width, placeholder, userId }) => {
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
