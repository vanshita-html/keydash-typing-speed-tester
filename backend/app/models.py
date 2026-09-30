import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text as SQLText
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    results = relationship("Result", back_populates="user", cascade="all, delete-orphan")

class Text(Base):
    __tablename__ = "texts"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(SQLText, nullable=False)
    category = Column(String(50), index=True, nullable=False)  # easy, medium, hard, quotes
    difficulty = Column(String(50), default="medium", nullable=False)

    results = relationship("Result", back_populates="text")

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    text_id = Column(Integer, ForeignKey("texts.id"), nullable=True)
    mode = Column(String(50), nullable=False)  # e.g., "time_15", "time_30", "time_60", "time_120", "words_10", "words_25", "words_50"
    duration = Column(Float, nullable=False)  # actual duration in seconds
    wpm = Column(Float, nullable=False)
    raw_wpm = Column(Float, nullable=False)
    accuracy = Column(Float, nullable=False)  # 0 - 100 percentage
    errors = Column(Integer, nullable=False, default=0)
    consistency = Column(Float, nullable=False, default=100.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    user = relationship("User", back_populates="results")
    text = relationship("Text", back_populates="results")
