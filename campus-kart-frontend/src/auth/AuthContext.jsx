import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get('authToken');
      const expiresIn = Cookies.get('expiresIn');

      if (authToken && expiresIn) {
        const currentTime = Date.now();
        if (currentTime > parseInt(expiresIn, 10)) {
          // Token expired
          handleLogout();
        } else {
          // Token valid
          setAuthData({
            username: Cookies.get('username'),
            role: Cookies.get('role'),
            authToken,
            organisationUrl: Cookies.get('organisationUrl'),
          });
        }
      } else {
        handleLogout();
      }
    };

    const handleLogout = () => {
      Cookies.remove('username', { domain: '.localhost', path: '/' });
      Cookies.remove('role', { domain: '.localhost', path: '/' });
      Cookies.remove('authToken', { domain: '.localhost', path: '/' });
      Cookies.remove('expiresIn', { domain: '.localhost', path: '/' });
      Cookies.remove('organisationUrl', { domain: '.localhost', path: '/' });
      setAuthData(null);
      navigate('/login');
    };

    checkAuth();

    const interval = setInterval(checkAuth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};