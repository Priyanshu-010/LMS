"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        saveToken(data.access_token);
        router.push("/courses");
      } else {
        setMessage(data.detail || "Invalid login credentials");
      }
    } catch {
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-2 text-white">Welcome Back</h1>
      <p className="text-zinc-400 mb-8 text-sm">Sign in to access your dashboard.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 ml-1">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 ml-1">PASSWORD</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all text-white"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>

      {message && (
        <p className="mt-6 text-sm text-center text-red-400">
          {message}
        </p>
      )}
    </div>
  );
}