# Endpoints for the RAG chat, recipe search, etc

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from uuid import uuid4

from ..dependencies import get_db
from ..core.rag_pipeline import rag_system
from ..db import models as db_models

router = APIRouter(
    prefix="/recipes",
    tags=["recipes"],
)

class ChatQuery(BaseModel):
    query: str
    user_id: int
    session_id: str | None = None 

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
def chat_with_rag(chat_query: ChatQuery, db: Session = Depends(get_db)):
    user_id = chat_query.user_id
    session_id = chat_query.session_id or str(uuid4()) # Create new session if one isn't provided

    # Fetch the user to get their goal
    user = db.query(db_models.User).filter(db_models.User.id == user_id).first()
    if not user or not user.goal:
        raise HTTPException(status_code=404, detail="User or user goal not found. Please complete onboarding.")

    # Save the user's message to history
    user_message = db_models.ChatHistory(user_id=user_id, session_id=session_id, sender='user', message=chat_query.query)
    db.add(user_message)
    db.commit()

    # Retrieve recent chat history
    chat_history = db.query(db_models.ChatHistory).filter(
        db_models.ChatHistory.session_id == session_id
    ).order_by(db_models.ChatHistory.timestamp.desc()).limit(10).all()
    chat_history.reverse()

    retrieved_recipes = rag_system.search_recipes(query=chat_query.query, db=db)
    
    # Generate the personalized, history-aware response
    llm_response = rag_system.generate_response(
        query=chat_query.query, 
        context_recipes=retrieved_recipes,
        user_goal=user.goal,
        chat_history=chat_history
    )
    
    bot_message = db_models.ChatHistory(user_id=user_id, session_id=session_id, sender='bot', message=llm_response)
    db.add(bot_message)
    db.commit()

    return ChatResponse(response=llm_response)

@router.get("/{recipe_id}", response_model=RecipeSchema)
def get_recipe_by_id(recipe_id: int, db: Session = Depends(get_db)):
    
    recipe = db.query(db_models.Recipe).filter(db_models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe