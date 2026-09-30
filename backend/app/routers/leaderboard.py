from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Result, User
from ..schemas import LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])

@router.get("", response_model=List[LeaderboardEntry])
def get_leaderboard(
    mode: Optional[str] = Query(None, description="e.g. time_30, time_60, words_25"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    # Query best result per user for the given mode (or overall best)
    # Using a subquery to find max WPM per user
    subquery = db.query(
        Result.user_id,
        func.max(Result.wpm).label("max_wpm")
    )
    if mode:
        subquery = subquery.filter(Result.mode == mode)
    subquery = subquery.group_by(Result.user_id).subquery()

    query = db.query(Result, User.username).\
        join(User, Result.user_id == User.id).\
        join(
            subquery,
            (Result.user_id == subquery.c.user_id) & (Result.wpm == subquery.c.max_wpm)
        )
    
    if mode:
        query = query.filter(Result.mode == mode)

    # Order by highest WPM, then accuracy, then earlier created
    raw_results = query.order_by(Result.wpm.desc(), Result.accuracy.desc()).limit(limit).all()

    leaderboard = []
    seen_users = set()
    rank = 1

    for res, username in raw_results:
        if res.user_id in seen_users:
            continue
        seen_users.add(res.user_id)
        leaderboard.append(
            LeaderboardEntry(
                rank=rank,
                user_id=res.user_id,
                username=username,
                wpm=res.wpm,
                raw_wpm=res.raw_wpm,
                accuracy=res.accuracy,
                consistency=res.consistency,
                mode=res.mode,
                created_at=res.created_at
            )
        )
        rank += 1
        if len(leaderboard) >= limit:
            break

    return leaderboard
