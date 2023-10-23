import jwtDecode from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const TokenContext = createContext();

export function TokenProvider({ children }) {
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
    <TokenContext.Provider value={{ token, SetToken, clearToken, user }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  return useContext(TokenContext);
}
