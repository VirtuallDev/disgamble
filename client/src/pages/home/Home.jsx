import React from 'react';
import './home.css';
import { Server } from '../../components/Home/Server';
import { Friend } from '../../components/Home/Friend';

const Home = () => {
  return (
    <div className="home-container">
      <div className="left-side">
        <div className="ads">ADS</div>
        <div className="server-list">
          <div
            className="last-dms"
            style={{ backgroundColor: 'red' }}>
            LAST DMS
          </div>
          <div className="last-servers">
            {[1, 2, 3, 4, 5].map((e) => {
              return <Server />;
            })}
          </div>
        </div>
        <div className="nav">NAV</div>
      </div>
      <div className="friend-list">
        {[1, 2, 3, 4, 5].map((e) => {
          return <Friend />;
        })}
      </div>
    </div>
  );
};

export default Home;
