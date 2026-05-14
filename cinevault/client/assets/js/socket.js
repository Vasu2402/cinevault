/* ═══════════════════════════════════════════════════════════════
   CineVault — Socket.io Client
   Real-time seat booking updates
   ═══════════════════════════════════════════════════════════════ */

let socket = null;
let currentShowId = null;

function initSocket() {
  if (socket) return socket;

  const token = getToken();
  if (!token) return null;

  socket = io(window.location.origin, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
    if (currentShowId) {
      socket.emit('join:show', currentShowId);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
}

function joinShow(showId) {
  currentShowId = showId;
  if (!socket) initSocket();
  if (socket?.connected) {
    socket.emit('join:show', showId);
  }
}

function leaveShow(showId) {
  if (socket?.connected) {
    socket.emit('leave:show', showId);
  }
  currentShowId = null;
}

function emitSeatLock(showId, seatNumber) {
  if (!socket) initSocket();
  socket?.emit('seat:lock', { showId, seatNumber });
}

function emitSeatUnlock(showId, seatNumber) {
  socket?.emit('seat:unlock', { showId, seatNumber });
}

function emitSeatsBooked(showId, seatNumbers) {
  socket?.emit('seat:booked', { showId, seatNumbers });
}

/**
 * Register callbacks for real-time seat events
 */
function onSeatEvents({ onLocked, onReleased, onConfirmed, onError }) {
  if (!socket) return;

  socket.off('seat:locked');
  socket.off('seat:released');
  socket.off('seats:confirmed');
  socket.off('seat:error');

  if (onLocked) socket.on('seat:locked', onLocked);
  if (onReleased) socket.on('seat:released', onReleased);
  if (onConfirmed) socket.on('seats:confirmed', onConfirmed);
  if (onError) socket.on('seat:error', onError);
}

function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentShowId = null;
  }
}
