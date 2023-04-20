import React from 'react';
import { ServerList } from '../../components/Home/Server';
import { FriendsList } from '../../components/Home/Friend';
import { Header } from '../../components/Home/Header';
import { Ads } from '../../components/Home/Ads';
import User from '../../components/Home/user';
import './home.css';

const Home = () => {
  return (
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
  );
};

export default Home;
