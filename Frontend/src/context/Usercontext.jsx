import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import server from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [user, setUser] = useState('');
  const logout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    window.location.href = '/';
  };
  useEffect(() => {
    const match = document.cookie.match(/(^| )token=([^;]+)/);
    if (match) {
      setToken(match[2]);
    }
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const res = await axios.post(`${server}/api/getuser`, { token });
          console.log(res.data);
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);
  return (
    <AuthContext.Provider value={{ token, user,logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
