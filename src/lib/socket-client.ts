'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getClientSocket(): Socket {
  if (!socket && typeof window !== 'undefined') {
    socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to KrishiYantra real-time service');
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time service');
    });
  }
  return socket as Socket;
}
