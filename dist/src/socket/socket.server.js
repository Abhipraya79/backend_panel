"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("../utils/logger"));
let io = null;
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    logger_1.default.info(`[SOCKET]

Socket.IO Initialized`);
    io.on('connection', (socket) => {
        logger_1.default.info(`[SOCKET]

Client Connected

Socket ID
${socket.id}`);
        socket.on('disconnect', () => {
            logger_1.default.info(`[SOCKET]

Client Disconnected

Socket ID
${socket.id}`);
        });
    });
    return io;
};
exports.initializeSocket = initializeSocket;
const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.IO is not initialized!');
    }
    return io;
};
exports.getSocketIO = getSocketIO;
