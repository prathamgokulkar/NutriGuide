from fastapi import FastAPI
from app.api.recipe import router as recipe_router

app = FastAPI()

app.include_router(recipe_router, prefix="/api/recipe", tags=["recipe"])

@app.get("/")
def root():
    return {"message": "FastAPI backend is running"}
