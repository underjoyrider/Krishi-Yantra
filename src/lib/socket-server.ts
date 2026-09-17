// Global singleton for Socket.IO server reference
declare global {
  var __io: any;
}

export function setSocketServer(ioInstance: any) {
  global.__io = ioInstance;
}

export function getSocketServer() {
  return global.__io || null;
}

export function broadcastQueueUpdate(centerId: string, payload: any) {
  const io = getSocketServer();
  if (io) {
    io.emit('queue:updated', payload);
    io.to(`center:${centerId}`).emit('queue:updated', payload);
  }
}

export function broadcastBookingStatus(bookingId: string, payload: any) {
  const io = getSocketServer();
  if (io) {
    io.emit('booking:statusChanged', payload);
    io.to(`booking:${bookingId}`).emit('booking:statusChanged', payload);
  }
}

export function broadcastNotification(userId: string, notification: any) {
  const io = getSocketServer();
  if (io) {
    io.emit('notification:new', notification);
    io.to(`user:${userId}`).emit('notification:new', notification);
  }
}

export function broadcastCenterStatus(centerId: string, status: string) {
  const io = getSocketServer();
  if (io) {
    io.emit('center:statusChanged', { centerId, status });
  }
}
