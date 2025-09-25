from fastapi import FastAPI

# Create the FastAPI app instance
app = FastAPI(title="NutriGuide API")

@app.get("/", tags=["Root"])
def read_root():
    """A simple endpoint to confirm the API is running."""
    return {"message": "Welcome to the NutriGuide API!"}

# In the future, you will include your routers here
# from .api import users, recipes, tracking
# app.include_router(users.router)
# app.include_router(recipes.router)
# app.include_router(tracking.router)