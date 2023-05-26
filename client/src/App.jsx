import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import ProtectedRoutes from './components/Global/ProtectedRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { friendChange, setUserObject } from './redux/user';
import { initialMessages, messageAdded, messageDeleted, messageUpdated } from './redux/messages';
import useAuth from './customhooks/useAuth';
import { triggerPushToTalk } from './redux/sounds';
import { addCall, deleteCall, updateCall } from './redux/calls';

export const AuthContext = createContext();

const App = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userInfo, userAuth, voiceSettings, friends } = userObject;
  const dispatch = useDispatch();
  const { useApi, useSocket, socket } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const jsonResponse = await useApi('getuserinfo');
      if (jsonResponse && jsonResponse.success) dispatch(setUserObject(jsonResponse.success));
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.error('Client-side error:', message, source, lineno, colno, error);
    };

    fetchUser();
    const fetchHistory = async () => {
      const jsonResponse = await useApi(`/dmhistory`);
      if (jsonResponse && jsonResponse.success) dispatch(initialMessages(jsonResponse.success));
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if (e.key !== voiceSettings.key) return;
      dispatch(triggerPushToTalk(true));
    });
    window.addEventListener('keyup', (e) => {
      if (e.key !== voiceSettings.key) return;
      dispatch(triggerPushToTalk(false));
    });
    window.addEventListener('blur', () => {
      dispatch(triggerPushToTalk(false));
    });

    return () => {
      window.removeEventListener('keydown', (e) => {
        if (e.repeat) return;
        if (e.key !== voiceSettings.key) return;
        dispatch(triggerPushToTalk(true));
      });
      window.removeEventListener('keyup', (e) => {
        if (e.key !== voiceSettings.key) return;
        dispatch(triggerPushToTalk(false));
      });
      window.removeEventListener('blur', () => {
        dispatch(triggerPushToTalk(false));
      });
    };
  }, [voiceSettings]);

  useEffect(() => {
    if (!socket) return;
    socket.on('user:updateUser', () => {
      fetchUser();
    });
    socket.on('user:friendUpdate', (friendObject) => {
      dispatch(friendChange(friendObject));
    });
    socket.on('dm:messageAdded', (messageObject) => {
      dispatch(messageAdded(messageObject));
    });
    socket.on('dm:messageUpdated', (messageObject) => {
      dispatch(messageUpdated(messageObject));
    });
    socket.on('dm:messageDeleted', (messageObject) => {
      dispatch(messageDeleted(messageObject));
    });
    socket.on('server:connected', (server) => {
      dispatch(setUserObject(server));
    });
    socket.on('user:call', (callObject) => {
      dispatch(addCall(callObject));
    });
    socket.on('user:updateCall', (callObject) => {
      dispatch(updateCall(callObject));
    });
    socket.on('user:deleteCall', (callId) => {
      dispatch(deleteCall(callId));
    });

    return () => {
      socket.off('user:updateUser');
      socket.off('user:friendUpdate');
      socket.off('dm:messageAdded');
      socket.off('dm:messageUpdated');
      socket.off('dm:messageDeleted');
      socket.off('server:connected');
      socket.off('user:call');
      socket.off('user:updateCall');
      socket.off('user:deleteCall');
    };
  }, [socket]);

  return (
    <AuthContext.Provider value={{ useApi, useSocket, socket }}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoutes
                  condition={userInfo.userId}
                  redirect={'/'}
                />
              }>
              <Route
                exact
                path="/login"
                element={<Login />}
              />
              <Route
                exact
                path="/register"
                element={<Register />}
              />
            </Route>
            {!loading && (
              <Route
                element={
                  <ProtectedRoutes
                    condition={!userInfo.userId}
                    redirect={'/login'}
                  />
                }>
                <Route
                  exact
                  path="/"
                  element={<Home />}
                />
              </Route>
            )}
          </Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
