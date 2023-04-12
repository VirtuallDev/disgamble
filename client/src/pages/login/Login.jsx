import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await fetch('http://localhost:3000/auth/login', {
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
          className="forgot-password"
          onClick={() => window.location.replace('/resetpassword')}>
          Forgot your password?
        </p>
        <button
          className="join-btn"
          onClick={() => handleLogin()}>
          Login
        </button>
        <div className="need-container">
          <p className="dont-have-an-account">Don't have an account?</p>
          <p
            className="register-redirect"
            onClick={() => window.location.replace('/register')}>
            Register
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
