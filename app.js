const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');

const app = express();

// Import Message and ChatRoom
const ChatRoom = require('./server/models/ChatRoom');
const Message = require('./server/models/Message');

// necessary middlewares
app.use(bodyParser.json());
app.use(cors())

//Seting view for apps
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './server/views'));


// Webpack config
if (process.env.NODE_ENV === 'development') {
  console.log('in webpack hot middleware');
  
  const compiler = webpack(webpackConfig);
  
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
}


mongoose.connect('mongodb://localhost/chit-chatter', { useNewUrlParser: true }, (err, done) => {
  if(err) throw err;
  console.log('connected to mongodb');
});

// App setup
const server = app.listen(4000, function(){
  console.log('listening for requests on port 4000,');
});
const io = socket(server);

// Add middleware of endpoints
app.use('/api/v1/',require('./server/routers/api'));

// Requiring routes
app.use(require('./server/routers/index'));

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
