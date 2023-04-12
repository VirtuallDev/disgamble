import React from 'react';
import { socketRequest } from '../../apiHandler';

const Main = () => {
  const socket = async () => {
    socketRequest('hello', 'blabla');
  };

  return (
    <div>
      <button
        className="join-btn"
        onClick={(e) => socket()}>
        Socket
      </button>
    </div>
  );
};

export default Main;
