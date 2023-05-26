import React, { useRef, useState } from 'react';
import ServerList from './Server/ServerList';
import FriendsList from './Friends/FriendList';
import { useSelector } from 'react-redux';
import { HiHome } from 'react-icons/hi';
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
  const [friend, setFriend] = useState({});
  const peerRef = useRef(null);

  return (
    <>
      <PeerConnection ref={peerRef}></PeerConnection>
      <div className="home-container">
        <div className="right-side">
          <CallStack answer={(callId) => peerRef.current.acceptOffer(callId)}></CallStack>
          <div className="change-container">
            <HiHome
              style={{ transform: current ? 'rotate3d(1, 0, 1, 360deg)' : 'rotate3d(1, 0, 1, 0deg)' }}
              onClick={() => setCurrent((current) => !current)}
              className="change"
              size={'5em'}
              color={'inherit'}></HiHome>
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
