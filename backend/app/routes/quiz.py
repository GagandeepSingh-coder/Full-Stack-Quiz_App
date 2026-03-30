from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Quiz, QuizQuestion, Attempt, User
from app.schemas.schemas import QuizCreate

router = APIRouter(prefix="/quiz")


# ============================================================
# POST /quiz/ — Create quiz with questions
# ============================================================
@router.post("/")
def create_quiz(data: dict, db: Session = Depends(get_db)):
    print("🔥 Incoming Data:", data)

    new_quiz = Quiz(
        title=data["title"],
        total_marks=data["total_marks"],
        duration=data["duration"]
    )
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)

    for q in data["questions"]:
        print("👉 Question:", q)
        qq = QuizQuestion(
            quiz_id=new_quiz.id,
            question_id=int(q["question_id"]),
            marks=int(q["marks"]),
            question_order=int(q["order"])  # ✅ fixed
        )
        db.add(qq)

    db.commit()
    return {"message": "Quiz created successfully", "quiz_id": new_quiz.id}


# ============================================================
# GET /quiz/ — Get all quizzes
# ============================================================
@router.get("/")
def get_quiz(db: Session = Depends(get_db)):
    return db.query(Quiz).all()


# ============================================================
# GET /quiz/{quiz_id} — Get single quiz
# ============================================================
@router.get("/{quiz_id}")
def get_single_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


# ============================================================
# GET /quiz/{quiz_id}/participants — Screen 3.1.5
# ============================================================
@router.get("/{quiz_id}/participants")
def get_participants(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    attempts = db.query(Attempt).filter(Attempt.quiz_id == quiz_id).all()
    if not attempts:
        return []

    result = []
    for attempt in attempts:
        user = db.query(User).filter(User.id == attempt.user_id).first()
        result.append({
            "attempt_id": attempt.id,
            "user_id": attempt.user_id,
            "username": user.username if user else "Unknown",
            "score": attempt.score if attempt.status == "completed" else None,
            "status": attempt.status,
        })

    return result