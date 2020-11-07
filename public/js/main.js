const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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
  div.innerHTML = `<p class="meta">Brad<span>9:12pm</span></p> 
    <p class="text" >
    ${message}
    </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};
