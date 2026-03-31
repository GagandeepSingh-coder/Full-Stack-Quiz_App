from sqlalchemy import Column, Integer, String, ForeignKey, Text, UniqueConstraint
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    password = Column(String(255))
    role = Column(String(20))  # admin or student
    first_name = Column(String(50), nullable=False, default="")
    last_name = Column(String(50), nullable=False, default="")



class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    total_marks = Column(Integer)
    duration = Column(Integer)  # in minutes



class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text)
    option_a = Column(String(255))
    option_b = Column(String(255))
    option_c = Column(String(255))
    option_d = Column(String(255))
    correct_option = Column(String(1))  # 'A', 'B', 'C', or 'D'



class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    marks = Column(Integer)
    question_order = Column(Integer) 


class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer, default=0)
    status = Column(String(20), default="in_progress")
    # status can be "in_progress" or "completed"
    # a student can have only one attempt per quiz, so we add a unique constraint on (user_id, quiz_id)
    __table_args__ = (
        UniqueConstraint('user_id', 'quiz_id', name='unique_user_quiz'),
    )


class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_option = Column(String(1))  # 'A', 'B', 'C', or 'D'