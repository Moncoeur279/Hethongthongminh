from flask import Flask, request, jsonify
import torch
import pandas as pd
from sentence_transformers import SentenceTransformer, util
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SBERT_DIR = os.path.join(BASE_DIR, "sbert_encoder")
RESPONSES_PATH = os.path.join(BASE_DIR, "responses.csv")
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "embeddings.pt")

print("Loading SBERT model and data...")
try:
    model = SentenceTransformer(SBERT_DIR)
    df = pd.read_csv(RESPONSES_PATH)
    embeddings = torch.load(EMBEDDINGS_PATH, map_location=torch.device('cpu'))
    print(f"Loaded {len(df)} responses and embeddings.")
except Exception as e:
    print("ERROR loading model:", e)
    raise

histories = {} 

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_text = data.get('text', '').strip()
        user_id = str(data.get('userId', 'anonymous'))

        if not user_text:
            return jsonify({"error": "Missing 'text'"}), 400

        if user_id not in histories:
            histories[user_id] = []

        history = histories[user_id]
        context = user_text

        print(f"[FLASK] history: {history[-2:] if len(history) >= 2 else []}")
        print(f"[FLASK] user: '{user_text}'")
        print(f"[FLASK] context: '{context}'")
        print("-" * 50)

        user_emb = model.encode(context.strip(), convert_to_tensor=True)
        sims = util.cos_sim(user_emb, embeddings)
        idx = sims.argmax().item()
        reply = df.iloc[idx]["response"]

        history.append(user_text)
        history.append(reply)

        return jsonify({"reply": reply})

    except Exception as e:
        print("Inference error:", e)
        return jsonify({"reply": "Sorry, something went wrong."}), 500


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=False)
