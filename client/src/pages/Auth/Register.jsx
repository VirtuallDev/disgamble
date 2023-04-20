import React, { useState } from 'react';
import './Auth.css';

const Register = () => {
  const [data, setData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const handleUsernameChange = (e) => {
    setData((prevData) => ({ ...prevData, username: e.target.value }));
    if (e.target.value.length > 15) return setMsg((prevMsg) => ({ ...prevMsg, username: 'Username can not be longer than 15 characters!' }));
    setMsg((prevMsg) => ({ ...prevMsg, username: '' }));
  };

  const handleEmailChange = (e) => {
    setData((prevData) => ({ ...prevData, email: e.target.value }));
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) return setMsg((prevMsg) => ({ ...prevMsg, email: 'Email does not match the required pattern!' }));
    setMsg((prevMsg) => ({ ...prevMsg, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setData((prevData) => ({ ...prevData, password: e.target.value }));
    if (e.target.value !== data.confirmPassword) {
      setMsg((prevMsg) => ({ ...prevMsg, confirmPassword: 'Passwords do not match.' }));
    } else {
      setMsg((prevMsg) => ({ ...prevMsg, confirmPassword: '' }));
    }
    if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/))
      return setMsg((prevMsg) => ({ ...prevMsg, password: 'Password should have at least one alphabetic letter, one capital letter and one numeric letter!' }));
    setMsg((prevMsg) => ({ ...prevMsg, password: '' }));
  };

  const handleConfirmPasswordChange = (e) => {
    setData((prevData) => ({ ...prevData, confirmPassword: e.target.value }));
    if (e.target.value !== data.password) return setMsg((prevMsg) => ({ ...prevMsg, confirmPassword: 'Passwords do not match.' }));
    setMsg((prevMsg) => ({ ...prevMsg, confirmPassword: '' }));
  };

  const handleRegister = async () => {
    if ((msg.username !== '' || msg.email !== '' || msg.password !== '', msg.confirmPassword !== '')) return;
    const register = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const jsonResponse = await register.json();
    if (jsonResponse.type) return setMsg((prevMsg) => ({ ...prevMsg, [jsonResponse.type]: jsonResponse.error }));
    if (jsonResponse.success) return window.location.replace('/login');
  };

  return (
    <div className="container">
      <div className="header">Welcome</div>
      <div className="credentials">
        <div className="input-container">
          <input
            name="username"
            type="text"
            required
            placeholder="Username"
            onChange={(e) => handleUsernameChange(e)}></input>
          <label htmlFor="username">Username</label>
        </div>
        <p
          className="status-msg"
          style={{ color: 'darkred', display: msg.username !== '' ? 'initial' : 'none' }}>
          {msg.username}
        </p>

        <div className="input-container">
          <input
            name="email"
            type="text"
            required
            placeholder="Email"
            onChange={(e) => handleEmailChange(e)}></input>
          <label htmlFor="email">Email</label>
        </div>
        <p
          className="status-msg"
          style={{ color: 'darkred', display: msg.email !== '' ? 'initial' : 'none' }}>
          {msg.email}
        </p>
        <div className="input-container">
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            onChange={(e) => handlePasswordChange(e)}></input>
          <label htmlFor="password">Password</label>
        </div>
        <p
          className="status-msg"
          style={{ color: 'darkred', display: msg.password !== '' ? 'initial' : 'none' }}>
          {msg.password}
        </p>
        <div className="input-container">
          <input
            name="confirm-password"
            type="password"
            required
            placeholder="Confirm Password"
            onChange={(e) => handleConfirmPasswordChange(e)}></input>
          <label htmlFor="confirm-password">Confirm Password</label>
        </div>
        <p
          className="status-msg"
          style={{ color: 'darkred', display: msg.confirmPassword !== '' ? 'initial' : 'none' }}>
          {msg.confirmPassword}
        </p>
        <button
          className="join-btn"
          onClick={(e) => handleRegister()}>
          Register
        </button>
        <div className="need-container">
          <p className="need-text">Already have an account?</p>
          <p
            className="auth-link"
            onClick={() => window.location.replace('/login')}>
            Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
