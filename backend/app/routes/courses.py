from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.course import Course
from app.models.user import User
from app.schemas.course import CourseCreate, CourseUpdate
from app.utils.dependencies import require_role

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


@router.post("/")
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["teacher", "admin"])
    )
):
    course = Course(
        title=data.title,
        description=data.description,
        teacher_id=current_user.id
    )

    db.add(course)
    db.commit()
    db.refresh(course)

    return {
        "message": "Course created",
        "course_id": course.id
    }


@router.get("/")
def get_courses(
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Course)

    if search:
        query = query.filter(
            or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%")
            )
        )

    courses = query.all()

    result = []

    for course in courses:
        result.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "teacher_id": course.teacher_id
        })

    return result


@router.get("/{course_id}")
def get_single_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "teacher_id": course.teacher_id
    }


@router.put("/{course_id}")
def update_course(
    course_id: int,
    data: CourseUpdate,
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

    # ownership check
    if (
        current_user.role != "admin"
        and course.teacher_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    course.title = data.title
    course.description = data.description

    db.commit()

    return {"message": "Course updated"}


@router.delete("/{course_id}")
def delete_course(
    course_id: int,
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

    # ownership check
    if (
        current_user.role != "admin"
        and course.teacher_id != current_user.id
    ):
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    db.delete(course)
    db.commit()

    return {"message": "Course deleted"}