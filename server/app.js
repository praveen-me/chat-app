const express = require('express');
const socket = require('socket.io');

// App setup
const app = express();
const server = app.listen(4000, function(){
  console.log('listening for requests on port 4000,');
});
const io = socket(server);



app.get('/', (req, res) => {
  res.send('server is running');
})




io.on('connection', (socket) => {
  console.log('user is connected');
  socket.on('message', (msg) => {
    console.log(msg);
    io.sockets.emit('chat', msg)
  })
});
