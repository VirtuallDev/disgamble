import React, { useEffect } from 'react';
import { ServerList } from '../../components/Home/Server';
import { FriendsList } from '../../components/Home/Friend';
import { Header } from '../../components/Home/Header';
import { Ads } from '../../components/Home/Ads';
import User from '../../components/Home/user';
import { setServerObject } from '../../redux/server';
import { useDispatch, useSelector } from 'react-redux';
import './home.css';
import { socket } from '../../apiHandler';

const Home = () => {
  const dispatch = useDispatch();
  const serverObject = useSelector((state) => state.server.serverObject);
  const { servername, serverId, serverImage, serverAddress, usersOnline, description, dateCreated, channels } = serverObject;

  useEffect(() => {
    socket.on('serverConnected', (server) => {
      dispatch(setServerObject(server));
    });
    return () => {
      socket.off('serverConnected');
    };
  }, []);

  return (
    <>
      <div>{serverId}</div>
      <div className="home-container">
        <div className="right-side">
          <FriendsList />
          <User />
        </div>
        <div className="left-side">
          <Ads />
          <Header
            fontSize={'32px'}
            label={'Servers'}
          />
          <div className="serverlist-container">
            <ServerList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
