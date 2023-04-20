import React from 'react';
import { FriendsList } from '../../components/Home/Friend';
import User from '../../components/Home/user';
import './dm.css';

const DM = () => {
  return (
    <div className="home-container">
      <div className="right-side">
        <FriendsList />
        <User />
      </div>
      <div className="left-side"></div>
    </div>
  );
};

export default DM;
