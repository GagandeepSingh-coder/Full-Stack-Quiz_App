from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Question
from app.schemas.schemas import QuestionCreate

router=APIRouter(prefix="/question")

@router.post("/")
def create_question(q: QuestionCreate, db: Session = Depends(get_db)):
    question = Question(**q.dict())
    db.add(question)
    db.commit()
    # db.refresh(question)
    return question

@router.get("/")
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()