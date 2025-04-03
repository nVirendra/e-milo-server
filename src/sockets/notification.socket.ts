import { Server, Socket } from 'socket.io';
import {
  addUserSocket,
  removeUserSocket,
  getUserSocket,
} from '../utils/socketStore';

export const initNotificationSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    if (userId) {
      addUserSocket(userId, socket.id);
      console.log(`🔌 ${userId} connected (${socket.id})`);
    }

    socket.on('disconnect', () => {
      if (userId) {
        removeUserSocket(userId);
        console.log(` ${userId} disconnected`);
      }
    });
  });
};

export const sendNotificationToUser = (
  io: Server,
  receiverId: string,
  data: any
) => {
  const socketId = getUserSocket(receiverId);
  if (socketId) {
    io.to(socketId).emit('new-notification', data);
  }
};
