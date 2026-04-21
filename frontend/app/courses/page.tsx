"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
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
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">Explore Courses</h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 pl-4 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-zinc-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
          />
        ))}
      </div>
      
      {courses.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 text-lg">No courses found matching your search.</p>
        </div>
      )}
    </div>
  );
}