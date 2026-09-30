import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TextResponse(BaseModel):
    id: int
    content: str
    category: str
    difficulty: str

    class Config:
        from_attributes = True

class ResultCreate(BaseModel):
    text_id: Optional[int] = None
    mode: str = Field(..., description="e.g. time_15, time_30, time_60, words_25")
    duration: float = Field(..., ge=0.5, le=600.0)
    wpm: float = Field(..., ge=0.0, le=250.0)
    raw_wpm: float = Field(..., ge=0.0, le=300.0)
    accuracy: float = Field(..., ge=0.0, le=100.0)
    errors: int = Field(0, ge=0)
    consistency: float = Field(100.0, ge=0.0, le=100.0)

class ResultResponse(BaseModel):
    id: int
    user_id: int
    username: Optional[str] = None
    text_id: Optional[int] = None
    mode: str
    duration: float
    wpm: float
    raw_wpm: float
    accuracy: float
    errors: int
    consistency: float
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ModeBest(BaseModel):
    mode: str
    wpm: float
    accuracy: float
    created_at: datetime.datetime

class StatsResponse(BaseModel):
    best_wpm: float
    avg_wpm: float
    avg_accuracy: float
    total_tests: int
    tests_this_week: int
    streak_days: int
    mode_bests: Dict[str, float] = {}

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    username: str
    wpm: float
    raw_wpm: float
    accuracy: float
    consistency: float
    mode: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True
