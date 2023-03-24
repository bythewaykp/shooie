const {io} = require('socket.io-client')

// let socket = io("http://localhost:3002");
var socket = io('http://localhost:3002', {resource: 'nodejs'});

socket.on("connect", () => {
    console.log("connected");
});