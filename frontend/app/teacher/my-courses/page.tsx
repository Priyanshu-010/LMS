"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
}

export default function MyCreatedCourses() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await apiFetch("/courses/my-created");
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        } else {
          setError("Failed to load your courses.");
        }
      } catch (err) {
        setError("An error occurred while fetching courses.");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === "teacher" || user.role === "admin")) {
      fetchMyCourses();
    }
  }, [user]);

  if (authLoading || loading) return <div className="text-center py-10">Loading Dashboard...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
        <Link 
          href="/courses/create" 
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-20 text-center">
          <p className="text-gray-500 text-lg">You have not published any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <CourseCard course={course} />
              <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
                <Link 
                  href={`/teacher/edit-course/${course.id}`}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Edit Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}