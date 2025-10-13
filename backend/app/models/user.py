# Pydantic models for user data (e.g., UserCreate, UserRead)

from pydantic import BaseModel
from typing import Literal

class UserOnboarding(BaseModel):
    height_cm: float
    weight_kg: float
    age: int
    gender: Literal['male', 'female']
    activity_level: Literal['sedentary', 'light', 'moderate', 'active', 'very_active']
    goal: Literal['maintenance', 'weight_loss', 'muscle_gain']

class UserRead(BaseModel):
    id: int
    name: str
    email: str
    height_cm: float | None = None
    weight_kg: float | None = None
    age: int | None = None

    class Config:
        from_attributes = True