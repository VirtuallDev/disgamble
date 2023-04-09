import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const login = await fetch('login', { method: 'POST' });
    // Redirect?
  };

  const registerRedirect = async () => {};

  const forgotPasswordRedirect = async () => {};

  return (
    <div className="container">
      <div className="header">Welcome!</div>
      <div className="credentials">
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}></input>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}></input>
        <p
          className="forgot-password"
          onClick={forgotPasswordRedirect}>
          Forgot your password?
        </p>
        <button
          className="join-btn"
          onClick={(e) => handleLogin()}>
          Login
        </button>
        <div className="need-container">
          <p className="dont-have-an-account">Don't have an account?</p>
          <p
            className="register-redirect"
            onClick={registerRedirect}>
            Register
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
