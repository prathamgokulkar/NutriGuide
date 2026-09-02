 # Code to create and manage database sessions(connection)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import DATABASE_URL

# Note: connect_args={"check_same_thread": False} was removed — that is a
# SQLite-only argument and is not compatible with PostgreSQL.
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # Verify connections are alive before using them
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)