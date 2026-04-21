"use client";

import { useEffect, useState, use } from "react"; // Import `use` from React
import {API_URL} from "@/lib/api";
import { getToken } from "@/lib/auth";

// Correctly type params as a Promise
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
  // Unwrap the params Promise using React.use()
  const { id } = use(params); // ✅ This replaces params.id
  const courseId = id;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [message, setMessage] = useState("");

  console.log(lessons)

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
      setMessage("Enrolled successfully");
    } else {
      setMessage(data.detail || "Enroll failed");
    }
  };

  if (!course) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">{course.title}</h1>
        <p className="text-gray-600 mb-5">{course.description}</p>
        <p className="text-lg font-semibold">Course ID: {course.id}</p>
        <button
          onClick={handleEnroll}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Enroll Now
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>

      <h2 className="text-2xl font-bold mb-4">Lessons</h2>
      <div className="space-y-5">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white p-5 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">{lesson.title}</h3>
            {lesson.video_url && (
              <video controls className="w-full rounded mb-3">
                <source
                  src={`http://127.0.0.1:8000/${lesson.video_url.replace(
                    "app/",
                    ""
                  )}`}
                />
              </video>
            )}
            {lesson.pdf_url && (
              <a
                href={`http://127.0.0.1:8000/${lesson.pdf_url.replace(
                  "app/",
                  ""
                )}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                Open PDF Notes
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}   