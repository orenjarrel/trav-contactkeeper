import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  // w need to get user data from the back end and put it into
  // ... the user state, so that we can validate our authentication
  // ... this should allow us to view the home page
  const loadUser = async () => {
    if(localStorage.token) {
      // load token into  global headers 
      setAuthToken(localStorage.token);
    }

    try {
      // checks token to confirm if you're a valid user
      /// ...need to confirm if request is a valid user
      const res = await axios.get('/api/auth');

      // if so, then we need to dispatch
      dispatch({ 
        type: USER_LOADED,
        payload: res.data
       });
    } catch (err) {
      dispatch({ 
        type: AUTH_ERROR 
      });
    }

  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      // the axist POST returns a response (we must await for it)
      // ... since we have the "proxy" in JSON, we don't have to  use http://localhost
      // ... for our requests
      const res = await axios.post('/api/users', formData, config); 
      console.log("res-axios", res.data)

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
    
  }

  // Login User
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      // the axist POST returns a response (we must await for it)
      // ... since we have the "proxy" in JSON, we don't have to  use http://localhost
      // ... for our requests
      const res = await axios.post('/api/auth', formData, config); 
      console.log("res-axios", res.data)

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    }
    
  }

  // Logout
  const logout = () => {
    dispatch({ type: LOGOUT })
  };

  // Clear Errors 
  const clearErrors = () => 
    dispatch({
      type: CLEAR_ERRORS
    });

  // return the Provider so we can wrap our application with this Context
  return (
    <AuthContext.Provider
      // this section here allows us to access these methods from any component
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors
      }}>
      { props.children }
    </AuthContext.Provider>
  );
};

export default AuthState;