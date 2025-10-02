from app.db.session import SessionLocal
from app.db.models import Recipe

db = SessionLocal()

# Query the first 5 recipes from the database
recipe_count = db.query(Recipe).count()
first_recipe = db.query(Recipe).first()

print(f"Found {recipe_count} recipes in the database.")

if first_recipe:
    print("\n--- Example of the first recipe ---")
    print(f"ID: {first_recipe.id}")
    print(f"Name: {first_recipe.name}")
    print(f"Minutes: {first_recipe.minutes}")

db.close()