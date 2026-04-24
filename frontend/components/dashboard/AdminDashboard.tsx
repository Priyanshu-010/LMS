"use client";

import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import { AdminDashboardData } from "@/types";
import StatCard from "@/components/cards/StatCard";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTeacher, setExpandedTeacher] = useState<number | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  useEffect(() => {
    dashboardService
      .getAdminDashboard()
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
      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={data.total_users}
          icon={Users}
          color="violet"
        />
        <StatCard
          title="Teachers"
          value={data.total_teachers}
          icon={GraduationCap}
          color="blue"
        />
        <StatCard
          title="Students"
          value={data.total_students}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Courses"
          value={data.total_courses}
          icon={BookOpen}
          color="orange"
        />
      </div>

      {/* teachers */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
          <GraduationCap size={20} className="text-blue-400" />
          Teachers
        </h2>
        <div className="space-y-2">
          {data.teachers.length === 0 && (
            <p className="text-sm text-zinc-500 py-4">No teachers yet.</p>
          )}
          {data.teachers.map((t) => (
            <div
              key={t.teacher_id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedTeacher(
                    expandedTeacher === t.teacher_id ? null : t.teacher_id
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                    {t.teacher_name[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-100">
                      {t.teacher_name}
                    </p>
                    <p className="text-xs text-zinc-500">{t.teacher_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">
                    {t.total_courses} courses
                  </span>
                  {expandedTeacher === t.teacher_id ? (
                    <ChevronUp size={16} className="text-zinc-500" />
                  ) : (
                    <ChevronDown size={16} className="text-zinc-500" />
                  )}
                </div>
              </button>
              {expandedTeacher === t.teacher_id && (
                <div className="px-5 pb-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mt-3 mb-2 uppercase tracking-wider">
                    Courses
                  </p>
                  {t.courses.length === 0 ? (
                    <p className="text-sm text-zinc-600">No courses yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {t.courses.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* students */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
          <Users size={20} className="text-green-400" />
          Students
        </h2>
        <div className="space-y-2">
          {data.students.length === 0 && (
            <p className="text-sm text-zinc-500 py-4">No students yet.</p>
          )}
          {data.students.map((s) => (
            <div
              key={s.student_id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={() =>
                  setExpandedStudent(
                    expandedStudent === s.student_id ? null : s.student_id
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">
                    {s.student_name[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-zinc-100">
                      {s.student_name}
                    </p>
                    <p className="text-xs text-zinc-500">{s.student_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">
                    {s.total_enrolled} enrolled
                  </span>
                  {expandedStudent === s.student_id ? (
                    <ChevronUp size={16} className="text-zinc-500" />
                  ) : (
                    <ChevronDown size={16} className="text-zinc-500" />
                  )}
                </div>
              </button>
              {expandedStudent === s.student_id && (
                <div className="px-5 pb-4 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mt-3 mb-2 uppercase tracking-wider">
                    Enrolled Courses
                  </p>
                  {s.enrolled_courses.length === 0 ? (
                    <p className="text-sm text-zinc-600">
                      No enrollments yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {s.enrolled_courses.map((c, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}