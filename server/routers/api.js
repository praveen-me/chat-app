const router = require('express').Router();
const chatRoomController = require('./../controllers/chatRoom.controller')

router.get('/wake-up', chatRoomController.wakeUp);

router.get('/chat-rooms', chatRoomController.getAllChatRooms);

router.post('/chat-rooms', chatRoomController.setChatRoom);

router.get('/chat-rooms/:roomId', chatRoomController.getAllMessagesForChatRoom);

module.exports = router;
