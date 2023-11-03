import jwtDecode from 'jwt-decode';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { create } from '../../utils';
import { API_ENDPOINTS } from '../../data/AppConstants';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();

const LOGIN_API = API_ENDPOINTS.LOGIN
const ID_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  // States
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [userDetail, setUserDetail] = useState({});

  /*---------------------Functions Related to Auth---------------------------*/

  const Login = async (userForm) => {
    create(LOGIN_API, null, userForm)
      .then((res) => { setTokenAndDecodeUser(res); navigate('/') })
  };

  const setTokenAndDecodeUser = useCallback((newToken) => {
    setToken(newToken);
    DecodeToken(newToken)
    sessionStorage.setItem('token', newToken);
  }, []);

  const DecodeToken = (token) => {
    const decode = jwtDecode(token)
    const ID = decode[ID_CLAIM];
    const role = decode[ROLE_CLAIM]
    setUserDetail({ ID, role })
  };

  const clearToken = () => {
    setToken(null);
    setUserDetail(null);
    sessionStorage.removeItem('token');
    localStorage.clear()
  };

  // If user refresh the page then get his token and set the token and user state
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    try {
      if (storedToken) {
        setTokenAndDecodeUser(storedToken)
      }
      else {
        clearToken()
      }
    }
    catch (err) {
      clearToken()
    }
  }, [token, setTokenAndDecodeUser]);

  return (
    <AuthContext.Provider value={{ token, clearToken, userDetail, Login }}>
      {children}
    </AuthContext.Provider>
  );
}