import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import logger from '../utils/logger';

let io: SocketIOServer | null = null;

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  logger.info(`[SOCKET]

Socket.IO Initialized`);

  io.on('connection', (socket) => {
    logger.info(`[SOCKET]

Client Connected

Socket ID
${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`[SOCKET]

Client Disconnected

Socket ID
${socket.id}`);
    });
  });

  return io;
};

export const getSocketIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
};
