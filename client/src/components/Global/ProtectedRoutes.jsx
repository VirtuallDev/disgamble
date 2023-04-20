import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

function ProtectedRoutes({ condition, redirect }) {
  useEffect(() => {
    if (condition) window.location.replace(redirect);
  });
  return <Outlet />;
}

export default ProtectedRoutes;
