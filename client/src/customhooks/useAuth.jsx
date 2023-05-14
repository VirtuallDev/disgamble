import { useEffect, useRef } from 'react';
import jwt_decode from 'jwt-decode';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from '../redux/accesstoken';

export const API_URL = 'https://doriman.yachts:5001';

function useAuth() {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const apiRef = useRef(null);
  const accessToken = useSelector((state) => state.accesstoken.accessToken);

  useEffect(() => {
    apiRef.current = async function (endpoint, method = 'GET', body = null) {
      try {
        const headers = {
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        };
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`${API_URL}/${endpoint}`, options);
        const jsonResponse = await response.json();
        return jsonResponse;
      } catch (e) {
        console.log(e);
      }
    };

    socketRef.current = io(API_URL, {
      withCredentials: true,
      cors: true,
      extraHeaders: { authorization: accessToken },
    });
    return () => {
      if (!socketRef.current) socketRef.current.disconnect();
    };
  }, [accessToken]);

  function isTokenExpired() {
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
      if (newAccessToken) dispatch(setAccessToken(newAccessToken));
    } catch (e) {
      dispatch(setAccessToken(null));
    }
  }

  async function useSocket(endpoint, ...args) {
    try {
      if (isTokenExpired()) await getNewAccessToken();
      socketRef.current.emit(endpoint, ...args);
    } catch (e) {
      console.log(e);
    }
  }

  async function useApi(endpoint, method = 'GET', body = null) {
    try {
      if (isTokenExpired()) await getNewAccessToken();
      const jsonResponse = await apiRef.current(endpoint, method, body);
      return jsonResponse;
    } catch (e) {
      console.log(e);
    }
  }

  return { useApi, useSocket, socket: socketRef.current };
}

export default useAuth;
