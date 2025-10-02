from .base import Base
from sqlalchemy import Column, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Integer, index=True)
    minutes = Column(Integer)
    tags = Column(Text, nullable=True)
    n_steps = Column(Integer)
    n_ingredients = Column(Integer)
    ingredients = Column(Text)
    description = Column(Text, nullable=True)
    steps = Column(Text)

    calories = Column(Float, nullable=True)
    total_fat_pdv = Column(Float, nullable=True)
    sugar_pdv = Column(Float, nullable=True)
    sodium_pdv = Column(Float, nullable=True)
    protein_pdv = Column(Float, nullable=True)
    saturated_fat_pdv = Column(Float, nullable=True)
    carbohydrates_pdv = Column(Float, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    activity_level = Column(String, nullable=True)
    goal = Column(String, nullable=True)
