# Endpoints for user onboarding, profile, etc.

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.dependencies import get_db
from app.models.user import UserOnboarding, UserRead
from app.db import models as db_models
from app.core.nutrition_engine import calculate_nutritional_needs

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

## Schemas to validate input and output
class UserCreate(BaseModel):
    email: EmailStr
    name: str | None = None

class UserProfile(BaseModel):
    id: int
    email: EmailStr
    name: str | None = None
    onboarding_complete: bool

    class Config:
        orm_mode = True

@router.post("/{user_id}/onboarding", response_model=UserRead)
def onboard_user(user_id: int, onboarding_data: UserOnboarding, db: Session = Depends(get_db)):
    db_user = db.query(db_models.User).filter(db_models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    for field, value in onboarding_data.model_dump().items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/get-or-create", response_model=UserProfile)
def get_or_create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Finds a user by email. If they don't exist, a new profile is created.
    Returns the user's profile and their onboarding status.
    """
    db_user = db.query(db_models.User).filter(db_models.User.email == user_data.email).first()

    if db_user:
        onboarding_complete = db_user.height_cm is not None
        return UserProfile(
            id=db_user.id,
            email=db_user.email,
            name=db_user.name,
            onboarding_complete=onboarding_complete
        )
    
    new_user = db_models.User(
        email=user_data.email, 
        name=user_data.name, 
        hashed_password="SSO_USER"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserProfile(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        onboarding_complete=False
    )