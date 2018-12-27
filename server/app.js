const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// necessary middlewares
app.use(bodyParser.json());
app.use(cors())

mongoose.connect('mongodb://localhost/chit-chatter', { useNewUrlParser: true }, (err, done) => {
  if(err) throw err;
  console.log('connected to mongodb');
});

// App setup
const server = app.listen(4000, function(){
  console.log('listening for requests on port 4000,');
});
const io = socket(server);

app.use('/api/v1/',require('./routers/api'))

io.on('connection', (socket) => {
  console.log('user is connected');
  socket.on('message', (msg) => {
    console.log(msg);
    io.sockets.emit('chat', msg)
  })
});
