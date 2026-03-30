from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Quiz, Attempt

router = APIRouter(prefix="/student")


# GET /student/quizzes?user_id={user_id}
# Returns all quizzes with this student's attempt status
# Screen 3.2.2 — Student Dashboard

@router.get("/quizzes")
def get_student_quizzes(user_id: int, db: Session = Depends(get_db)):
    """
    Returns all quizzes with the student's attempt status:
    - None        → not started  → show Start button
    - in_progress → started      → show Resume button
    - completed   → finished     → show View Score button
    """
    quizzes = db.query(Quiz).all()

    result = []
    for quiz in quizzes:
        # Check if this student has an attempt for this quiz
        attempt = (
            db.query(Attempt)
            .filter(Attempt.quiz_id == quiz.id, Attempt.user_id == user_id)
            .first()
        )

        result.append({
            "id": quiz.id,
            "title": quiz.title,
            "total_marks": quiz.total_marks,
            "duration": quiz.duration,
            "attempt_id": attempt.id if attempt else None,
            "attempt_status": attempt.status if attempt else None,
            # None = not started, "in_progress", "completed"
        })

    return result