import React, { useEffect } from 'react';
import './main.css';

const Main = () => {

  useEffect(() => {
    fetch("http://localhost:3000/auth/logout", {
      method: 'POST'
    });
  }, []);

  return <div></div>;
};

export default Main;
