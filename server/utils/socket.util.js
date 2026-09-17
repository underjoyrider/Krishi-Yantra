/**
 * Socket.IO Broadcasting Utility
 * Safely accesses global.__io to emit real-time updates to connected farmers and centers.
 */

function getIO() {
  return global.__io || null;
}

function emitQueueUpdate(centerId, payload) {
  const io = getIO();
  if (!io) return;
  // Emit both naming styles for frontend compatibility
  io.emit('queueUpdated', payload);
  io.emit('queue:updated', payload);
  if (centerId) {
    io.to(`center:${centerId}`).emit('queueUpdated', payload);
    io.to(`center:${centerId}`).emit('queue:updated', payload);
  }
}

function emitBookingCreated(booking) {
  const io = getIO();
  if (!io) return;
  io.emit('bookingCreated', booking);
  io.emit('booking:created', booking);
  if (booking.centerId) {
    io.to(`center:${booking.centerId}`).emit('bookingCreated', booking);
  }
  if (booking.farmerId) {
    io.to(`user:${booking.farmerId}`).emit('bookingCreated', booking);
  }
}

function emitBookingCancelled(booking) {
  const io = getIO();
  if (!io) return;
  io.emit('bookingCancelled', booking);
  io.emit('booking:cancelled', booking);
  if (booking.centerId) {
    io.to(`center:${booking.centerId}`).emit('bookingCancelled', booking);
  }
  if (booking.farmerId) {
    io.to(`user:${booking.farmerId}`).emit('bookingCancelled', booking);
  }
}

function emitQueuePositionChanged(bookingId, payload) {
  const io = getIO();
  if (!io) return;
  io.emit('queuePositionChanged', payload);
  io.emit('queue:positionChanged', payload);
  if (bookingId) {
    io.to(`booking:${bookingId}`).emit('queuePositionChanged', payload);
  }
}

function emitCenterStatusChanged(centerId, status) {
  const io = getIO();
  if (!io) return;
  const payload = { centerId, status };
  io.emit('centerStatusChanged', payload);
  io.emit('center:statusChanged', payload);
  io.to(`center:${centerId}`).emit('centerStatusChanged', payload);
}

function emitNotificationCreated(userId, notification) {
  const io = getIO();
  if (!io) return;
  io.emit('notificationCreated', notification);
  io.emit('notification:new', notification);
  if (userId) {
    io.to(`user:${userId}`).emit('notificationCreated', notification);
    io.to(`user:${userId}`).emit('notification:new', notification);
  }
}

function emitBookingUpdated(bookingId, payload) {
  const io = getIO();
  if (!io) return;
  io.emit('bookingUpdated', payload);
  io.emit('booking:updated', payload);
  if (bookingId) {
    io.to(`booking:${bookingId}`).emit('bookingUpdated', payload);
    io.to(`booking:${bookingId}`).emit('booking:updated', payload);
  }
}

module.exports = {
  getIO,
  emitQueueUpdate,
  emitBookingCreated,
  emitBookingCancelled,
  emitBookingUpdated,
  emitQueuePositionChanged,
  emitCenterStatusChanged,
  emitNotificationCreated,
};
