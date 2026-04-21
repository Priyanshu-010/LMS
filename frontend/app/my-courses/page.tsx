"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
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

      const res = await fetch(`${API_URL}/enrollments/my-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      } else {
        setMessage(data.detail || "Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">My Learning</h1>
        <p className="text-zinc-500 text-lg">Continue where you left off.</p>
      </div>

      {message && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-center font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col h-full shadow-lg">
              <div className="mb-4 text-2xl group-hover:scale-110 transition-transform duration-300 origin-left">📖</div>
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {course.title}
              </h2>
              <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed mb-6">
                {course.description}
              </p>
              <div className="mt-auto pt-4 border-t border-zinc-800 text-xs font-bold text-blue-500 uppercase tracking-widest">
                Resume Course →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && !message && (
        <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 text-lg mb-6">You haven&apos;t enrolled in any courses yet.</p>
          <Link href="/courses" className="bg-zinc-100 text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-all">
            Browse All Courses
          </Link>
        </div>
      )}
    </div>
  );
}