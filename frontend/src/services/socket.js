import { io } from 'socket.io-client';

let socketInstance = null;

export const connectSocket = (token) => {
  if (!token) return null;

  if (socketInstance?.connected) {
    return socketInstance;
  }

  socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    transports: ['websocket', 'polling'],
    auth: { token },
  });

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (!socketInstance) return;
  socketInstance.disconnect();
  socketInstance = null;
};
