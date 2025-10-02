import pandas as pd
import chromadb
import ast  
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from tqdm import tqdm

from app.db.session import SessionLocal
from app.db.models import Recipe

DATA_FILE_PATH = "recipes.csv"
CHROMA_DB_PATH = "chroma_db"
MODEL_NAME = 'all-MiniLM-L6-v2' 
COLLECTION_NAME = "recipes"

print("Initializing models and database clients...")
model = SentenceTransformer(MODEL_NAME, device='cuda')
client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
collection = client.get_or_create_collection(name=COLLECTION_NAME)
db: Session = SessionLocal()
print("Initialization complete.")

print(f"Loading data from {DATA_FILE_PATH}...")
df = pd.read_csv(DATA_FILE_PATH)

# Data Cleaning and Preprocessing
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

print("Creating text for embeddings...")
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


# POPULATE SQLITE (Relational DB)
print("Populating SQLite database...")
db: Session = SessionLocal()
for _, row in tqdm(df.iterrows(), total=df.shape[0], desc="Populating SQLite"):
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
        protein_pdv=row['protein_pdv'],
        saturated_fat_pdv=row['saturated_fat_pdv'],
        carbohydrates_pdv=row['carbohydrates_pdv']
    )
    db.add(recipe)

print("Committing data to SQLite...")
db.commit()
db.close()
print("SQLite populated successfully.")


# Populate ChromaDB (Vector DB)
print("Generating and storing embeddings. This will take a long time...")
batch_size = 512
total_batches = len(df) // batch_size + (1 if len(df) % batch_size > 0 else 0)

for i in tqdm(range(0, len(df), batch_size), total=total_batches, desc="Embedding Batches"):
    batch_df = df.iloc[i:i+batch_size]
    
    texts = batch_df['embedding_text'].tolist()
    ids = [str(id) for id in batch_df['id'].tolist()]
    
    embeddings = model.encode(texts, show_progress_bar=False).tolist()
    
    collection.add(
        embeddings=embeddings,
        ids=ids
    )

print("Embeddings generated and stored.")