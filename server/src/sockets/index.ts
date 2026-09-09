import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../core/auth/jwt';
import { env } from '../config/environment';

let io: Server | null = null;

/** Rooms: role:<ROLE>, org:<orgId>, user:<userId> */
export function initSocketServer(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(); // guests may join public map updates
    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
    } catch {
      return next(new Error('Invalid token'));
    }
    next();
  });

  io.on('connection', (socket) => {
    const { userId, role } = socket.data as { userId?: string; role?: string };
    if (role) socket.join(`role:${role}`);
    if (userId) socket.join(`user:${userId}`);

    socket.on('org:subscribe', (orgId: string) => {
      if (typeof orgId === 'string' && /^[a-f\d]{24}$/i.test(orgId)) {
        socket.join(`org:${orgId}`);
      }
    });
  });

  return io;
}

export function getIO(): Server | null {
  return io;
}

/** Emit an event if socket server is running. MongoDB remains source of truth. */
export function emitEvent(event: string, payload: unknown, room?: string): void {
  if (!io) return;
  if (room) io.to(room).emit(event, payload);
  else io.emit(event, payload);
}
