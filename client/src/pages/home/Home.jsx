import React, { useEffect, useState } from 'react';
import { ServerList } from '../../components/Home/Server';
import FriendsList from '../../components/Home/FriendList';
import { Header } from '../../components/Home/Header';
import { Ads } from '../../components/Home/Ads';
import User from '../../components/Home/user';
import { setServerObject } from '../../redux/server';
import { useDispatch, useSelector } from 'react-redux';
import './home.css';
import { socket } from '../../apiHandler';
import { FaExchangeAlt } from 'react-icons/fa';
import DM from '../DM/DM';

const Home = () => {
  const dispatch = useDispatch();
  const serverObject = useSelector((state) => state.server.serverObject);
  const { servername, serverId, serverImage, serverAddress, usersOnline, description, dateCreated, channels } = serverObject;
  const [current, setCurrent] = useState(false);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    socket.on('server:connected', (server) => {
      dispatch(setServerObject(server));
    });
    return () => {
      socket.off('server:connected');
    };
  }, []);

  return (
    <>
      <div>{serverId}</div>
      <div className="home-container">
        <div className="right-side">
          <div className="change-container">
            <FaExchangeAlt
              onClick={() => setCurrent((current) => !current)}
              className="change"
              size={'5em'}
              color={'inherit'}></FaExchangeAlt>
          </div>
          <FriendsList setUserId={setUserId} />
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
            <DM userId={userId} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
