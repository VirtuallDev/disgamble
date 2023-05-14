import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import ProtectedRoutes from './components/Global/ProtectedRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { friendChange } from './redux/user';
import { initialMessages, messageAdded, messageDeleted, messageUpdated } from './redux/messages';
import useUpdateUser from './customhooks/useUpdateUser';
import useAuth from './customhooks/useAuth';
import { triggerPushToTalk } from './redux/sounds';
import { addCall, deleteCall, updateCall } from './redux/calls';

const App = () => {
  const userObject = useSelector((state) => state.user.userObject);
  const { userId } = userObject;
  const { loading, fetchUser } = useUpdateUser();
  const dispatch = useDispatch();
  const { useApi, useSocket, socket } = useAuth();

  useEffect(() => {
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
      if (e.key !== 't') return;
      dispatch(triggerPushToTalk(true));
    });
    window.addEventListener('keyup', (e) => {
      if (e.key !== 't') return;
      dispatch(triggerPushToTalk(false));
    });
    window.addEventListener('blur', () => {
      dispatch(triggerPushToTalk(false));
    });

    return () => {
      window.removeEventListener('keydown', (e) => {
        if (e.repeat) return;
        if (e.key !== 't') return;
        dispatch(triggerPushToTalk(true));
      });
      window.removeEventListener('keyup', (e) => {
        if (e.key !== 't') return;
        dispatch(triggerPushToTalk(false));
      });
      window.removeEventListener('blur', () => {
        dispatch(triggerPushToTalk(false));
      });
    };
  }, []);

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
      dispatch(setServerObject(server));
    });
    socket.on('user:call', (callObject) => {
      dispatch(addCall(callObject));
    });
    socket.on('user:updateCall', (callObject) => {
      dispatch(updateCall(callObject));
    });
    socket.on('user:deleteCall', (callId) => {
      console.log('deleting', callId);
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
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoutes
                condition={userId}
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
                  condition={!userId}
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
  );
};

export default App;
