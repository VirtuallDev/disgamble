import React from 'react';
import { SocketContext, socket } from './contexts/SocketContext';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Main from './pages/main/Main';
import Login from './pages/login/Login';
import Register from './pages/login/Register';

function App() {
  return (
    <div>
      <BrowserRouter>
        <SocketContext.Provider value={{ socket }}>
          <Routes>
            <Route>
              <Route
                exact
                path="/"
                element={<Main />}
              />

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
          </Routes>
        </SocketContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
