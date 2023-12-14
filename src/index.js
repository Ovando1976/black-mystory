import './Firebase/firebaseConfig'; // Firebase initialization
import React from 'react';
import { SocketProvider } from './components/SocketContext';
import io from 'socket.io-client';
import App from './App'; // Your main app component

const socket = io('http://localhost:8080'); // Initialize your socket connection

const RootComponent = () => {
  return (
    <SocketProvider socket={socket}>
      <App />
    </SocketProvider>
  );
};

export default RootComponent;
