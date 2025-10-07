import pandas as pd
import ast
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from tqdm import tqdm
import os
from pinecone import Pinecone, ServerlessSpec 

from app.db.session import SessionLocal
from app.db.models import Recipe

DATA_FILE_PATH = "recipes.csv"
MODEL_NAME = 'all-MiniLM-L6-v2'
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT")
PINECONE_INDEX_NAME = "nutriguide"

print("Initializing Pinecone client...")
from pinecone import Pinecone

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index_name = "intelliagent-index"

if index_name not in pc.list_indexes().names():
    print(f"Creating new Pinecone index: {index_name}")
    pc.create_index(
        name=index_name,
        dimension=384,
        metric='cosine',
        spec=ServerlessSpec(
            cloud='aws',
            region='us-east-1'
        )
    )

index = pc.Index(index_name)

print("Pinecone initialized.")
print("Initialization complete.")


print(f"Loading data from {DATA_FILE_PATH}...")
df = pd.read_csv(DATA_FILE_PATH)

columns_to_keep = [
    'id', 'name', 'minutes', 'tags', 'n_steps', 'n_ingredients', 
    'description', 'ingredients', 'nutrition', 'steps'
]
df = df[columns_to_keep]

def parse_nutrition(nutrition_str):
    try:
        values = ast.literal_eval(nutrition_str)
        while len(values) < 7:
            values.append(None)
        return pd.Series(values[:7], index=['calories', 'total_fat_pdv', 'sugar_pdv', 'sodium_pdv', 'protein_pdv', 'saturated_fat_pdv', 'carbohydrates_pdv'])
    except (ValueError, SyntaxError):
        return pd.Series([None]*7, index=['calories', 'total_fat_pdv', 'sugar_pdv', 'sodium_pdv', 'protein_pdv', 'saturated_fat_pdv', 'carbohydrates_pdv'])

nutrition_df = df['nutrition'].apply(parse_nutrition)
df = pd.concat([df.drop('nutrition', axis=1), nutrition_df], axis=1)

def clean_tags(tags_str):
    try:
        return tags_str.replace("[", "").replace("]", "").replace("'", "").replace("-", " ").replace(", ", " ")
    except AttributeError:
        return ""

df['embedding_text'] = df['name'].fillna('') + '. Tags: ' + \
                       df['tags'].apply(clean_tags).fillna('') + '. Description: ' + \
                       df['description'].fillna('') + '. Ingredients: ' + \
                       df['ingredients'].str.replace(r'[\[\]\']', '', regex=True).fillna('')
print("Data loaded and preprocessed.")


print("Populating PostgreSQL database...")
for _, row in tqdm(df.iterrows(), total=df.shape[0], desc="Populating PostgreSQL"):
    recipe = Recipe(**row.to_dict())

print("Populating PostgreSQL database...")
db: Session = SessionLocal()
for _, row in tqdm(df.iterrows(), total=df.shape[0], desc="Populating PostgreSQL"):
   
    recipe = Recipe(
        id=row['id'],
        name=row['name'],
        minutes=row['minutes'],
        tags=row['tags'],
        n_steps=row['n_steps'],
        n_ingredients=row['n_ingredients'],
        ingredients=row['ingredients'],
        description=row['description'],
        steps=row['steps'],
        calories=row['calories'],
        total_fat_pdv=row['total_fat_pdv'],
        sugar_pdv=row['sugar_pdv'],
        sodium_pdv=row['sodium_pdv'],
        protein_pdv=row['protein_pdd'],
        saturated_fat_pdv=row['saturated_fat_pdv'],
        carbohydrates_pdv=row['carbohydrates_pdv']
    )
    db.add(recipe)

print("Committing data to PostgreSQL...")
db.commit()
db.close()
print("PostgreSQL populated successfully.")
print("\n--- Data migration complete! ---")