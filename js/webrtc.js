//webrtc.js

// Establish WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

// Define event handlers
socket.addEventListener('open', function (event) {
    console.log('WebSocket connection established.');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server:', event.data);
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error:', event);
});

socket.addEventListener('close', function (event) {
    console.log('WebSocket connection closed.');
});

// Send a message to the server
socket.send('Hello from the client!');
