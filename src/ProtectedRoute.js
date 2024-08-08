// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    console.log(`User ${currentUser.email} is accessing a protected route.`);
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
