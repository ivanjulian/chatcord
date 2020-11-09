const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const users = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const admin = 'Admin';

io.on('connection', (socket) => {
  console.log('New WS connection');

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(room);
    // Welcoming the user
    socket.emit('message', formatMessage(admin, 'Welcome to ChatWS !'));

    // Broadcast when a user connects
    socket.broadcast.to(room).emit('message', formatMessage(admin, `${username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const { username, room } = getCurrentUser(socket.id);
    io.to(room).emit('message', formatMessage(username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit('message', formatMessage(admin, `${user.username} has left the chat`));
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
