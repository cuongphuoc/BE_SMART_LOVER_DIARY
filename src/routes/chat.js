const express = require('express');
const router = express.Router();
const authLogin=require('../app/middleware/AuthenLogin')
const ChatController=require('../app/controllers/ChatController')
router.post('/',authLogin, ChatController.sendMessage);
module.exports = router;