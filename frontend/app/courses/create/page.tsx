"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiFetch("/courses/", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        router.push("/teacher/my-courses");
      } else {
        alert("Failed to create course. Please try again.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-2 text-white">Create New Course</h1>
      <p className="text-zinc-500 mb-10 text-lg">Share your knowledge with the world.</p>
      
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-300 ml-1 uppercase tracking-wider">Course Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-zinc-600"
            placeholder="e.g., Advanced React Patterns"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-300 ml-1 uppercase tracking-wider">Description</label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white placeholder:text-zinc-600 resize-none"
            placeholder="What will students learn in this course?"
          />
        </div>

        <div className="flex gap-5 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-4 border border-zinc-800 text-zinc-400 rounded-2xl hover:bg-zinc-800 hover:text-white transition-all font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-900/30 disabled:bg-blue-800/50"
          >
            {loading ? "Creating..." : "Publish Course"}
          </button>
        </div>
      </form>
    </div>
  );
}