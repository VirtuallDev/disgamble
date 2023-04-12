import React, { useState } from 'react';
import './Login.css';

const Register = () => {
  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [colors, setColors] = useState({ username: 'white', email: 'white', password: 'white' });
  const [msg, setMsg] = useState({ msg: '', type: 'error' });

  const handleUsernameChange = (e) => {
    setData({ ...data, username: e.target.value });
    if (e.target.value.length > 15) {
      setMsg({ msg: 'Username can not be longer than 15 characters!', type: 'error' });
      setColors({ ...colors, ['username']: 'red' });
      return;
    } else setColors({ ...colors, ['username']: 'white' });
    setMsg({ msg: '', type: 'error' });
  };

  const handleEmailChange = (e) => {
    setData({ ...data, email: e.target.value });
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setMsg({ msg: 'Email does not match the required pattern!', type: 'error' });
      setColors({ ...colors, ['email']: 'red' });
      return;
    } else setColors({ ...colors, ['email']: 'white' });
    setMsg({ msg: '', type: 'error' });
  };

  const handlePasswordChange = (e) => {
    setData({ ...data, password: e.target.value });
    if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)) {
      setMsg({ msg: 'Password should have at least one alphabetic letter, one capital letter and one numeric letter!', type: 'error' });
      setColors({ ...colors, ['password']: 'red' });
      return;
    } else setColors({ ...colors, ['password']: 'white' });
    setMsg({ msg: '', type: 'error' });
  };

  const handleRegister = async () => {
    if (colors.username !== 'white' || colors.email !== 'white' || colors.password !== 'white') return;

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
            onChange={(e) => handleUsernameChange(e)}
            style={{ color: colors.username }}></input>
          <label htmlFor="username">Username</label>
        </div>

        <div className="input-container">
          <input
            name="email"
            type="text"
            required
            placeholder="Email"
            onChange={(e) => handleEmailChange(e)}
            style={{ color: colors.email }}></input>
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-container">
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            onChange={(e) => handlePasswordChange(e)}
            style={{ color: colors.password }}></input>
          <label htmlFor="password">Password</label>
        </div>
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
        <p
          className="status-msg"
          style={{ color: msg?.type === 'error' ? 'darkred' : 'green' }}>
          {msg?.msg}
        </p>
      </div>
    </div>
  );
};

export default Register;
