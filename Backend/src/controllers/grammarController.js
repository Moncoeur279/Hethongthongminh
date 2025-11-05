const axios = require("axios");

exports.checkGrammar = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Missing text" });

        const aiResponse = await axios.post("http://127.0.0.1:5100/api/grammar_ai", { text });
        const { corrected, error_types } = aiResponse.data;

        const corrections = [];
        if (corrected && corrected !== text) {
            corrections.push({
                id: 1,
                original: text,
                suggestion: corrected,
                reason: error_types?.join(", ") || "Grammar correction",
                label: "Grammar correction",
            });
        }

        res.json({ corrections });
    } catch (err) {
        console.error("Grammar check failed:", err.message);
        res.status(500).json({ message: "Grammar API error" });
    }
};
