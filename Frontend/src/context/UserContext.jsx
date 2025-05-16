import React, { createContext, useEffect, useState } from 'react';
import { decodeToken } from '../utils/axiosInstance';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded?.userId) {
        setUserId(decoded.userId);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
