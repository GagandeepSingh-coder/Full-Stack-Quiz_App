from fastapi import FastAPI

from app.db.database import Base, engine # type: ignore
from app.routes import auth, quiz, question,attempt ,student # type: ignore

from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(quiz.router)
app.include_router(question.router)
app.include_router(attempt.router)
app.include_router(student.router)  # add this line

@app.get("/")
def home():
    return {"message": "Welcome to the Quiz App API Running on FastAPI!"}

# To run the application, use the command: python -m uvicorn app.main:app --reload
 