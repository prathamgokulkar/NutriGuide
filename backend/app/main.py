from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import users
from app.api import recipes

app = FastAPI(title="NutriGuide API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the NutriGuide API!"}


app.include_router(users.router)

app.include_router(recipes.router)
# app.include_router(tracking.router)
