import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import Result, User
from ..schemas import StatsResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/me", response_model=StatsResponse)
def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(Result).filter(Result.user_id == current_user.id).order_by(Result.created_at.desc()).all()
    
    if not results:
        return StatsResponse(
            best_wpm=0.0,
            avg_wpm=0.0,
            avg_accuracy=0.0,
            total_tests=0,
            tests_this_week=0,
            streak_days=0,
            mode_bests={}
        )

    total_tests = len(results)
    best_wpm = max(r.wpm for r in results)
    avg_wpm = round(sum(r.wpm for r in results) / total_tests, 1)
    avg_accuracy = round(sum(r.accuracy for r in results) / total_tests, 1)

    # Tests this week
    now = datetime.datetime.utcnow()
    one_week_ago = now - datetime.timedelta(days=7)
    tests_this_week = sum(1 for r in results if r.created_at >= one_week_ago)

    # Calculate streak (consecutive days with at least 1 test)
    # Collect unique test dates (YYYY-MM-DD)
    test_dates = sorted(list({r.created_at.date() for r in results}), reverse=True)
    today = now.date()
    yesterday = today - datetime.timedelta(days=1)

    streak_days = 0
    if test_dates:
        # Check if the streak is active (today or yesterday has a test)
        if test_dates[0] == today or test_dates[0] == yesterday:
            expected_date = test_dates[0]
            for d in test_dates:
                if d == expected_date:
                    streak_days += 1
                    expected_date -= datetime.timedelta(days=1)
                else:
                    break

    # Mode bests
    mode_bests = {}
    for r in results:
        if r.mode not in mode_bests or r.wpm > mode_bests[r.mode]:
            mode_bests[r.mode] = r.wpm

    return StatsResponse(
        best_wpm=round(best_wpm, 1),
        avg_wpm=avg_wpm,
        avg_accuracy=avg_accuracy,
        total_tests=total_tests,
        tests_this_week=tests_this_week,
        streak_days=streak_days,
        mode_bests=mode_bests
    )
