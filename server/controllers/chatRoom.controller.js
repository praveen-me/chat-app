const ChatRoom = require('./../models/ChatRoom');

module.exports = {
  wakeUp : (req, res) => {
    res.send('server is running');
  },
  getAllChatRooms : (req, res) => {
    ChatRoom.find({}, (err, data) => {
      if(err) throw err;
      if(data.length === 0) {
        return res.status(200).json({
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
    
      
  }
}