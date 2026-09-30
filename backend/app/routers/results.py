from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Result, User, Text
from ..schemas import ResultCreate, ResultResponse
from ..auth import get_current_user

router = APIRouter(prefix="/api/results", tags=["results"])

@router.post("", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    result_in: ResultCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Anti-cheat and Sanity Validation
    if result_in.wpm > 250.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid score: WPM exceeds human limits (>250 WPM)."
        )
    if result_in.raw_wpm > 300.0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid score: Raw WPM exceeds allowable limits."
        )
    if not (0.0 <= result_in.accuracy <= 100.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid accuracy: Accuracy must be between 0% and 100%."
        )
    if result_in.duration < 0.5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Test duration is too short."
        )
    if not (0.0 <= result_in.consistency <= 100.0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid consistency score."
        )

    # Validate mode structure if time mode
    if result_in.mode.startswith("time_"):
        try:
            expected_time = float(result_in.mode.split("_")[1])
            # Allow some margin (e.g., test ended slightly early or network roundtrip)
            if result_in.duration > expected_time + 5.0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Reported duration exceeds mode limit."
                )
        except (IndexError, ValueError):
            pass

    # Verify text_id if provided
    if result_in.text_id:
        text_exists = db.query(Text).filter(Text.id == result_in.text_id).first()
        if not text_exists:
            result_in.text_id = None

    new_result = Result(
        user_id=current_user.id,
        text_id=result_in.text_id,
        mode=result_in.mode,
        duration=round(result_in.duration, 2),
        wpm=round(result_in.wpm, 1),
        raw_wpm=round(result_in.raw_wpm, 1),
        accuracy=round(result_in.accuracy, 1),
        errors=result_in.errors,
        consistency=round(result_in.consistency, 1)
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    response = ResultResponse.from_orm(new_result)
    response.username = current_user.username
    return response

@router.get("/me", response_model=List[ResultResponse])
def get_my_results(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    mode: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Result).filter(Result.user_id == current_user.id)
    if mode:
        query = query.filter(Result.mode == mode)
    
    results = query.order_by(Result.created_at.desc()).offset(offset).limit(limit).all()
    
    res_list = []
    for r in results:
        item = ResultResponse.from_orm(r)
        item.username = current_user.username
        res_list.append(item)
    return res_list
