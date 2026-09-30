import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed import seed_database
from .routers import auth, texts, results, stats, leaderboard

# Ensure tables are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="KeyDash API",
    description="Backend API for KeyDash Typing Speed Tester",
    version="1.0.0"
)

# Enable CORS for frontend (development and production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(texts.router)
app.include_router(results.router)
app.include_router(stats.router)
app.include_router(leaderboard.router)

@app.on_event("startup")
def on_startup():
    # Automatically seed DB if texts don't exist
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")

@app.get("/")
def root():
    return {
        "app": "KeyDash API",
        "status": "healthy",
        "docs": "/docs"
    }
