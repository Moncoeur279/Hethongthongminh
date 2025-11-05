const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const conversationController = require("../controllers/conversation.controller");

router.get("/", auth, conversationController.getAllByUser);
router.post("/", auth, conversationController.createConversation);
router.delete("/:id", auth, conversationController.deleteConversation);

module.exports = router;
