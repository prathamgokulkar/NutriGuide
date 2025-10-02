# Logic for the RAG system (VectorDB + LLM)
import chromadb
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from ..db.models import Recipe

class RAGPipeline:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2", device: str = "cuda", chroma_collection_name: str = "recipes", chroma_path: str = "chroma_db"):
        print("Initializing RAG Pipeline...")

        self.model = SentenceTransformer(model_name, device=device)

        self.chroma_client = chromadb.PersistentClient(path=chroma_path)
        self.collection = self.chroma_client.get_collection(name=chroma_collection_name, embedding_function=HuggingFaceEmbeddings(model_name=model_name, model_kwargs={"device": device}).embed_query)
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
    
rag_system = RAGPipeline()