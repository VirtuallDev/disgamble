import React, { useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { SocketContext, socket } from './apiHandler';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import ProtectedRoutes from './components/Global/ProtectedRoutes';
import { useSelector } from 'react-redux';
import useUpdateUser from './customhooks/useUpdateUser';
import DM from './pages/DM/DM';
import { friendChange } from './redux/user';

function App() {
  const userObject = useSelector((state) => state.user.userObject);
  const { userId } = userObject;
  const { loading, fetchUser } = useUpdateUser();

  useEffect(() => {
    fetchUser();
    socket.on('updateUser', () => {
      fetchUser();
    });
    socket.on('friendChange', (friendObject) => {
      dispatch(friendChange(friendObject));
    });
    return () => {
      socket.off('updateUser');
      socket.off('friendChange');
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <SocketContext.Provider value={{ socket }}>
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
                <Route
                  path="/dm/:id"
                  element={<DM />}
                />
              </Route>
            )}
          </Routes>
        </SocketContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
