const express = require("express");
const auth = require("../middleware/auth");
const chatController = require("../controllers/chatController");
const router = express.Router();

router.post("/", auth, chatController.handleChat);
router.get("/messages/:conversationId", auth, chatController.getMessages);

module.exports = router;
