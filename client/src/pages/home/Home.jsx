import React, { useRef, useState } from 'react';
import ServerList from './Server/ServerList';
import FriendsList from './Friends/FriendList';
import { useSelector } from 'react-redux';
import { HiMenuAlt2, HiX } from 'react-icons/hi';
import { TbExchange } from 'react-icons/tb';
import PeerConnection from '../../components/Global/PeerConnection';
import CallStack from '../../components/Global/CallStack/CallStack';
import User from './Friends/User';
import Ads from './Dds/Dds';
import DM from './Friends/DM/DM';
import './home.css';

const Home = () => {
  const serverObject = useSelector((state) => state.server.serverObject);
  const { channels } = serverObject;
  const [current, setCurrent] = useState(true);
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
        style={{ marginRight: '300px' }}
        onClick={() => setIsOpen((current) => !current)}
        className={`menu-button2 ${isOpen ? 'closed' : 'open'}`}
      />
      <div className="home-container">
        <div className={`right-side ${!isOpen ? 'right-closed' : 'right-opened'}`}>
          <CallStack answer={(callId) => peerRef.current.acceptOffer(callId)}></CallStack>
          <div className="change-container">
            <TbExchange
              style={{ transform: current ? 'rotate3d(1, 0, 1, 360deg)' : 'rotate3d(1, 0, 1, 0deg)' }}
              onClick={() => setCurrent((current) => !current)}
              className="change"
              size={'4.5em'}
              color={'inherit'}></TbExchange>
          </div>
          <FriendsList
            setFriend={setFriend}
            setCurrent={setCurrent}
            selectedFriend={friend}
          />
          <User />
        </div>
        <div className="left-side">
          {current ? (
            <>
              <Ads />
              <ServerList />
            </>
          ) : (
            <DM
              friend={friend}
              call={(userId) => peerRef.current.sendOffer(userId)}
              answer={(callId) => peerRef.current.acceptOffer(callId)}
              disconnect={() => peerRef.current.disconnect()}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
