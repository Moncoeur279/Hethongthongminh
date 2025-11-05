import os
import pandas as pd
from sentence_transformers import SentenceTransformer
import torch
import joblib

# 1. Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.txt")

df = pd.read_csv(DATA_PATH, sep="\t", names=["input", "response"])
print(f"Loaded {len(df)} dialogue pairs.")

# 2. Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

# 3. Encode input
print("Encoding sentences...")
embeddings = model.encode(df["input"].tolist(), convert_to_tensor=True)

EMB_PATH = os.path.join(BASE_DIR, "embeddings.pt")
RESPONSES_PATH = os.path.join(BASE_DIR, "responses.csv")
ENCODER_PATH = os.path.join(BASE_DIR, "sbert_encoder")

os.makedirs("model", exist_ok=True)
torch.save(embeddings, EMB_PATH)
df.to_csv(RESPONSES_PATH, index=False)
model.save(ENCODER_PATH)

print("Model trained and saved successfully.")
