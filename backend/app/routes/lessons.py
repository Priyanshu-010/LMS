import os
import shutil
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.lesson import Lesson
from app.models.course import Course
from app.models.user import User
from app.utils.dependencies import require_role

router = APIRouter(
    prefix="/lessons",
    tags=["Lessons"]
)

VIDEO_FOLDER = "app/uploads/videos"
PDF_FOLDER = "app/uploads/pdfs"


def unique_filename(filename: str):
    ext = filename.split(".")[-1]
    return f"{uuid.uuid4()}.{ext}"


@router.post("/{course_id}")
def create_lesson(
    course_id: int,
    title: str = Form(...),
    video: UploadFile = File(None),
    pdf: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["teacher", "admin"])
    )
):
    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    video_path = None
    pdf_path = None

    if video:
        video_name = unique_filename(video.filename)
        video_path = f"{VIDEO_FOLDER}/{video_name}"

        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)

    if pdf:
        pdf_name = unique_filename(pdf.filename)
        pdf_path = f"{PDF_FOLDER}/{pdf_name}"

        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(pdf.file, buffer)

    lesson = Lesson(
        title=title,
        video_url=video_path,
        pdf_url=pdf_path,
        course_id=course_id
    )

    db.add(lesson)
    db.commit()

    return {
        "message": "Lesson created successfully"
    }


@router.get("/course/{course_id}")
def get_course_lessons(
    course_id: int,
    db: Session = Depends(get_db)
):
    lessons = db.query(Lesson).filter(
        Lesson.course_id == course_id
    ).all()

    return lessons