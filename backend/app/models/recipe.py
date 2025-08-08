from pydantic import BaseModel

class RecipeQuery(BaseModel):
    query: str
