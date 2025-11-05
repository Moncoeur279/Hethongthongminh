import os
import torch
import pandas as pd
from sentence_transformers import SentenceTransformer, util

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SBERT_DIR = os.path.join(BASE_DIR, "sbert_encoder")
RESPONSES_PATH = os.path.join(BASE_DIR, "responses.csv")
EMBEDDINGS_PATH = os.path.join(BASE_DIR, "embeddings.pt")

print("Loading model and data...")

model = SentenceTransformer(SBERT_DIR)
df = pd.read_csv(RESPONSES_PATH)
embeddings = torch.load(EMBEDDINGS_PATH)

print("ChatBuddy: Hello! Type 'quit' to stop chatting.")

history = [] 
while True:
    user = input("You: ").strip()
    if user.lower() in ["quit", "exit"]:
        print("ChatBuddy: Goodbye! Have a great day!")
        break

    context_window = " ".join(history[-2:]) + " " + user  if len(history) > 1 else user
    user_emb = model.encode(context_window.strip(), convert_to_tensor=True)
    sims = util.cos_sim(user_emb, embeddings)
    idx = sims.argmax().item()
    reply = df.iloc[idx]["response"]

    print(f"[INFER] history: {history[-2:] if len(history) >= 2 else []}")
    print(f"[INFER] user: {user}")
    print(f"[INFER] context: '{context_window}'")
    print("-" * 50)
    print("ChatBuddy:", reply)
