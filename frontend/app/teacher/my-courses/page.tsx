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
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === "teacher" || user.role === "admin")) {
      fetchMyCourses();
    }
  }, [user]);

  if (authLoading || loading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <p className="text-zinc-500 animate-pulse font-medium">Loading Instructor Dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
      {error}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Instructor Dashboard</h1>
          <p className="text-zinc-500 mt-1 font-medium">Manage and monitor your published content</p>
        </div>
        <Link 
          href="/courses/create" 
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          + Create New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl p-24 text-center">
          <div className="text-4xl mb-4 opacity-20">📂</div>
          <p className="text-zinc-500 text-lg">You have not published any courses yet.</p>
          <Link href="/courses/create" className="text-blue-500 hover:underline mt-2 inline-block font-medium">
            Click here to get started
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group transition-all duration-300 hover:border-zinc-700">
              <div className="flex-grow">
                <CourseCard course={course} />
              </div>
              <div className="p-4 bg-zinc-950/50 border-t border-zinc-800/50 flex justify-end">
                <Link 
                  href={`/teacher/edit-course/${course.id}`}
                  className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest px-4 py-2"
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