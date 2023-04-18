import React from 'react';
import './home.css';
import { Server } from '../../components/Home/Server';
import { Friend } from '../../components/Home/Friend';
import { Header } from '../../components/Home/Header';
import { Divider } from '../../components/Home/Divider';
import { FaMicrophone } from 'react-icons/fa';
import { MdHeadsetMic } from 'react-icons/md';

const Home = () => {
  return (
    <div className="home-container">
      <div className="left-side">
        <div className="ads">ADS</div>
        <div className="server-list">
          <Header
            fontSize={'32px'}
            label={'Servers'}
          />
          {[1, 2, 3, 4, 5].map((e, index) => {
            return <Server key={index} />;
          })}
        </div>
        <div className="nav">NAV</div>
      </div>
      <div className="right-side">
        <div className="friend-list">
          <Header
            fontSize={'32px'}
            label={'Friends'}
          />
          {[1, 2, 3, 4, 5, 3, 4, 5, 3, 4, 5, 3, 4, 5].map((e, index) => {
            return <Friend key={index} />;
          })}
        </div>
        <UserOptions />
      </div>
    </div>
  );
};

export default Home;

const UserOptions = () => {
  return (
    <div className="user-options">
      <img
        style={{ width: '50px', height: '50px', marginLeft: '0.5em', border: '1px solid red', borderRadius: '50%' }}
        src="https://scontent.ftlv1-1.fna.fbcdn.net/v/t1.6435-9/185533119_4148921461842219_3844749577676356191_n.png?_nc_cat=104&ccb=1-7&_nc_sid=174925&_nc_ohc=MCl_UNz1aNgAX8BH_so&_nc_ht=scontent.ftlv1-1.fna&oh=00_AfD5BwjMdZV87QbtCEehU5TRsVUnEJKEY72qQ1isFLh9uQ&oe=6465C39F"
        alt=""></img>
      <FaMicrophone size={'1.5em'}></FaMicrophone>
      <MdHeadsetMic size={'1.5em'}></MdHeadsetMic>
    </div>
  );
};
