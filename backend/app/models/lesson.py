from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    video_url = Column(String, nullable=True)
    pdf_url = Column(String, nullable=True)

    course_id = Column(Integer, ForeignKey("courses.id"))

    created_at = Column(DateTime(timezone=True), server_default=func.now())