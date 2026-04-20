"use client";

import { useState } from "react";
import API_URL from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function UploadLessonPage() {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(
    null
  );
  const [pdf, setPdf] = useState<File | null>(
    null
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const token = getToken();

    if (!token) {
      setMessage("Login first");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);

    if (video) {
      formData.append("video", video);
    }

    if (pdf) {
      formData.append("pdf", pdf);
    }

    const res = await fetch(
      `${API_URL}/lessons/${courseId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage("Lesson uploaded");
      setTitle("");
      setCourseId("");
    } else {
      setMessage(
        data.detail || "Upload failed"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">
        Upload Lesson
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="number"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) =>
            setCourseId(e.target.value)
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full border p-3 rounded"
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) =>
            setVideo(
              e.target.files?.[0] || null
            )
          }
        />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setPdf(
              e.target.files?.[0] || null
            )
          }
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded">
          Upload Lesson
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}