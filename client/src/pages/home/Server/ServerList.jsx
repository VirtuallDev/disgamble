import React, { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoMdExpand } from 'react-icons/io';
import { AuthContext } from '../../../App';
import ToolTipIcon from '../../../components/Global/ToolTip/ToolTipIcon';
import ServerModal from './ServerModal';
import CreateServerModal from './CreateServerModal';
import SearchInput from '../../../components/Global/SearchInput/SearchInput';
import './serverlist.css';

const ServerList = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends, serverList } = userObject;
  const { useApi, useSocket, socket } = useContext(AuthContext);

  const [selectedModalServer, setSelectedModalServer] = useState(null);
  const [showServerModal, setShowServerModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedServer, setSelectedServer] = useState({});
  const [showCreateServer, setShowCreateServer] = useState(false);

  const handleServerClick = (serverObject) => {
    setSelectedServer(serverObject);
  };

  const handleExpandClick = (serverObject) => {
    setSelectedModalServer(serverObject);
    setShowServerModal(true);
  };

  return (
    <>
      <CreateServerModal
        showCreateServer={showCreateServer}
        setShowCreateServer={setShowCreateServer}></CreateServerModal>
      <ServerModal
        showServerModal={showServerModal}
        setShowServerModal={setShowServerModal}
        serverObject={selectedModalServer}
      />
      <div className="server-list">
        <div className="server-button-container">
          <button
            onClick={() => setShowCreateServer(true)}
            className="server-button">
            Create Server
          </button>
          <button
            className="server-button"
            onClick={() => useSocket('server:connect', selectedModalServer)}>
            Connect
          </button>
        </div>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          width={'100%'}
          placeholder={'Search a server!'}></SearchInput>
        <div style={{ marginBottom: '0.5em' }}></div>
        <div style={{ overflow: 'auto', overflowX: 'hidden' }}>
          {serverList
            .filter((serverObject) => serverObject?.server?.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map((serverObject, index) => {
              return (
                <div
                  key={index}
                  className="server-container"
                  style={{
                    backgroundColor: selectedServer?.server?.id === serverObject.server.id && 'var(--bg-primary-9)',
                  }}
                  onClick={() => handleServerClick(serverObject)}>
                  <img
                    src={serverObject.server.image}
                    className="server-image"
                    alt=""
                  />
                  <p className="server-name">{serverObject.server.name}</p>
                  <div style={{ marginLeft: 'auto' }}>
                    <ToolTipIcon
                      handler={() => handleExpandClick(serverObject)}
                      tooltip={'Expand'}
                      direction="left"
                      icon={
                        <IoMdExpand
                          size={'1.8em'}
                          color={'var(--dark3)'}></IoMdExpand>
                      }></ToolTipIcon>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ServerList;
