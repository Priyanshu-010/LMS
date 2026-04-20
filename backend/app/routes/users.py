from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.utils.dependencies import (
    get_current_user,
    require_role
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get("/me")
def my_profile(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }


@router.get("/")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_role(["admin"])
    )
):
    users = db.query(User).all()

    return users


@router.get("/teachers-only")
def teacher_area(
    current_user: User = Depends(
        require_role(["teacher", "admin"])
    )
):
    return {
        "message": f"Welcome {current_user.name}, teacher access granted"
    }


@router.get("/students-only")
def student_area(
    current_user: User = Depends(
        require_role(["student"])
    )
):
    return {
        "message": f"Welcome {current_user.name}, student access granted"
    }