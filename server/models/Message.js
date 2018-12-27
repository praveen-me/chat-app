const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  msg : {type: String, required},
  author : {type: String, required}
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
