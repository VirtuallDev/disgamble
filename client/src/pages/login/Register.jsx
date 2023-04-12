import React, { useState } from 'react';
import './Login.css';

const Register = () => {
  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [borders, setBorders] = useState({ username: 'none', email: 'none', password: 'none' });
  const [msg, setMsg] = useState({ msg: '', type: 'error' });

  const handleUsernameChange = (e) => {
    setData({ ...data, username: e.target.value });
    setUsername(e.target.value);
    if (e.target.value > 15) {
      setMsg({ msg: 'Username can not be longer than 15 characters!', type: 'error' });
      setBorders({ ...borders, ['username']: '1px solid red' });
      return;
    } else setBorders({ ...borders, ['username']: 'none' });
    setMsg({ msg: '', type: 'error' });
  };

  const handleEmailChange = (e) => {
    setData({ ...data, email: e.target.value });
    setUsername(e.target.value);
    if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
      setMsg({ msg: 'Email does not match the required pattern!', type: 'error' });
      setBorders({ ...borders, ['email']: '1px solid red' });
      return;
    } else setBorders({ ...borders, ['email']: 'none' });
    setMsg({ msg: '', type: 'error' });
  };

  const handlePasswordChange = (e) => {
    setData({ ...data, password: e.target.value });
    setUsername(e.target.value);
    if (!e.target.value.match(/^(?=.*[A-Za-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)) {
      setMsg({ msg: 'Password should have at least one alphabetic letter, one capital letter and one numeric letter!', type: 'error' });
      setBorders({ ...borders, ['password']: '1px solid red' });
      return;
    } else setBorders({ ...borders, ['password']: 'none' });
    setMsg({ msg: '', type: 'error' });
  };

  const handleRegister = async () => {
    if (usernameBorder !== 'none' || emailBorder !== 'none' || passwordBorder !== 'none') return;

    const usernameValid = await fetch(`http://localhost:3000/auth/usernameAvailable?username=${username}`, {
      method: 'GET',
    });
    const usernameValidResponse = await usernameValid.json();
    if (usernameValidResponse.error) return setMsg({ msg: 'Username is taken!', type: 'error' });

    const register = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
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
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => handleUsernameChange(e)}
          style={{ border: borders.username }}></input>
        <label>Email</label>
        <input
          type="email"
          onChange={(e) => handleEmailChange(e)}
          style={{ border: borders.email }}></input>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => handlePasswordChange(e)}
          style={{ border: borders.password }}></input>
        <button
          className="join-btn"
          onClick={(e) => handleRegister()}>
          Register
        </button>
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
