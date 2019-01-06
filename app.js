const express = require('express');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const webpack = require('webpack');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');

const app = express();

// Import Message and ChatRoom
const ChatRoom = require('./server/models/ChatRoom');
const Message = require('./server/models/Message');
const DirectMessage = require('./server/models/DirectMessage');

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

// Set cookies session
app.use(session({
  secret: 'pencil users',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 500000,
  },
  store: new MongoStore({ url: 'mongodb://localhost/altupdates-session' }),
}));

// Using middleware for passport
app.use(passport.initialize());
app.use(passport.session());
require('./server/modules/passport')(passport);


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

const userSocketDetails = {}
io.on('connection', (socket) => {
  socket.on('socket-connected', (socketDetails) => {
    if(socketDetails.id) {
      userSocketDetails[socketDetails.username] = socket.id;
    }
  })
  socket.on('message', (msg) => {
    // Saving Message in to db and pushing the id 
    // of the message to the specific chatroom
    const newMessage = new Message({
      message : msg.message,
      author : msg.author
    })
    newMessage.save((err, currentMsg) => {
      // pushing id of the current msg into the 
      // specific chatroom messages field
      ChatRoom.findOneAndUpdate({_id : msg.currentChatRoomId}, { $push : { messages : currentMsg._id } }, { upsert: true }, (err, done) => {
      })
    })
    io.sockets.emit('chat', msg)
  })
  socket.on('direct-message', (msg) => {
    console.log(msg)
    const {user1, user2, message, author} = msg;
    DirectMessage.findOne({ user1: user1, user2: user2 }, (err, data) => {
      if(!data) {
        const newMessage = new Message({
          message: message,
          author: author,
        })
        newMessage.save((err, data) => {
          const newDirectMessage = new DirectMessage({
            user1: user1,
            user2: user2,
            messages: [data._id] 
          })
          newDirectMessage.save()
        })
        return;
      } else {
        const newMessage = new Message({
          message: message,
          author: author,
        });
        newMessage.save((err, data) => {
          DirectMessage.findOneAndUpdate({user1 : user1, user2: user2}, { $push : { messages : data._id } }, { upsert: true }, (err, done) => {
          })
        })
        return;
      }
    })
    socket.emit('directChat', msg);
    if(userSocketDetails[msg.to]) {
      socket.to(`${userSocketDetails[msg.to]}`).emit('directChat', msg)
    }
  })
});
