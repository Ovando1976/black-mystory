'use client'
import React, { createContext, useContext } from 'react';

// Create the context
export const SocketContext = createContext(null);

// Custom hook for using this context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Provider component
export const SocketProvider = ({ socket, children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
