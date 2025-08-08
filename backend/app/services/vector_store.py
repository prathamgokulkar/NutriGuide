# app/services/vector_store.py
import faiss
import numpy as np
import json

# Load dataset
with open("app/data/recipes.json", "r", encoding="utf-8") as f:
    recipes = json.load(f)

# Load embeddings
recipe_texts = [r["text"] for r in recipes]
from app.core.embeddings import embed_text
embeddings = embed_text(recipe_texts)

# Build FAISS index
dimension = embeddings[0].shape[0]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

def search_recipes(query: str, top_k=5):
    query_vec = embed_text([query])
    _, indices = index.search(np.array(query_vec), top_k)
    return [recipes[i] for i in indices[0]]
