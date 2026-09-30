import random
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from ..database import get_db
from ..models import Text
from ..schemas import TextResponse

router = APIRouter(prefix="/api/texts", tags=["texts"])

@router.get("", response_model=TextResponse)
def get_random_text(
    category: Optional[str] = Query(None, description="easy, medium, hard, quotes"),
    difficulty: Optional[str] = Query(None, description="easy, medium, hard"),
    mode: Optional[str] = Query(None, description="time_15, time_30, words_25, etc."),
    db: Session = Depends(get_db)
):
    query = db.query(Text)
    if category:
        query = query.filter(Text.category == category.lower())
    if difficulty:
        query = query.filter(Text.difficulty == difficulty.lower())

    text = query.order_by(func.random()).first()
    
    # Fallback to any random text if filter has no matches
    if not text:
        text = db.query(Text).order_by(func.random()).first()

    if not text:
        # Fallback default if DB hasn't been seeded yet
        return TextResponse(
            id=0,
            content="The quick brown fox jumps over the lazy dog. Practice typing every day to improve your speed and accuracy.",
            category="medium",
            difficulty="medium"
        )

    return TextResponse.from_orm(text)

@router.get("/all", response_model=List[TextResponse])
def get_all_texts(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Text)
    if category:
        query = query.filter(Text.category == category.lower())
    return query.limit(100).all()
