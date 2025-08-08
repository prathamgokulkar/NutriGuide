# app/services/recipe_rag.py
from app.services.vector_store import search_recipes
from app.utils.helpers import query_llm

def get_recipe_suggestion(query: str) -> dict:
    matches = search_recipes(query)
    context = "\n\n".join([f"{m['title']}: {m['text']}" for m in matches])
    
    prompt = (
        f"User asked: {query}\n\n"
        f"Here are some possible recipe options:\n{context}\n\n"
        f"Based on the above, suggest one good recipe in natural language:"
    )
    
    answer = query_llm(prompt)
    return {"answer": answer}
