import React, { useState } from 'react';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const register = await fetch('register', { method: 'POST' });
    // Redirect?
  };

  return (
    <div className="container">
      <div className="header">Welcome</div>
      <div className="credentials">
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}></input>
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}></input>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}></input>
        <button
          className="join-btn"
          onClick={(e) => handleRegister()}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
