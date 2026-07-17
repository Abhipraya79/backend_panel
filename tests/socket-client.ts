import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

console.log('Connecting to Socket.IO Server...');

socket.on('connect', () => {
  console.log(`Connected to server! Socket ID: ${socket.id}`);
});

socket.on('telemetry:new', (data) => {
  console.log('Received telemetry:new event payload:', JSON.stringify(data, null, 2));
  socket.disconnect();
  console.log('Disconnected client, exiting test.');
  process.exit(0);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server!');
});

// Force timeout after 30 seconds if no message is received
setTimeout(() => {
  console.error('Timeout: No telemetry event received.');
  socket.disconnect();
  process.exit(1);
}, 30000);
