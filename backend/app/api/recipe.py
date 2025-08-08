# app/api/recipe.py
from fastapi import APIRouter, HTTPException
from app.models.recipe import QueryRequest, QueryResponse
from app.services.recipe_rag import get_recipe_suggestion

router = APIRouter()

@router.post("/query", response_model=QueryResponse)
def query_recipe(request: QueryRequest):
    try:
        return get_recipe_suggestion(request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
