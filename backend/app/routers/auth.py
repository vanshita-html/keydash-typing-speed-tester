from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, LoginResponse, UserResponse
from ..auth import DEMO_USERNAME, DEMO_PASSWORD, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=LoginResponse)
def login(creds: LoginRequest, db: Session = Depends(get_db)):
    if creds.username != DEMO_USERNAME or creds.password != DEMO_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Hint: use 'demo' and 'typing123'."
        )
    
    # Ensure user exists in database
    user = db.query(User).filter(User.username == DEMO_USERNAME).first()
    if not user:
        user = User(username=DEMO_USERNAME)
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(data={"sub": user.username, "user_id": user.id})
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)
