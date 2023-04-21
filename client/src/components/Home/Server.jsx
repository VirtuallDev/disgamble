import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Server.css';
import { ServerModal } from '../Modal/ServerModal';
import { FaSearch } from 'react-icons/fa';
import SearchInput from '../Global/SearchInput';

export const ServerList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { serverList } = userObject;

  const [currentServer, setCurrentServer] = useState('');
  const [showServerModal, setShowServerModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleServerClick = (id) => {
    setCurrentServer(id);
    setShowServerModal(true);
  };

  return (
    <>
      {showServerModal && (
        <ServerModal
          showServerModal={showServerModal}
          setShowServerModal={setShowServerModal}
          serverId={currentServer}
        />
      )}
      <div className="server-list">
        <div className="server-button-container">
          <button className="server-button">Create Server</button>
          <button className="server-button">Add</button>
          <button className="server-button">Remove</button>
          <button className="server-button"> Connect</button>
        </div>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          width={'100%'}
          placeholder={'Search a server!'}></SearchInput>
        <div style={{ marginBottom: '0.5em' }}></div>
        {serverList
          .filter((item) => item?.servername?.toLowerCase().includes(searchValue.toLowerCase()))
          .map((server, index) => {
            return (
              <div
                key={index}
                className="server-container"
                onClick={() => handleServerClick(server?.serverId)}>
                <div className="server">
                  <img
                    src={server?.serverImage}
                    className="server-image"
                    alt=""
                  />
                  <p className="server-name">{server?.servername}</p>
                  <p className="server-clients">{server?.usersOnline?.length}</p>
                </div>
                <div className="breakline"></div>
              </div>
            );
          })}
      </div>
    </>
  );
};
