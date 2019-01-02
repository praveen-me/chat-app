const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const directMsgSchema = new mongoose.Schema({
  user1: { type: ObjectId },
  user2: { type: ObjectId },
  messages: [{type : ObjectId, ref : 'Message'}]
});

const DirectMessage = mongoose.model('DirectMessage', directMsgSchema);

module.exports = DirectMessage;