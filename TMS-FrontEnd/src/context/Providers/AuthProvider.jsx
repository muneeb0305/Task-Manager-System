import jwtDecode from 'jwt-decode';
import React, { createContext, useState, useEffect } from 'react';
import { PostData } from '../../utils/PostData';
import { host } from '../../data/AppConstants';
import Alert from '../../components/Alert';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  // States
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [userDetail, setUserDetail] = useState({});

  // If user refresh the page then get his token and set the token and user state
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    try {
      if (storedToken) {
        setToken(storedToken);
        const decode = jwtDecode(token)
        const ID = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        setUserDetail({ ID, role })
      }
      else {
        clearToken()
      }
    }
    catch (err) {
      clearToken()
    }
  }, [token]);

  // Login
  const Login = async (userForm) => {
    try {
      const LoginApi = `${host}/api/Login`
      const res = await PostData(LoginApi, userForm, token)
      SetToken(res)
      Alert({ icon: 'success', title: 'Log in Successfully' })
      navigate('/')
    } catch (err) {
      Alert({ icon: 'error', title: err })
    }
  };
  // Set Token
  const SetToken = (newToken) => {
    setToken(newToken);
    const decode = jwtDecode(newToken)
    const ID = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    setUserDetail({ ID, role })
    sessionStorage.setItem('token', newToken);
  };
  //Clear Token
  const clearToken = () => {
    setToken(null);
    setUserDetail(null);
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, SetToken, clearToken, userDetail, Login }}>
      {children}
    </AuthContext.Provider>
  );
}