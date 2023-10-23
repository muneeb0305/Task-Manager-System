import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PostData } from '../utils/PostData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [user, setUser] = useState();

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const decode = jwtDecode(token)
      const ID = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      setUser({ ID, role })
    }
    // eslint-disable-next-line
  }, []);

  // Login
  const Login = async (userForm) => {
    const LoginApi = `https://localhost:7174/api/Login`
    const res = await PostData(LoginApi, userForm, token)
    SetToken(res)
  };

  const SetToken = (newToken) => {
    setToken(newToken);
    const decode = jwtDecode(newToken)
    const ID = decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    const role = decode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    setUser({ ID, role })
    sessionStorage.setItem('token', newToken);
  };

  const clearToken = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, SetToken, clearToken, user, Login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
