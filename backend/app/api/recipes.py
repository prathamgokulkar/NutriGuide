# Endpoints for the RAG chat, recipe search, etc

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..dependencies import get_db
from ..core.rag_pipeline import rag_system

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

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    response: str

@router.post("/search", response_model=List[RecipeSchema])
def search_recipes(search_query: SearchQuery, db: Session = Depends(get_db)):
    recipes = rag_system.search_recipes(query = search_query.query, db=db)
    return recipes

@router.post("/chat", response_model=ChatResponse)
def chat_with_rag(search_query: SearchQuery, db: Session = Depends(get_db)):
    retrieved_recipes = rag_system.search(query = search_query.query, db=db)

    if not retrieved_recipes:
        return ChatResponse(response="I'm sorry, I couldn't find any recipes that match your request. Please try asking in a different way.")

    llm_response = rag_system.generate_response(query=search_query.query, context_recipes=retrieved_recipes)

    return ChatResponse(response=llm_response)