import React from 'react';
import './Header.css';

export const Header = ({ label, fontSize }) => {
  return (
    <div
      className="header"
      style={{ fontSize }}>
      {label}
      <div className="divider"></div>
    </div>
  );
};
