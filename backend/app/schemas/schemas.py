from pydantic import BaseModel
from typing import List, Optional

class LoginSchema(BaseModel):
    username: str
    password: str

class RegisterSchema(BaseModel):
    username: str
    password: str
    role: str  # "admin" or "student"

class QuizCreate(BaseModel):
    title: str
    total_marks: int
    duration: int

class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    marks: int

class AnswerSchema(BaseModel):
    question_id: int
    selected_option: str

# NEW: Report Schemas
class QuestionReport(BaseModel):
    order: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    selected_option: Optional[str]
    marks: int
    marks_earned: int

class AttemptReport(BaseModel):
    username: str
    quiz_title: str
    num_questions: int
    total_marks: int
    user_score: int
    questions: List[QuestionReport]
