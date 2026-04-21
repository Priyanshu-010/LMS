"use client";

import { useEffect, useState } from "react";
import {API_URL} from "@/lib/api";
import CourseCard from "@/components/CourseCard";

type Course = {
  id: number;
  title: string;
  description: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    const url = search
      ? `${API_URL}/courses?search=${search}`
      : `${API_URL}/courses`;

    const res = await fetch(url);
    const data = await res.json();

    setCourses(data);
  };

  useEffect(() => {
    const fetchCourses = async () => {
    const url = search
      ? `${API_URL}/courses?search=${search}`
      : `${API_URL}/courses`;

    const res = await fetch(url);
    const data = await res.json();

    setCourses(data);
  };
    fetchCourses();
  }, [search]);

  const handleSearch = () => {
    fetchCourses();
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Courses
      </h1>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-5 rounded"
        >
          Search
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>
    </div>
  );
}