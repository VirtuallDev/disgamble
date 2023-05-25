import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { ServerModal } from '../../components/Modal/ServerModal';
import { IoMdExpand } from 'react-icons/io';
import SearchInput from '../../components/Global/SearchInput/SearchInput';
import { AuthContext } from '../../App';
import './serverlist.css';

const ServerList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const { useApi, useSocket, socket } = useContext(AuthContext);

  const [currentServer, setCurrentServer] = useState('');
  const [showServerModal, setShowServerModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedServer, setSelectedServer] = useState('');

  const handleServerClick = (id) => {
    setSelectedServer(id);
  };

  const handleExpandClick = (id) => {
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
          <button
            className="server-button"
            onClick={() => useSocket('server:connect', currentServer)}>
            Connect
          </button>
        </div>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          width={'100%'}
          placeholder={'Search a server!'}></SearchInput>
        <div style={{ marginBottom: '0.5em' }}></div>
        {[]
          .filter((item) => item?.servername?.toLowerCase().includes(searchValue.toLowerCase()))
          .map((server, index) => {
            return (
              <div
                key={index}
                className="server-container"
                style={{ backgroundColor: selectedServer === server?.serverId ? 'var(--bg-primary-5)' : 'initial' }}
                onClick={() => handleServerClick(server?.serverId)}>
                <div className="server">
                  <img
                    src={server?.serverImage}
                    className="server-image"
                    alt=""
                  />
                  <p className="server-name">{server?.servername}</p>
                  <IoMdExpand
                    onClick={() => handleExpandClick(server?.serverId)}
                    className="server-expand"
                    size={'1.8em'}></IoMdExpand>
                </div>
                <div className="breakline"></div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ServerList;
