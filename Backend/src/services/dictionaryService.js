// src/services/dictionaryService.js (CommonJS)
const axios = require("axios");

const CACHE = new Map();
const TTL_MS = Number(process.env.DICT_CACHE_TTL_MS || 10 * 60 * 1000); // 10 phút

function setCache(key, value) {
    CACHE.set(key, { value, expireAt: Date.now() + TTL_MS });
}
function getCache(key) {
    const hit = CACHE.get(key);
    if (!hit) return null;
    if (Date.now() > hit.expireAt) {
        CACHE.delete(key);
        return null;
    }
    return hit.value;
}

function normalize(word, apiData) {
    // https://api.dictionaryapi.dev/api/v2/entries/en/<word>
    const entry = Array.isArray(apiData) ? apiData[0] : null;
    if (!entry) return null;

    const phonetic =
        entry.phonetic ||
        (entry.phonetics && entry.phonetics.find((p) => p.text)?.text) ||
        "";

    // >>> Thêm: danh sách phát âm (text + audio mp3 nếu có)
    const phonetics = (entry.phonetics || [])
        .map((p) => ({
            text: p.text || "",
            audio: p.audio || "",
            sourceUrl: p.sourceUrl || "",
        }))
        .filter((p) => p.text || p.audio); // bỏ item trống

    const senses = [];
    (entry.meanings || []).forEach((m) => {
        const pos = m.partOfSpeech || "";
        (m.definitions || []).forEach((d) => {
            senses.push({
                pos,
                definition: d.definition || "",
                example: d.example || "",
                synonyms: d.synonyms || [],
            });
        });
    });

    return {
        word: entry.word || word,
        phonetic,   // chuỗi IPA tổng quát
        phonetics,  // mảng chi tiết để FE chọn US/UK và phát audio
        senses,
        source: "dictionaryapi.dev",
    };
}

async function lookupWordRaw(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
    )}`;
    const { data } = await axios.get(url, {
        timeout: 8000,
        // ném lỗi khi không 2xx
        validateStatus: (s) => s >= 200 && s < 300,
        headers: { "User-Agent": "TalkMate/1.0 (+dictionary)" },
    });
    return data;
}

async function lookupWord(word) {
    const key = String(word || "").toLowerCase().trim();
    if (!key) return null;

    const cached = getCache(key);
    if (cached) return { ...cached, cached: true };

    const raw = await lookupWordRaw(key);
    const normalized = normalize(key, raw);
    if (!normalized) return null;

    setCache(key, normalized);
    return normalized;
}

module.exports = { lookupWord, lookupWordRaw };
