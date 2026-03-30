from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
import hashlib

from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import LoginSchema, RegisterSchema

router = APIRouter(prefix="/auth")

# JWT CONFIG
SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def md5_hash(password: str) -> str:
    """Convert plain password to MD5 hash"""
    return hashlib.md5(password.encode()).hexdigest()


def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ============================================================
# POST /auth/register
# ============================================================
@router.post("/register")
def register(user: RegisterSchema, db: Session = Depends(get_db)):
    # Check if username already exists
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(
        username=user.username,
        password=md5_hash(user.password),  # ✅ stored as MD5
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "id": new_user.id,
        "username": new_user.username,
        "role": new_user.role
    }


# ============================================================
# POST /auth/login
# ============================================================
@router.post("/login")
def login(user: LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username/password")

    # ✅ Convert entered password to MD5 and compare with DB
    if md5_hash(user.password) != db_user.password:
        raise HTTPException(status_code=400, detail="Incorrect username/password")

    token = create_token({
        "user_id": db_user.id,
        "role": db_user.role,
        "first_name": db_user.first_name,   
        "last_name":  db_user.last_name     
    })

    return {"token": token}