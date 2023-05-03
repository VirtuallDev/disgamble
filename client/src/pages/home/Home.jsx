import React, { useEffect, useState } from 'react';
import ServerList from './ServerList';
import FriendsList from './FriendList';
import Header from '../../components/Global/Header/Header';
import Ads from '../../components/Global/Ads/Ads';
import User from './User';
import DM from '../../components/Global/DM/DM';
import { setServerObject } from '../../redux/server';
import { useDispatch, useSelector } from 'react-redux';
import { FaExchangeAlt } from 'react-icons/fa';
import useAuth from '../../customhooks/useAuth';
import './home.css';

const Home = () => {
  const dispatch = useDispatch();
  const serverObject = useSelector((state) => state.server.serverObject);
  const { servername, serverId, serverImage, serverAddress, usersOnline, description, dateCreated, channels } = serverObject;
  const [current, setCurrent] = useState(true);
  const [friend, setFriend] = useState({});
  const { useApi, useSocket, socket } = useAuth();

  useEffect(() => {
    if (!socket) return;
    socket.on('server:connected', (server) => {
      dispatch(setServerObject(server));
    });
    return () => {
      socket.off('server:connected');
    };
  }, [socket]);

  return (
    <>
      <div>{serverId}</div>
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
            <DM friend={friend} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
