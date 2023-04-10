import React from 'react';
import jwt_decode from 'jwt-decode';
import { API_URL } from './config';

const io = require('socket.io-client');
export const socket = io(API_URL, {
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true,
});

export const SocketContext = React.createContext();

let accessToken = null;

function isTokenExpired(accessToken) {
  try {
    if (!accessToken) return true;
    const decodedToken = jwt_decode(accessToken);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (e) {
    return true;
  }
}

async function getNewAccessToken() {
  try {
    const response = await fetch(`${API_URL}/refreshtoken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const jsonResponse = await response.json();
    const newAccessToken = jsonResponse.accessToken;
    accessToken = newAccessToken;
    socket.io.opts.extraHeaders.Authorization = `Bearer ${accessToken}`;
  } catch (e) {
    accessToken = null;
    socket.io.opts.extraHeaders.Authorization = `Bearer ${accessToken}`;
  }
}

async function getAuthorizationHeader() {
  if (isTokenExpired()) await getNewAccessToken();
  return { authorization: `Bearer ${accessToken}` };
}

export async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const headers = await getAuthorizationHeader();
    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }
    const response = await fetch(`${API_URL}/${endpoint}`, options);
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (e) {
    console.log(e);
  }
}

export async function socketRequest(endpoint, ...args) {
  try {
    if (isTokenExpired()) await getNewAccessToken();
    socket.emit(endpoint, ...args);
  } catch (e) {
    console.log(e);
  }
}
