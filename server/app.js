const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Import Message and ChatRoom
const ChatRoom = require('./models/ChatRoom');
const Message = require('./models/Message');

// necessary middlewares
app.use(bodyParser.json());
app.use(cors())

mongoose.connect('mongodb://praveen-me:PRAVEEN1234@ds145304.mlab.com:45304/chatter', { useNewUrlParser: true }, (err, done) => {
  if(err) throw err;
  console.log('connected to mongodb');
});

// App setup
const server = app.listen(function(){
  console.log('listening for requests on port 4000,');
});
const io = socket(server);

app.use('/api/v1/',require('./routers/api'));

io.on('connection', (socket) => {
  console.log('user is connected');
  socket.on('message', (msg) => {
    // Saving Message in to db and pushing the id 
    // of the message to the specific chatroom
    console.log(msg.currentChatRoomId);
    const newMessage = new Message({
      message : msg.message,
      author : msg.author
    })
    newMessage.save((err, currentMsg) => {
      // pushing id of the current msg into the 
      // specific chatroom messages field
      console.log(currentMsg._id)
      ChatRoom.findOneAndUpdate({_id : msg.currentChatRoomId}, { $push : { messages : currentMsg._id } }, { upsert: true }, (err, done) => {
      })
    })
    io.sockets.emit('chat', msg)
  })
});
