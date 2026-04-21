"use client";

import { useEffect, useState } from "react";
import {API_URL} from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
      const fetchCourses = async () => {
    const token = getToken();

    if (!token) {
      setMessage("Please login first");
      return;
    }

    const res = await fetch(
      `${API_URL}/enrollments/my-courses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setCourses(data);
    } else {
      setMessage(data.detail || "Error");
    }
  };
    fetchCourses();
  }, []);



  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        My Courses
      </h1>

      {message && (
        <p className="mb-4 text-red-500">
          {message}
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
          >
            <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg">
              <h2 className="text-xl font-bold text-blue-600 mb-2">
                {course.title}
              </h2>

              <p className="text-gray-600">
                {course.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}