from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.models import (
    Attempt, Response, Question, QuizQuestion, Quiz, User
)
from app.schemas.schemas import AnswerSchema, AttemptReport, QuestionReport

router = APIRouter(prefix="/attempt")

# ============================================================
# POST /attempt/start/{quiz_id}?user_id={user_id}
# ============================================================
@router.post("/start/{quiz_id}")
def start_quiz(
    quiz_id: int, 
    user_id: int = Query(..., description="User ID from frontend token"),
    db: Session = Depends(get_db)
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    existing = (
        db.query(Attempt)
        .filter(Attempt.quiz_id == quiz_id, Attempt.user_id == user_id)
        .first()
    )

    if existing:
        if existing.status == "completed":
            raise HTTPException(status_code=400, detail="Quiz already completed")
        return {
            "id": existing.id,
            "time_left": quiz.duration * 60,
            "status": "resumed"
        }

    new_attempt = Attempt(user_id=user_id, quiz_id=quiz_id, status="in_progress")
    db.add(new_attempt)
    db.commit()
    db.refresh(new_attempt)

    return {
        "id": new_attempt.id,
        "time_left": quiz.duration * 60,
        "status": "started"
    }

# ============================================================
# GET /attempt/{attempt_id}/questions
# ============================================================
@router.get("/{attempt_id}/questions")
def get_attempt_questions(attempt_id: int, db: Session = Depends(get_db)):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    quiz_questions = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.quiz_id == attempt.quiz_id)
        .order_by(QuizQuestion.question_order)
        .all()
    )

    if not quiz_questions:
        raise HTTPException(status_code=404, detail="No questions found")

    responses = db.query(Response).filter(Response.attempt_id == attempt_id).all()
    response_map = {r.question_id: r.selected_option for r in responses}

    result = []
    for qq in quiz_questions:
        question = db.query(Question).filter(Question.id == qq.question_id).first()
        if question:
            result.append({
                "id": question.id,
                "question_text": question.question_text,
                "option_a": question.option_a,
                "option_b": question.option_b,
                "option_c": question.option_c,
                "option_d": question.option_d,
                "order": qq.question_order,
                "marks": qq.marks,
                "selected_option": response_map.get(question.id)
            })

    return result

# ============================================================
# POST /attempt/{attempt_id}/answer
# ============================================================
@router.post("/{attempt_id}/answer")
def submit_answer(attempt_id: int, answer: AnswerSchema, db: Session = Depends(get_db)):
    existing = (
        db.query(Response)
        .filter(
            Response.attempt_id == attempt_id,
            Response.question_id == answer.question_id
        )
        .first()
    )

    if existing:
        existing.selected_option = answer.selected_option
        db.commit()
        return {"msg": "Answer updated"}

    r = Response(
        attempt_id=attempt_id,
        question_id=answer.question_id,
        selected_option=answer.selected_option
    )
    db.add(r)
    db.commit()
    return {"msg": "Answer saved"}

# ============================================================
# POST /attempt/{attempt_id}/finish
# ============================================================
@router.post("/{attempt_id}/finish")
def finish_attempt(attempt_id: int, db: Session = Depends(get_db)):
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    responses = db.query(Response).filter(Response.attempt_id == attempt_id).all()
    score = 0

    for r in responses:
        qq = db.query(QuizQuestion).filter(
            QuizQuestion.quiz_id == attempt.quiz_id,
            QuizQuestion.question_id == r.question_id
        ).first()

        question = db.query(Question).filter(Question.id == r.question_id).first()

        if question and qq and r.selected_option == question.correct_option:
            score += qq.marks

    attempt.score = score
    attempt.status = "completed"
    db.commit()

    return {"score": score}

# ============================================================
# ✅ NEW: GET /attempt/{attempt_id}/report - Student Quiz Report
# ============================================================
@router.get("/{attempt_id}/report")
def get_attempt_report(attempt_id: int, db: Session = Depends(get_db)):
    # Get attempt and validate
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    if attempt.status != "completed":
        raise HTTPException(status_code=400, detail="Attempt must be completed to view report")
    
    # Get user and quiz info
    user = db.query(User).filter(User.id == attempt.user_id).first()
    quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
    
    # Get all responses for this attempt
    responses = db.query(Response).filter(Response.attempt_id == attempt_id).all()
    response_map = {r.question_id: r.selected_option for r in responses}
    
    # Get quiz questions with order
    quiz_questions = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.quiz_id == attempt.quiz_id)
        .order_by(QuizQuestion.question_order)
        .all()
    )
    
    questions_data = []
    total_questions = 0
    user_score = 0
    
    for qq in quiz_questions:
        total_questions += 1
        question = db.query(Question).filter(Question.id == qq.question_id).first()
        if question:
            selected = response_map.get(question.id)
            marks_earned = qq.marks if selected == question.correct_option else 0
            if marks_earned > 0:
                user_score += marks_earned
            
            questions_data.append({
                "order": qq.question_order,
                "question_text": question.question_text,
                "option_a": question.option_a,
                "option_b": question.option_b,
                "option_c": question.option_c,
                "option_d": question.option_d,
                "correct_option": question.correct_option,
                "selected_option": selected,
                "marks": qq.marks,
                "marks_earned": marks_earned
            })
    
    return AttemptReport(
        username=user.username if user else "Unknown",
        quiz_title=quiz.title if quiz else "Unknown",
        num_questions=total_questions,
        total_marks=quiz.total_marks if quiz else 0,
        user_score=attempt.score,
        questions=questions_data
    )
