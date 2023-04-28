import jwt_decode from 'jwt-decode';
import io from 'socket.io-client';

export const API_URL = 'https://84.110.85.208:3000';

let accessToken = null;

export const socket = io(API_URL, {
  withCredentials: true,
  cors: true,
});

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
    const response = await fetch(`${API_URL}/auth/refreshtoken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const jsonResponse = await response.json();
    const newAccessToken = jsonResponse.accessToken;
    accessToken = newAccessToken;
  } catch (e) {
    accessToken = null;
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
    socket.emit(endpoint, accessToken, ...args);
  } catch (e) {
    console.log(e);
  }
}
