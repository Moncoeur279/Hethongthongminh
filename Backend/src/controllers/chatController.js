const fetch = require("node-fetch");
const { Message, Conversation } = require("../models");

async function getRecentHistory(conversationId, limit = 6) {
    const messages = await Message.findAll({
        where: { conversationId },
        order: [["createdAt", "DESC"]],
        limit,
    });
    return messages
        .reverse()
        .map((m) => m.content || "")
        .filter(content => content.trim() !== "")
}

exports.handleChat = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        const { conversationId, text } = req.body;

        if (!text) return res.status(400).json({ message: "Missing text" });
        if (!conversationId) return res.status(400).json({ message: "Missing conversationId" });

        const conv = await Conversation.findOne({
            where: { id: conversationId, userId },
        });
        if (!conv) return res.status(404).json({ message: "Conversation not found" });

        const userMsg = await Message.create({
            conversationId,
            role: "user",
            content: text,
        });

        if (!conv.title || conv.title === "New Chat") {
            conv.title = text.length > 30 ? text.slice(0, 30) + "..." : text;
            await conv.save();
        }

        let replyText = "Demo phản hồi AI";
        try {
            const response = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text,
                    userId,
                    history: await getRecentHistory(conversationId),
                }),
            });

            const data = await response.json();
            replyText = data.reply || data.response || replyText;
        } catch (err) {
            console.warn("Flask API error:", err.message);
        }

        const botMsg = await Message.create({
            conversationId,
            role: "assistant",
            content: replyText,
        });

        conv.lastMessageAt = new Date();
        await conv.save();

        res.json({
            userMsg,
            botMsg,
        });
    } catch (err) {
        console.error("handleChat error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user?.id || req.query.userId;

        if (!conversationId)
            return res.status(400).json({ message: "Missing conversationId" });

        const conv = await Conversation.findOne({
            where: { id: conversationId, userId },
        });
        if (!conv)
            return res.status(404).json({ message: "Conversation not found" });

        const messages = await Message.findAll({
            where: { conversationId },
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (err) {
        console.error("getMessages error:", err);
        res.status(500).json({ message: "Server error" });
    }
};