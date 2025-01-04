import { useState, useEffect } from 'react';

const AUTH_KEY = 'rohitmenonhart1209v77';
const AUTH_STORAGE_KEY = 'cardzilla_auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === AUTH_KEY;
  });

  const login = (key: string) => {
    if (key === AUTH_KEY) {
      localStorage.setItem(AUTH_STORAGE_KEY, key);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};