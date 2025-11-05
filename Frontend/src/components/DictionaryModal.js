import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSpeakerWave } from 'react-icons/hi2';
import { FaBook } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import "../styles/DictionaryModal.css";

function pickBestAudio(phonetics = []) {
  const hasAudio = phonetics.filter(p => p.audio);
  if (!hasAudio.length) return null;
  const us = hasAudio.find(p => /us/i.test(p.audio));
  const uk = hasAudio.find(p => /uk/i.test(p.audio));
  return (us || uk || hasAudio[0]).audio;
}

export function DictionaryPage() {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLookup = async () => {
    const q = word.trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setResult(null);
    setIsPlaying(false);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `http://localhost:3030/api/dict/lookup?word=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Lookup failed: ${res.status}`);
      const data = await res.json();

      const senses = Array.isArray(data.meanings)
        ? data.meanings.flatMap((m) =>
          m.definitions.map((d) => ({
            pos: m.partOfSpeech,
            definition: d.definition,
            example: d.example || "",
          }))
        )
        : [];
      const first = senses[0] || {};

      setResult({
        word: data.word,
        phonetic: data.phonetic || "",
        phonetics: data.phonetics || [],
        pos: first.pos || "",
        definition: first.definition || "",
        example: first.example || "",
        senses,
      });
    } catch (e) {
      setError("Not found or server error.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (!result) return;

    const url = pickBestAudio(result.phonetics);
    if (url) {
      try {
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
          return;
        }
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        setIsPlaying(true);
        await audio.play();
        return;
      } catch {

      }
    }

    try {
      const u = new SpeechSynthesisUtterance(result.word);
      const voices = window.speechSynthesis.getVoices();
      const en = voices.find(v => /en(-|_)?(US|GB|UK)?/i.test(v.lang));
      if (en) u.voice = en;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { }
  };

  return (
    <div className="dictionary-modal-overlay" role="dialog" aria-modal="true">
      <div className="dictionary-modal">
        <div className="modal-header">
          <h3> < FaBook color="#3b82f6" /> DICTIONARY </h3>
          <button className="close-button" onClick={() => navigate(-1)}>✕</button>
        </div>

        <div className="modal-body">
          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="Look up a word..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleLookup(); }}
            />
            <button className="search-btn" onClick={handleLookup} disabled={loading}>
              {loading ? "…" : < FaSearch size={20} />}
            </button>
          </div>

          {error && <div className="error-hint">{error}</div>}

          {result && (
            <div className="dictionary-result">
              <div className="result-header">
                <div className="word">{result.word}</div>
                <div className="phonetic">{result.phonetic}</div>
                <button
                  className="audio-btn"
                  type="button"
                  onClick={playAudio}
                  title="Play pronunciation"
                >
                  {isPlaying ? "⏹" : < HiSpeakerWave size={15} />}
                </button>
                {result.pos && <div className="pos">{result.pos}</div>}
              </div>

              {result.definition && (
                <div className="section">
                  <h5>Definition:</h5>
                  <div className="definition">{result.definition}</div>
                </div>
              )}

              {result.example && (
                <div className="section">
                  <h5>Example:</h5>
                  <div className="example">“{result.example}”</div>
                </div>
              )}

              {!!result.senses?.length && (
                <div className="section">
                  <h5>More senses:</h5>
                  <ul className="senses">
                    {result.senses.map((s, i) => (
                      <li key={i}>
                        {s.pos ? <b>{s.pos} — </b> : null}
                        {s.definition}
                        {s.example ? <em> — “{s.example}”</em> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
