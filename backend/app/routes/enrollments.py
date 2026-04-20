from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.user import User
from app.utils.dependencies import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)


@router.post("/{course_id}")
def enroll_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["student"])
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

    existing = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Already enrolled"
        )

    enrollment = Enrollment(
        student_id=current_user.id,
        course_id=course_id
    )

    db.add(enrollment)
    db.commit()

    return {
        "message": "Enrolled successfully"
    }


@router.get("/my-courses")
def my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["student"])
    )
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id
    ).all()

    course_ids = [e.course_id for e in enrollments]

    courses = db.query(Course).filter(
        Course.id.in_(course_ids)
    ).all()

    return courses


@router.get("/")
def all_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["admin"])
    )
):
    enrollments = db.query(Enrollment).all()

    return enrollments