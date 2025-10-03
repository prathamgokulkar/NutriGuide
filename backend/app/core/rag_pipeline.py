# Logic for the RAG system (VectorDB + LLM)
import chromadb
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from ..db.models import Recipe
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.getenv("GROQ_API_KEY")

class RAGPipeline:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2", device: str = "cpu", chroma_collection_name: str = "recipes", chroma_path: str = "chroma_db"):
        print("Initializing RAG Pipeline...")

        self.model = SentenceTransformer(model_name, device=device)

        self.chroma_client = chromadb.PersistentClient(path=chroma_path)
        self.collection = self.chroma_client.get_collection(name=chroma_collection_name)

        self.llm = ChatGroq(model="openai/gpt-oss-20b", api_key=groq_api_key)
        print("RAG Pipeline initialized.")


    # Perform embedding -> query -> retrieve
    def search_recipes(self, query: str, db: Session, top_k: int = 5):
        direct_hit = db.query(Recipe).filter(Recipe.name.ilike(f'%{query}%')).first()
        if direct_hit:
            print(f"Direct hit found for query: {query}")
            return [direct_hit]
        
        print(f"No direct hit. Performing vector search for query: {query}")
        query_embedding = self.model.encode(query).tolist()
        results = self.collection.query(
            query_embeddings = [query_embedding],
            n_results = top_k
        )
        recipe_ids_str = results.get('ids', [[]])[0]
        if not recipe_ids_str:
            return []
        
        recipe_ids = [int(id_str) for id_str in recipe_ids_str]
        recipes = db.query(Recipe).filter(Recipe.id.in_(recipe_ids)).all()
        return recipes

    def generate_response(self, query: str, context_recipes: list, user_goal: str, chat_history: list) -> str:
        context_str = ""
        for recipe in context_recipes:
            context_str += f"--- Recipe: {recipe.name} ---\n"
            context_str += f"Minutes: {recipe.minutes}\n"
            context_str += f"Calories: {recipe.calories}\n"
            context_str += f"Description: {recipe.description}\n\n"
        
        history_str = "\n".join([f"{msg.sender}: {msg.message}" for msg in chat_history])

        prompt = f"""
        You are NutriGuide, a friendly and expert nutrition assistant. Your goal is to help the user achieve their health objectives.

        **User's Health Goal:** {user_goal.replace('_', ' ')}

        **Instructions:**
        1. Analyze the user's question in the context of their CHAT HISTORY.
        2. Use the retrieved RECIPE CONTEXT to find the best one or two matches.
        3. **Crucially, explicitly mention how your suggestion aligns with the user's health goal.** For example, "Based on your goal of weight loss, this low-calorie recipe is a great choice."
        4. If the user asks a follow-up question, use the CHAT HISTORY to understand what they are referring to.
        5. Format your final response using Markdown. If suggesting recipes, number them and separate with a horizontal rule (---).

        **CHAT HISTORY:**
        {history_str}

        **RECIPE CONTEXT:**
        {context_str}

        **User's Latest Question:**
        {query}

        **ASSISTANT'S RESPONSE:**
        """
        response = self.llm.invoke(prompt)
        return response.content

rag_system = RAGPipeline()