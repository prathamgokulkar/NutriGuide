# Logic for the RAG system (VectorDB + LLM)
import chromadb
from sentence_transformers import SentenceTransformer
from langchain.embeddings import HuggingFaceEmbeddings
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
        query_embedding = self.model.encode(query, convert_to_tensor=False).tolist()

        results = self.collection.query(
            query_embeddings = [query_embedding],
            n_results=top_k
        )

        recipes_ids = results['ids'][0]
        if not recipes_ids:
            return []
        
        int_recipe_ids = [int(id) for id in recipes_ids]

        recipes = db.query(Recipe).filter(Recipe.id.in_(int_recipe_ids)).all()

        return recipes
    
    def generate_response(self, query: str, context_recipes: list) -> str:
        context_str = ""
        for recipe in context_recipes:
            context_str += f"Recipe: {recipe.name}\n"
            context_str += f"Minutes: {recipe.minutes}\n"
            context_str += f"Ingredients: {recipe.ingredients}\n"
            context_str += "\n"
    
        prompt = f"""
        You are a helpful and friendly nutrition assistant called NutriGuide.
        Use the following retrieved recipe context to answer the user's question.
        Suggest one or two of the best options from the context and briefly explain why they are a good fit.
        If the context is empty or none of the recipes are a good match, just say that you couldn't find a suitable recipe. Do not make anything up.

        CONTEXT:
        {context_str}

        USER'S QUESTION:
        {query}

        ASSISTANT'S RESPONSE:
        """

        response = self.llm.invoke(prompt)
        return response.content

rag_system = RAGPipeline()