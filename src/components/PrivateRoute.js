import React from 'react';
import { Route } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Login } from './Login';

const PrivateRoute = ({ component, ...options }) => {
  const { currentUser } = useAuthContext();
  const finalComponent = currentUser ? component : Login;
  return <Route {...options} component={finalComponent} />;
};

export default PrivateRoute;
