const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, default: new Date() },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
