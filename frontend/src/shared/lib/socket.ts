import { SOCKET_URL, tokenStore } from './axios';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/** Singleton socket connection with JWT handshake. */
export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket {
  if (socket?.connected) return socket;
  socket?.disconnect();
  socket = io(SOCKET_URL || window.location.origin, {
    auth: { token: tokenStore.access ?? undefined },
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
  });
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function onSocketEvent(event: string, handler: (payload: unknown) => void): () => void {
  const s = connectSocket();
  s.on(event, handler);
  return () => {
    s.off(event, handler);
  };
}
