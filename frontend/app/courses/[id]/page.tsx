"use client";

import { useEffect, useState, use } from "react";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";

type Props = {
  params: Promise<{ id: string }>;
};

type Course = {
  id: number;
  title: string;
  description: string;
};

type Lesson = {
  id: number;
  title: string;
  video_url: string | null;
  pdf_url: string | null;
};

export default function CourseDetailsPage({ params }: Props) {
  const { id } = use(params);
  const courseId = id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await fetch(`${API_URL}/courses/${courseId}`);
        const courseData = await courseRes.json();
        setCourse(courseData);

        const lessonRes = await fetch(`${API_URL}/lessons/course/${courseId}`);
        const lessonData = await lessonRes.json();
        setLessons(lessonData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [courseId]);

  const handleEnroll = async () => {
    const token = getToken();
    if (!token) {
      setMessage("Please login as student first");
      return;
    }

    const res = await fetch(`${API_URL}/enrollments/${courseId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Enrolled successfully!");
    } else {
      setMessage(data.detail || "Enroll failed");
    }
  };

  if (!course) {
    return <div className="flex justify-center py-20"><p className="text-zinc-500 animate-pulse text-xl">Loading course details...</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl grayscale">📚</div>
        <div className="relative z-10">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">COURSE ID: {course.id}</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4 leading-tight">{course.title}</h1>
          <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl">{course.description}</p>
          
          <div className="flex items-center gap-6">
            <button
              onClick={handleEnroll}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40"
            >
              Enroll Now
            </button>
            {message && <p className={`text-sm font-medium ${message.includes("success") ? "text-green-400" : "text-yellow-500"}`}>{message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          Curriculum <span className="text-sm font-normal text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{lessons.length} Lessons</span>
        </h2>
        
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-zinc-900/50 border border-zinc-800/50 p-6 rounded-2xl hover:border-zinc-700 transition-colors">
              <h3 className="text-lg font-semibold text-zinc-100 mb-4">{lesson.title}</h3>
              
              <div className="space-y-4">
                {lesson.video_url && (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800">
                    <video controls className="w-full h-full">
                      <source
                        src={`http://127.0.0.1:8000/${lesson.video_url.replace("app/", "")}`}
                      />
                    </video>
                  </div>
                )}
                
                {lesson.pdf_url && (
                  <a
                    href={`http://127.0.0.1:8000/${lesson.pdf_url.replace("app/", "")}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20"
                  >
                    <span>📄</span> Open PDF Notes
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}