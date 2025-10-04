# Endpoints for meal logging
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import date

from ..dependencies import get_db
from ..db import models as db_models
from ..core.nutrition_engine import calculate_macro_split

router = APIRouter(
    prefix = "/dashboard",
    tags = ["Dashboard"]
)

# Pydantic Schema
class MealLog(BaseModel):
    recipe_id: int
    user_id: int

class DailySummary(BaseModel):
    target_calories: int
    target_protein: int
    target_carbs: int
    target_fats: int
    consumed_calories: float
    consumed_protein: float
    consumed_carbs: float
    consumed_fats: float

@router.post("/log")
def log_meal(meal_log: MealLog, db: Session = Depends(get_db)):
    
    user = db.query(db_models.User).filter(db_models.User.id == meal_log.user_id).first()
    recipe = db.query(db_models.Recipe).filter(db_models.Recipe.id == meal_log.recipe_id).first()

    if not user or not recipe:
        raise HTTPException(status_code=404, detail="User or Recipe not found")

    new_log = db_models.MealLog(
        owner_id = user.id,
        meal_name = recipe.name,
        calories = recipe.calories,
        protein_g=recipe.protein_pdv,
        carbs_g= recipe.carbohydrates_pdv,
        fat_g=recipe.total_fat_pdv
    )
    db.add(new_log)
    db.commit()
    return{"message": "Meal logged successfully"}

@router.get("/summary/{user_id}", response_model=DailySummary)
def get_daily_summary(user_id: int, db: Session = Depends(get_db)):
    user = db.query(db_models.User).filter(db_models.User.id == user_id).first()
    if not user or not user.goal or not user.tdee:
        raise HTTPException(status_code=404, detail="User profile is incomplete")

    targets = calculate_macro_split(tdee=user.tdee, goal=user.goal)

    today = date.today()

    consumed = db.query(
        func.sum(db_models.MealLog.calories).label("calories"),
        func.sum(db_models.MealLog.protein_g).label("protein_g"),
        func.sum(db_models.MealLog.carbs_g).label("carbs_g"),
        func.sum(db_models.MealLog.fat_g).label("fat_g")
    ).filter(
        db_models.MealLog.owner_id == user_id,
        func.date(db_models.MealLog.date) == today
    ).first()

    return DailySummary(
        target_calories=targets['total_calories'],
        target_protein=targets['protein_g'],
        target_carbs=targets['carbs_g'],
        target_fats=targets['fats_g'],
        consumed_calories=consumed.calories or 0,
        consumed_protein=consumed.protein_g or 0,
        consumed_carbs=consumed.carbs_g or 0,
        consumed_fats=consumed.fat_g or 0,
    )