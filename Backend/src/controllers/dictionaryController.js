const { DictionaryLookup } = require("../models");
const fetch = require("node-fetch");

exports.lookup = async (req, res) => {
    try {
        const userId = req.user?.id;
        const word = (req.query.word || "").trim();
        if (!word)
            return res.status(400).json({ error: "Missing 'word' query param" });

        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
            word
        )}`;
        const response = await fetch(apiUrl);
        if (!response.ok) return res.status(404).json({ error: "Word not found" });

        const data = await response.json();
        const entry = data[0] || {};

        if (userId) {
            await DictionaryLookup.create({
                userId,
                word: entry.word || word,
                phonetic: entry.phonetic || "",
                language: "en",
                source: "dictionaryapi.dev",
                resultJson: entry,
            });
        }

        res.json(entry);
    } catch (e) {
        console.error("[dict] lookup error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.recent = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const history = await DictionaryLookup.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
            limit: 10,
        });

        res.json(
            history.map((r) => ({
                id: r.id,
                word: r.word,
                phonetic: r.phonetic,
                at: r.createdAt,
            }))
        );
    } catch (err) {
        console.error("[dict] recent error:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
};