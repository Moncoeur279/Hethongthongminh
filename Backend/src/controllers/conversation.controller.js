const { Conversation } = require("../models");

exports.getAllByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: { userId },
      order: [["lastMessageAt", "DESC"]],
    });
    res.json(conversations);
  } catch (err) {
    console.error("Get conversations error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    const conversation = await Conversation.create({
      userId,
      title: title || "New Chat",
      lastMessageAt: new Date(),
    });
    res.json(conversation);
  } catch (err) {
    console.error("Create conversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const conv = await Conversation.findOne({ where: { id, userId } });
    if (!conv)
      return res.status(404).json({ message: "Conversation not found" });

    await conv.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete conversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
