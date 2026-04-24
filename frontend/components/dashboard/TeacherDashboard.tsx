"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, PlaySquare, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import { TeacherDashboardData } from "@/types";
import StatCard from "@/components/cards/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

export default function TeacherDashboard() {
  const router = useRouter();
  const [data, setData] = useState<TeacherDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  useEffect(() => {
    dashboardService
      .getTeacherDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="My Courses"
          value={data.total_courses}
          icon={BookOpen}
          color="violet"
        />
        <StatCard
          title="Total Lessons"
          value={data.total_lessons}
          icon={PlaySquare}
          color="blue"
        />
        <StatCard
          title="Enrolled Students"
          value={data.total_enrolled_students}
          icon={Users}
          color="green"
        />
      </div>

      {/* quick action */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">My Courses</h2>
        <Button
          size="sm"
          onClick={() => router.push("/teacher/courses/create")}
        >
          <Plus size={15} />
          New Course
        </Button>
      </div>

      {/* courses list */}
      <div className="space-y-3">
        {data.courses.length === 0 && (
          <p className="text-sm text-zinc-500 py-4">
            You have not created any courses yet.
          </p>
        )}
        {data.courses.map((course) => (
          <div
            key={course.course_id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              onClick={() =>
                setExpandedCourse(
                  expandedCourse === course.course_id
                    ? null
                    : course.course_id
                )
              }
            >
              <div className="text-left">
                <p className="font-medium text-zinc-100">
                  {course.course_title}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-zinc-500">
                    {course.total_lessons} lessons
                  </span>
                  <span className="text-xs text-zinc-500">
                    {course.total_enrolled} students
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/teacher/courses/${course.course_id}/lessons/create`);
                  }}
                >
                  <Plus size={13} />
                  Lesson
                </Button>
                {expandedCourse === course.course_id ? (
                  <ChevronUp size={16} className="text-zinc-500" />
                ) : (
                  <ChevronDown size={16} className="text-zinc-500" />
                )}
              </div>
            </button>

            {expandedCourse === course.course_id && (
              <div className="px-5 pb-5 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 mt-4 mb-3 uppercase tracking-wider">
                  Student Progress
                </p>
                {course.students.length === 0 ? (
                  <p className="text-sm text-zinc-600">
                    No students enrolled yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {course.students.map((s) => (
                      <div key={s.student_id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-zinc-300">
                            {s.student_name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {s.progress}%
                          </span>
                        </div>
                        <ProgressBar
                          value={s.progress}
                          showLabel={false}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}