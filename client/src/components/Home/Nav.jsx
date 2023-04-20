import React from 'react';
import './Nav.css';
import { Divider } from './Divider';
const API_URL = 'http://localhost:3000';

export const Nav = () => {
  return (
    <>
      <div className="nav-container">
        <div className="nav-button-container">
          <button className="nav-button">Create Server</button>
          <button className="nav-button">Add</button>
          <button className="nav-button">Remove</button>
          <button className="nav-button"> Connect</button>
        </div>

        <Divider
          m={'12px'}
          p={'0 12px'}
        />
      </div>
    </>
  );
};
