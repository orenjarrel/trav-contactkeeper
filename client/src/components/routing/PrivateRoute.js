import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';


const PrivateRoute = ({ component: Component, ...rest }) => { // takes in a Component and everything with it
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  return (
    <Route { ...rest } render={props => !isAuthenticated && !loading ? (
      <Redirect to='/login' />
    ) : (
      <Component {...props} />
    )} />
  )
}

export default PrivateRoute
