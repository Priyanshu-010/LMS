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
    <nav className="bg-black py-4 px-6 border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">LMS</h1>
      </div>
    </nav>
  );

  return (
    <nav className="border-b bg-black shadow-sm text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:opacity-80">
          LMS
        </Link>

        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/" className="hover:text-blue-400">Home</Link>
          <Link href="/courses" className="hover:text-blue-400">All Courses</Link>

          {user ? (
            <>
              {/* Context-Aware "My Courses" */}
              {user.role === "student" ? (
                <Link href="/my-courses" className="hover:text-blue-400">My Learning</Link>
              ) : (
                <Link href="/teacher/my-courses" className="hover:text-blue-400">My Created Courses</Link>
              )}

              {/* Teacher/Admin Restricted Tools */}
              {(user.role === "teacher" || user.role === "admin") && (
                <Link 
                  href="/teacher/upload-lesson" 
                  className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  + Upload Lesson
                </Link>
              )}

              {/* Identity & Session Control */}
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{user.role}</span>
                  <span className="font-semibold text-gray-200">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-500 border border-red-500/50 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Only visible when logged out */}
              <Link href="/login" className="hover:text-blue-400">Login</Link>
              <Link 
                href="/register" 
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
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