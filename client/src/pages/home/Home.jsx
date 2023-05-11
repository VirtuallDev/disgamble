import React, { useEffect, useRef, useState } from 'react';
import ServerList from './ServerList';
import FriendsList from './FriendList';
import Header from '../../components/Global/Header/Header';
import Ads from '../../components/Global/Dds/Dds';
import User from './User';
import DM from '../../components/Global/DM/DM';
import { setServerObject } from '../../redux/server';
import { useDispatch, useSelector } from 'react-redux';
import { FaExchangeAlt } from 'react-icons/fa';
import useAuth from '../../customhooks/useAuth';
import PeerConnection from '../../components/Global/PeerConnection';
import { addCall, updateCall, deleteCall } from '../../redux/calls';
import './home.css';

const Home = () => {
  const dispatch = useDispatch();
  const serverObject = useSelector((state) => state.server.serverObject);
  const { servername, serverId, serverImage, serverAddress, usersOnline, description, dateCreated, channels } = serverObject;
  const [current, setCurrent] = useState(true);
  const [friend, setFriend] = useState({});
  const { useApi, useSocket, socket } = useAuth();
  const peerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    socket.on('server:connected', (server) => {
      dispatch(setServerObject(server));
    });
    socket.on('user:call', (callObject) => {
      dispatch(addCall(callObject));
    });
    socket.on('user:updateCall', (callObject) => {
      dispatch(updateCall(callObject));
    });
    socket.on('user:deleteCall', (callId) => {
      console.log('deleting', callId);
      dispatch(deleteCall(callId));
    });
    return () => {
      socket.off('server:connected');
      socket.off('user:call');
      socket.off('user:updateCall');
      socket.off('user:deleteCall');
    };
  }, [socket]);

  return (
    <>
      <PeerConnection ref={peerRef}></PeerConnection>
      <div className="home-container">
        <div className="right-side">
          <div className="change-container">
            <FaExchangeAlt
              style={{ transform: current ? 'rotate3d(1, 0, 1, 360deg)' : 'rotate3d(1, 0, 1, 0deg)' }}
              onClick={() => setCurrent((current) => !current)}
              className="change"
              size={'5em'}
              color={'inherit'}></FaExchangeAlt>
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
              <div className="serverlist-container">
                <Header
                  fontSize={'32px'}
                  label={'Servers'}
                />
                <ServerList />
              </div>
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
