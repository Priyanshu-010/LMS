"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Users,
  ArrowRight,
  PlayCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { courseService } from "@/services/course.service";
import { Course } from "@/types";
import CourseCard from "@/components/cards/CourseCard";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    courseService.getAll().then((data) => setCourses(data.slice(0, 6)));
  }, []);

  return (
    <div className="space-y-20">
      {/* hero */}
      <section className="text-center pt-12 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
          <Star size={12} />
          Modern Learning Management System
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-100 mb-6 leading-tight">
          Learn without
          <span className="text-violet-400"> limits</span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Access high-quality courses, track your progress, and grow your
          skills — all in one place.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          {isAuthenticated ? (
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => router.push("/register")}>
                Get Started Free
                <ArrowRight size={18} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
            </>
          )}
          <Button
            size="lg"
            variant="ghost"
            onClick={() => router.push("/courses")}
          >
            <PlayCircle size={18} />
            Browse Courses
          </Button>
        </div>
      </section>

      {/* feature cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              color: "violet",
              title: "Rich Course Content",
              desc: "Video lessons, PDF materials, and external resources — everything in one place.",
            },
            {
              icon: GraduationCap,
              color: "blue",
              title: "Expert Teachers",
              desc: "Learn from qualified teachers. Admins curate and promote the best educators.",
            },
            {
              icon: Users,
              color: "green",
              title: "Track Your Progress",
              desc: "Mark lessons complete, submit assignments, and watch your progress grow.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4
                  ${f.color === "violet" ? "bg-violet-500/10" : ""}
                  ${f.color === "blue" ? "bg-blue-500/10" : ""}
                  ${f.color === "green" ? "bg-green-500/10" : ""}
                `}
              >
                <f.icon
                  size={22}
                  className={`
                    ${f.color === "violet" ? "text-violet-400" : ""}
                    ${f.color === "blue" ? "text-blue-400" : ""}
                    ${f.color === "green" ? "text-green-400" : ""}
                  `}
                />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* featured courses */}
      {courses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-100">
              Featured Courses
            </h2>
            <Link
              href="/courses"
              className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {!isAuthenticated && (
        <section className="text-center py-12 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <h2 className="text-2xl font-bold text-zinc-100 mb-3">
            Ready to start learning?
          </h2>
          <p className="text-zinc-500 mb-6">
            Join thousands of students already learning on LearnHub.
          </p>
          <Button size="lg" onClick={() => router.push("/register")}>
            Create Free Account
            <ArrowRight size={18} />
          </Button>
        </section>
      )}
    </div>
  );
}