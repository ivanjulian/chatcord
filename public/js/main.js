const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from url
const qs = window.location.search.split('&');
const qsSearch = (toSearch) => {
  let result = 0;
  qs.map((item) => {
    if (item.includes(toSearch)) {
      result = item.split('=')[1];
    }
  });

  return result;
};

const username = qsSearch('username');
const room = qsSearch('room');

const socket = io();

// Join chat
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (message) => {
  console.log('message from Server: ', message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value; // id of input in html

  // Emit message to the server
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = (message) => {
  const div = document.createElement('div');
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p> 
    <p class="text" >
    ${message.text}
    </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};

// Add roomname to DOM
const outputRoomName = (room) => {
  roomName.innerText = room;
};

// Add users to DOM
const outputUsers = (users) => {
  userList.innerText = ` 
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
  `;
};
