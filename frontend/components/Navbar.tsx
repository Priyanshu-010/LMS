"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-black shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">LMS</h1>

        <div className="flex gap-6 items-center text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/my-courses">My Courses</Link>
          <Link href="/login">Login</Link>
          <Link href="/teacher/upload-lesson">Upload Lesson</Link>
          <Link href="/register">Register</Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
