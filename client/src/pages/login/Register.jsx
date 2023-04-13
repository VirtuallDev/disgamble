import React, { useState } from 'react';
import './Login.css';

const Register = () => {
  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [msg, setMsg] = useState({ username: '', email: '', password: '' });

  const handleUsernameChange = (e) => {
    setData({ ...data, username: e.target.value });
    if (e.target.value.length > 15) return setMsg({ ...msg, username: 'Username can not be longer than 15 characters!' });
    setMsg({ ...msg, username: '' });
  };

  const handleEmailChange = (e) => {
    setData({ ...data, email: e.target.value });
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) return setMsg({ ...msg, email: 'Email does not match the required pattern!' });
    setMsg({ ...msg, email: '' });
  };

  const handlePasswordChange = (e) => {
    setData({ ...data, password: e.target.value });
    if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/))
      return setMsg({ ...msg, password: 'Password should have at least one alphabetic letter, one capital letter and one numeric letter!' });
    setMsg({ ...msg, password: '' });
  };

  const handleRegister = async () => {
    if (msg.username !== '' || comsglors.email !== '' || msg.password !== '') return;

    const usernameValid = await fetch(`http://localhost:3000/auth/usernameAvailable?username=${data.username}`, {
      method: 'GET',
    });
    const usernameValidResponse = await usernameValid.json();
    if (usernameValidResponse.error) return setMsg({ msg: 'Username is taken!', type: 'error' });

    const register = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const jsonResponse = await register.json();
    if (jsonResponse.error) return setMsg({ msg: jsonResponse.error, type: 'error' });
    if (jsonResponse.success) setMsg({ msg: jsonResponse.success, type: 'success' });
    return window.location.replace('/login');
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
        <button
          className="join-btn"
          onClick={(e) => handleRegister()}>
          Register
        </button>
        <div className="need-container">
          <p className="dont-have-an-account">Already have an account?</p>
          <p
            className="register-redirect"
            onClick={() => window.location.replace('/login')}>
            Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
