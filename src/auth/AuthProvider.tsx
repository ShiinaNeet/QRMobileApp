import React, { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

const AuthContext = createContext({
  isAuthenticated: false,
  login: (email: string, password: string, callback: () => void) => Promise.resolve(),
  logout: (callback: () => void) => Promise.resolve(),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string, callback: () => void) => {
    // Perform login logic here, e.g., API call
    await Preferences.set({
      key: 'accessToken',
      value: 'your-access-token',
    });
    setIsAuthenticated(true);
    callback();
  };

  const logout = async (callback:() => void) => {
    await Preferences.remove({ key: 'accessToken' });
    setIsAuthenticated(false);
    callback();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { value: accessToken } = await Preferences.get({ key: 'accessToken' });
      if (accessToken) {
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