from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import re
import difflib
import string

app = Flask(__name__)

model_name = "vennify/t5-base-grammar-correction"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

def normalize_for_compare(s):
    return re.sub(f"[{re.escape(string.punctuation)}]", "", s).lower().strip()

@app.route("/api/grammar_ai", methods=["POST"])
def grammar_ai():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "missing text"}), 400
    
    print("\n====================")
    print(f"[INPUT] {text}")

    if len(text.split()) <= 2:
        print("[SKIP] Too short -> return original")
        return jsonify({"original": text, "corrected": text}) 

    input_ids = tokenizer.encode(text, return_tensors="pt", truncation=True)

    outputs = model.generate(
        input_ids,
        max_length=128,
        num_beams=3,
        repetition_penalty=2.5,
        length_penalty=1.0,
        early_stopping=True,
    )

    corrected = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
    print(f"[MODEL OUTPUT] {corrected}")

    sentences = re.split(r'(?<=[.!?]) +', corrected)
    unique_sentences = []
    for s in sentences:
        if s.strip().lower() not in [u.strip().lower() for u in unique_sentences]:
            unique_sentences.append(s)
    corrected = " ".join(unique_sentences).strip()
    print(f"[SPLIT SENTENCES] {sentences}")
    print(f"[UNIQUE SENTENCES] {unique_sentences}")

    if len(unique_sentences) >= 2:
        first_sentence = unique_sentences[0].strip().lower()
        last_sentence = unique_sentences[-1].strip().lower()

        similarity = difflib.SequenceMatcher(None, first_sentence, last_sentence).ratio()

        words_first = set(re.findall(r"\b\w+\b", first_sentence))   
        words_last = set(re.findall(r"\b\w+\b", last_sentence))
        common = [w for w in words_last if w in words_first]
        word_coverage = len(common) / max(len(words_last), 1)

        print(f"[SIMILARITY] {similarity:.2f} | [WORD_OVERLAP] {word_coverage:.2f}")
        print(f"   FIRST: {first_sentence}")
        print(f"   LAST : {last_sentence}") 

        if (
            word_coverage > 0.8              
            or last_sentence in first_sentence 
            or similarity > 0.6
        ):
            print("[ACTION] Remove last sentence (repetition detected)")
            corrected = " ".join(unique_sentences[:-1]).strip()

    corrected = re.sub(r'([.!?])\1+', r'\1', corrected)

    orig_lower = normalize_for_compare(text)
    corr_lower = normalize_for_compare(corrected)

    if orig_lower == corr_lower:
        print("[NOTE] Correction same as input -> keep original")
        corrected = text

    print(f"[FINAL CORRECTED] {corrected}")
    return jsonify({"original": text, "corrected": corrected})

if __name__ == "__main__":
    app.run(port=5100, debug=True)
