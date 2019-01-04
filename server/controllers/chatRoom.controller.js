const ChatRoom = require('./../models/ChatRoom');
const DirectMessage = require('./../models/DirectMessage');

module.exports = {
  wakeUp : (req, res) => {
    res.send('server is running');
  },
  getAllChatRooms : (req, res) => {
    ChatRoom.find({}, (err, data) => {
      if(err) throw err;
      if(data.length === 0) {
        return res.status(302).json({
          msg : "No chatroom available"
        })
      } else {
        return res.status(200).json({
          chatRooms : data
        })
      }
    })
  },
  setChatRoom : (req, res) => {
    const roomDetails = req.body;
    console.log(roomDetails);
    const newChatRoom = new ChatRoom({
      name : roomDetails.roomName,
      author : roomDetails.author
    })
    newChatRoom.save((err, data) => {
      if(err) throw err;
      ChatRoom.find({}, (err, data) => {
        res.status(200).json({
          chatRooms : data
        })
      })
    })
  },
  getAllMessagesForChatRoom: (req, res) => {
    const {roomId} = req.params;
    ChatRoom.findOne({_id : roomId})
      .populate('messages')
      .exec((err, room) => {
        if(room.messages.length > 0) {
          return res.json({
            room 
          })
        } else {
          return res.json({
            msg : 'Please send your message first.'
          })
        }
      })
  },
  getAllPrivateMessages: (req, res) => {
    const {user1, user2} = req.query;
    DirectMessage.findOne({ user1, user2 }, (err,data) => {
      if(!data) {
        DirectMessage.findOne({ user1 : user2, user2 : user1 }, (err, data2) => {
          if(data) {
            console.log(data2)
            return res.json({
              messages : data2
            })
          }
        })
      }
      console.log(data)
      return res.json({
        messages : data
      })
    })
  }
}