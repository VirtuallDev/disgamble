import React, { useState } from 'react';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.error) return setMsg(jsonResponse.error);
    window.location.replace('/');
  };

  return (
    <div className="container">
      <div className="header">Welcome!</div>
      <div className="credentials">
        <div className="input-container">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}></input>
          <label htmlFor="email">Email Address</label>
        </div>

        <div className="input-container">
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}></input>
          <label htmlFor="password">Password</label>
        </div>

        <p
          className="status-msg"
          style={{ color: 'darkred', display: msg !== '' ? 'initial' : 'none' }}>
          {msg}
        </p>

        <p
          className="auth-link"
          onClick={() => window.location.replace('/resetpassword')}
          style={{ marginTop: '0.5em' }}>
          Forgot your password?
        </p>
        <button
          className="join-btn"
          onClick={() => handleLogin()}>
          Login
        </button>
        <div className="need-container">
          <p className="need-text">Don't have an account?</p>
          <p
            className="auth-link"
            onClick={() => window.location.replace('/register')}>
            Register
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
