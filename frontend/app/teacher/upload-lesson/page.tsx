"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function UploadLessonPage() {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();

    if (!token) {
      setMessage("Session expired. Please login first.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    if (video) formData.append("video", video);
    if (pdf) formData.append("pdf", pdf);

    try {
      const res = await fetch(`${API_URL}/lessons/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Success: Lesson uploaded successfully!");
        setTitle("");
        setCourseId("");
        setVideo(null);
        setPdf(null);
      } else {
        setMessage(data.detail || "Error: Upload failed");
      }
    } catch {
      setMessage("Error: Server communication failure");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-10">
      <div>
        <h1 className="text-4xl font-bold text-white tracking-tight">Upload Lesson</h1>
        <p className="text-zinc-500 mt-2">Add video and text resources to your course</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">COURSE ID</label>
            <input
              type="number"
              placeholder="e.g. 101"
              value={courseId}
              required
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">LESSON TITLE</label>
            <input
              type="text"
              placeholder="Introduction to..."
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">VIDEO CONTENT</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-2xl cursor-pointer bg-zinc-950/50 hover:bg-zinc-950 transition-all hover:border-blue-500/50 group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-sm text-zinc-500 font-medium group-hover:text-blue-400">
                    {video ? video.name : "Select MP4 Video"}
                  </p>
                </div>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  onChange={(e) => setVideo(e.target.files?.[0] || null)} 
                />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">DOCUMENTATION (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 mt-4"
        >
          {loading ? "Processing Upload..." : "Publish Lesson"}
        </button>

        {message && (
          <div className={`mt-6 p-4 rounded-xl border text-sm font-medium text-center ${
            message.includes("Success") ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}