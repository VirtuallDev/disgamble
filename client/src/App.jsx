import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import ProtectedRoutes from './components/Global/ProtectedRoutes';
import { useDispatch, useSelector } from 'react-redux';
import useUpdateUser from './customhooks/useUpdateUser';
import DM from './pages/DM/DM';
import Voice from './pages/Voice/Voice';
import { friendChange } from './redux/user';
import { initialMessages, messageAdded, messageDeleted, messageUpdated } from './redux/messages';
import useAuth from './customhooks/useAuth';

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
      if (jsonResponse?.success) dispatch(initialMessages(jsonResponse?.success));
    };
    fetchHistory();

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
    return () => {
      socket.off('user:updateUser');
      socket.off('user:friendUpdate');
      socket.off('dm:messageAdded');
      socket.off('dm:messageUpdated');
      socket.off('dm:messageDeleted');
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route
              path="/voice"
              element={<Voice />}
            />
          </Route>
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
              <Route
                path="/dm/:id"
                element={<DM />}
              />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
