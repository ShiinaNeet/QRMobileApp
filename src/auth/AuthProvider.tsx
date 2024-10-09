import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

import { setupAxiosInterceptors } from './axios';

const AuthContext = createContext({
  isAuthenticated: false,
  login: (fullname: string, password: string, callback: () => void) => Promise.resolve(),
  logout: (callback: () => void) => Promise.resolve(),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (fullname: string, password: string, callback: () => void) => {
    axios.post('https://student-discipline-api-fmm2.onrender.com/auth/login', {
      fullname,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      if (response.data.status === 'success') {
        await Preferences.set({
          key: 'accessToken',
          value: response.data.api_token,
        });
        const { value: accessToken } = await Preferences.get({ key: 'accessToken' });
        if (accessToken) {
          setupAxiosInterceptors(accessToken);
          setIsAuthenticated(true);
          callback();
        }
      } else {
        console.log('Failed to login: ', response.data.message);
      }
    })
    .catch((error) => {
      console.error('There was an error logging in!', error);
    });
  };

  const logout = async (callback: () => void) => {
    await Preferences.remove({ key: 'accessToken' });
    setIsAuthenticated(false);
    callback();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { value: accessToken } = await Preferences.get({ key: 'accessToken' });
      if (accessToken) {
        setupAxiosInterceptors(accessToken);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);