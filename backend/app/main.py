from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.core.database import engine, Base

from app.models import User, Course, Lesson, Enrollment

from app.routes.auth import router as auth_router
from app.routes.users import router as users_router
from app.routes.courses import router as courses_router
from app.routes.lessons import router as lessons_router
from app.routes.enrollments import router as enrollments_router

app = FastAPI(
    title="LMS Backend",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

allowed_origins = [
    "http://localhost:3000",  
    # "https://your-production-frontend.com", # Your production URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(courses_router)
app.include_router(lessons_router)
app.include_router(enrollments_router)

app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads"
)


@app.get("/")
def home():
    return {
        "message": "LMS Backend Running Successfully"
    }


@app.get("/health")
def health():
    return {"status": "ok"}