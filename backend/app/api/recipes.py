# Endpoints for the RAG chat, recipe search, etc

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..dependencies import get_db
from ..core.rag_pipeline import RAGPipeline

router = APIRouter(
    prefix="/recipes",
    tags=["recipes"],
)

class SearchQuery(BaseModel):
    query: str

class RecipeSchema(BaseModel):
    id: int
    name: str
    minutes: int
    ingredients: str
    steps: str
    description: str | None= None
    calories: float | None= None

    class config:
        orm_mode = True

@router.post("/search", response_model=List[RecipeSchema])
def search_recipes(search_query: SearchQuery, db: Session = Depends(get_db)):
    recipes = RAGPipeline.search(query = search_query.query, db=db)
    return recipes