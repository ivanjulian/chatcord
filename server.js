const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('New WS connection');

  socket.emit('message', 'Welcome to ChatWS !');

  // Broadcast when a user connects
  socket.broadcast.emit('message', 'A user has joined the chat');

  // Runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });

  //Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
