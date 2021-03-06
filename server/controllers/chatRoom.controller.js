const ChatRoom = require('./../models/ChatRoom');
const DirectMessage = require('./../models/DirectMessage');
const Message = require('./../models/Message');

module.exports = {
  wakeUp: (req, res) => {
    res.send('server is running');
  },
  getAllChatRooms: (req, res) => {
    ChatRoom.find({}, (err, data) => {
      if (err) throw err;
      if (data.length === 0) {
        return res.status(302).json({
          msg: 'No chatroom available',
        });
      }
      return res.status(200).json({
        chatRooms: data,
      });
    });
  },
  setChatRoom: (req, res) => {
    const roomDetails = req.body;
    console.log(roomDetails);
    const newChatRoom = new ChatRoom({
      name: roomDetails.roomName,
      author: roomDetails.author,
    });
    newChatRoom.save((err, data) => {
      if (err) throw err;
      ChatRoom.find({}, (err, data) => {
        res.status(200).json({
          chatRooms: data,
        });
      });
    });
  },
  getAllMessagesForChatRoom: (req, res) => {
    const { roomId } = req.params;
    ChatRoom.findOne({ _id: roomId })
      .populate('messages')
      .exec((err, room) => {
        if (room.messages.length > 0) {
          return res.json({ room });
        }
        return res.json({
          msg: 'Please send your message first.'
        });
      });
  },
  getAllPrivateMessages: (req, res) => {
    const { user1, user2 } = req.query;
    DirectMessage.findOne({ user1, user2 }, (err, data) => {
      if (data === null) {
        DirectMessage.findOne({ user1: user2, user2: user1 }, (err, data2) => {
          if (data2 !== null) {
            return DirectMessage.findOne({ user1: user2, user2: user1 })
              .populate('messages')
              .exec((err, populatedData) => res.json({ data: populatedData }));     
          }
          return res.status(302).json({
            msg: 'You don\'t have any message. Please send your first.',
          });
        });
      } else {
        DirectMessage.findOne({ user1, user2 })
          .populate('messages')
          .exec((err, populatedData) => res.json({ data: populatedData }))  
      }
    });
  },
  deleteMessage: (req, res) => {
    const { messageId } = req.params;
    const { user1, user2 } = req.query;

    DirectMessage.updateOne({ user1, user2 }, { $pull: { messages: messageId } }, () => {
      Message.remove({ _id: messageId }, () => res.json({ msg: 'Message Deleted' }));
    });
  },
  deleteChatRoom: (req, res) => {
    const { roomId } = req.params;
    // let messages = []
    ChatRoom.findOne({ _id: roomId }, () => {
      ChatRoom.remove({ _id: roomId }, () => {
        res.json({
          msg: 'Channel Deleted',
        });
      });
    });
  },
};
