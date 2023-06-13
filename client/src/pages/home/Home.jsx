import React, { useContext, useRef, useState } from 'react';
import ServerList from './Server/ServerList';
import FriendsList from './Friends/FriendList';
import { useSelector } from 'react-redux';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import { BiMessageDetail } from 'react-icons/bi';
import { FaServer } from 'react-icons/fa';
import { IoIosHome } from 'react-icons/io';
import PeerConnection from '../../components/Global/PeerConnection';
import CallStack from '../../components/Global/CallStack/CallStack';
import User from './Friends/User';
import Ads from './Dds/Dds';
import DM from './Friends/DM/DM';
import { AuthContext } from '../../App';
import './home.css';

const Home = () => {
  const serverObject = useSelector((state) => state.server.serverObject);
  const { channels } = serverObject;
  const [current, setCurrent] = useState('home');
  const [isOpen, setIsOpen] = useState(true);
  const [friend, setFriend] = useState({});
  const peerRef = useRef(null);

  return (
    <>
      <PeerConnection ref={peerRef}></PeerConnection>
      <HiMenuAlt2
        style={{ marginRight: '1em' }}
        onClick={() => setIsOpen((current) => !current)}
        className={`menu-button2 ${isOpen ? 'open' : 'closed'}`}
      />
      <HiX
        style={{ marginRight: '303px' }}
        onClick={() => setIsOpen((current) => !current)}
        className={`menu-button2 ${isOpen ? 'closed' : 'open'}`}
      />
      <div className="home-container">
        <div className={`right-side ${!isOpen ? 'right-closed' : 'right-opened'}`}>
          <CallStack answer={(callId) => peerRef.current.acceptOffer(callId)}></CallStack>
          <div className="change-container">
            <div className="change">
              <IoIosHome
                onClick={() => setCurrent('home')}
                size={'3.3em'}
                color={current === 'home' ? 'rgb(100, 100, 100)' : 'inherit'}
              />
            </div>
            <div className="change">
              <BiMessageDetail
                onClick={() => setCurrent('dm')}
                size={'3.2em'}
                color={current === 'dm' ? 'rgb(100, 100, 100)' : 'inherit'}
              />
            </div>
            <div className="change">
              <FaServer
                onClick={() => setCurrent('servers')}
                size={'2.7em'}
                color={current === 'servers' ? 'rgb(100, 100, 100)' : 'inherit'}
              />
            </div>
          </div>
          <AddFriend />
          <FriendsList
            setFriend={setFriend}
            setCurrent={setCurrent}
            selectedFriend={friend}
          />
          <User />
        </div>
        <div className="left-side">
          {current === 'home' && (
            <>
              <Ads />
              <ServerList />
            </>
          )}
          {current === 'dm' && (
            <DM
              isOpen={isOpen}
              friend={friend}
              call={(userId) => peerRef.current.sendOffer(userId)}
              answer={(callId) => peerRef.current.acceptOffer(callId)}
              disconnect={() => peerRef.current.disconnect()}
            />
          )}
          {current === 'servers' && <></>}
        </div>
      </div>
    </>
  );
};

export default Home;

const AddFriend = () => {
  const [username, setUsername] = useState('');
  const { useApi, useSocket, socket } = useContext(AuthContext);

  return (
    <div
      className="add-friend"
      style={{ marginBottom: '0.5em' }}>
      <input
        type="text"
        placeholder="Add a Friend"
        value={username}
        onChange={(e) => setUsername(e.target.value)}></input>
      <button
        className="friend-button"
        onClick={() => useSocket('user:addfriend', username)}>
        Send Friend Request
      </button>
    </div>
  );
};
