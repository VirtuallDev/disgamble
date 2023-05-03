import React from 'react';
import './header.css';

const Header = ({ label, fontSize }) => {
  return (
    <div
      className="header"
      style={{ fontSize }}>
      {label}
      <div className="divider"></div>
    </div>
  );
};

export default Header;
