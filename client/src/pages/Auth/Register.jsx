import React, { useState } from 'react';

const API_URL = 'https://doriman.yachts:5001';

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
    const register = await fetch(`${API_URL}/auth/register`, {
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
        {[
          {
            name: 'username',
            type: 'text',
            placeholder: 'Username',
            label: 'Username',
            handler: (e) => handleUsernameChange(e),
            error: msg.username,
            value: data.username,
          },
          {
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            label: 'Email',
            handler: (e) => handleEmailChange(e),
            error: msg.email,
            value: data.email,
          },
          {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            label: 'Password',
            handler: (e) => handlePasswordChange(e),
            error: msg.password,
            value: data.password,
          },
          {
            name: 'confirm-password',
            type: 'password',
            placeholder: 'Confirm Password',
            label: 'Confirm Password',
            handler: (e) => handleConfirmPasswordChange(e),
            error: msg.confirmPassword,
            value: data.confirmPassword,
          },
        ].map((item, index) => (
          <React.Fragment key={index}>
            <div className="input-container">
              <input
                autoComplete={item.type === 'password' ? 'new-password' : 'off'}
                name={item.name}
                type={item.type}
                required
                placeholder={item.placeholder}
                value={item.value}
                onChange={(e) => item.handler(e)}></input>
              <label htmlFor={item.name}>{item.label}</label>
            </div>
            <p
              className="status-msg"
              style={{ color: 'darkred', display: item.error !== '' ? 'initial' : 'none' }}>
              {item.error}
            </p>
          </React.Fragment>
        ))}
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
