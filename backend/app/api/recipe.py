from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def get_recipe():
    return {"message": "Recipe endpoint working"}
