const router = require('express').Router();
const chatRoomController = require('./../controllers/chatRoom.controller')
const userController = require('./../controllers/user.controller');

router.get('/wake-up', chatRoomController.wakeUp);

router.get('/chat-rooms', chatRoomController.getAllChatRooms);

router.post('/chat-rooms', chatRoomController.setChatRoom);

router.get('/chat-rooms/:roomId', chatRoomController.getAllMessagesForChatRoom);

router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.get('/logout', userController.logOut);

router.get('/users', userController.getAllUsers);

router.get('/messages', chatRoomController.getAllPrivateMessages);

router.delete('/messages/:messageId', chatRoomController.deleteMessage)

module.exports = router;
