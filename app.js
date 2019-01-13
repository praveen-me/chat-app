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

// necessary middleware
app.use(bodyParser.json());
app.use(cors());

// Setting view for apps
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './server/views'));

app.use(express.static(path.join(__dirname, '/img')));

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
  store: new MongoStore({ url: 'mongodb://localhost/chat-session' }),
}));

// Using middleware for passport
app.use(passport.initialize());
app.use(passport.session());
require('./server/modules/passport')(passport);


mongoose.connect('mongodb://localhost/chit-chatter', { useNewUrlParser: true }, (err) => {
  if (err) throw err;
  console.log('connected to mongodb');
});

// App setup
const server = app.listen(4000, () => {
  console.log('listening for requests on port 4000,');
});
const io = socket(server);

// Add middleware of endpoints
app.use('/api/v1/', require('./server/routers/api'));

// Requiring routes
app.use(require('./server/routers/index'));

const userSocketDetails = {};
io.on('connection', (socket) => {
  socket.on('socket-connected', (socketDetails) => {
    if (socketDetails.id) {
      userSocketDetails[socketDetails.username] = socket.id;
    }
    if (Object.keys(userSocketDetails).length > 0) {
      console.log(userSocketDetails);
      io.sockets.emit('online-users', [...Object.keys(userSocketDetails)])
    }
  });
  socket.on('message', (msg) => {
    // Saving Message in to db and pushing the id
    // of the message to the specific chatroom
    const newMessage = new Message({
      message: msg.message,
      author: msg.author,
    });
    newMessage.save((err, currentMsg) => {
      // pushing id of the current msg into the specific chatroom messages field
      ChatRoom.findOneAndUpdate({ _id: msg.currentChatRoomId },
        { $push: { messages: currentMsg._id } }, { upsert: true });
    });
    io.sockets.emit('chat', msg);
  });
  socket.on('direct-message', (msg) => {
    const { user1, user2, message, author } = msg;
    DirectMessage.find({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    }, (err, data) => {
      if (data.length === 0) {
        const newMessage = new Message({ message, author });
        newMessage.save((error, newMsg) => {
          if (error) throw err;
          const newDirectMessage = new DirectMessage({
            user1,
            user2,
            messages: [newMsg._id],
          });
          newDirectMessage.save();
        });
      } else {
        const newMessage = new Message({ message, author });
        newMessage.save((e, newMsg) => {
          console.log(newMsg, user1, user2);
          if (e) throw err;
          DirectMessage.findOneAndUpdate({
            $or: [
              { user1, user2 },
              { user1: user2, user2: user1 },
            ],
          }, { $push: { messages: newMsg._id } }, { upsert: true }, (err, data) => {});
        });
      }
    });
    socket.emit('directChat', msg);
    if (userSocketDetails[msg.to]) {
      socket.to(userSocketDetails[msg.to]).emit('directChat', msg);
    }
  });
  socket.on('disconnect', () => {
    const socketIndex = Object.values(userSocketDetails).indexOf(socket.id);
    delete userSocketDetails[Object.keys(userSocketDetails)[[socketIndex]]];
    io.sockets.emit('online-users', [...Object.keys(userSocketDetails)]);
  });
});
