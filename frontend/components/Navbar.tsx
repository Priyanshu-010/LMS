"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) return (
    <nav className="bg-black py-4 px-6 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">LMS</h1>
      </div>
    </nav>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-lg text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          LMS
        </Link>

        <div className="flex gap-8 items-center text-sm font-medium">
          <Link href="/" className="text-zinc-400 hover:text-blue-400 transition-colors">Home</Link>
          <Link href="/courses" className="text-zinc-400 hover:text-blue-400 transition-colors">All Courses</Link>

          {user ? (
            <>
              {/* Context-Aware "My Courses" */}
              {user.role === "student" ? (
                <Link href="/my-courses" className="text-zinc-400 hover:text-blue-400 transition-colors">My Learning</Link>
              ) : (
                <Link href="/teacher/my-courses" className="text-zinc-400 hover:text-blue-400 transition-colors">My Created Courses</Link>
              )}

              {/* Teacher/Admin Restricted Tools */}
              {(user.role === "teacher" || user.role === "admin") && (
                <Link 
                  href="/teacher/upload-lesson" 
                  className="bg-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                >
                  + Upload Lesson
                </Link>
              )}

              {/* Identity & Session Control */}
              <div className="flex items-center gap-5 ml-4 pl-6 border-l border-white/10">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{user.role}</span>
                  <span className="font-semibold text-zinc-100">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">Login</Link>
              <Link 
                href="/register" 
                className="bg-white text-black px-5 py-2 rounded-lg font-bold hover:bg-zinc-200 transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}