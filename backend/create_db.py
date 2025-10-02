# create_db.py
from app.db.base import Base
from app.db.session import engine
from app.db import models 
def create_database():
   
    print("Creating database and tables...")
    
    Base.metadata.create_all(bind=engine)
    
    print("Database and tables created successfully.")

if __name__ == "__main__":
    create_database()