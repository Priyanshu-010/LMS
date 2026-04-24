"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Trophy, TrendingUp } from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import { StudentDashboardData } from "@/types";
import StatCard from "@/components/cards/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStudentDashboard()
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

  const completed = data.courses.filter((c) => c.progress === 100).length;
  const avgProgress =
    data.courses.length > 0
      ? Math.round(
          data.courses.reduce((sum, c) => sum + c.progress, 0) /
            data.courses.length
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Enrolled Courses"
          value={data.total_enrolled}
          icon={BookOpen}
          color="violet"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={Trophy}
          color="green"
          subtitle="courses finished"
        />
        <StatCard
          title="Avg Progress"
          value={`${avgProgress}%`}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">
            My Learning
          </h2>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push("/courses")}
          >
            Browse Courses
          </Button>
        </div>

        {data.courses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Enroll in courses to start learning and track your progress here."
            action={
              <Button onClick={() => router.push("/courses")}>
                Browse Courses
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {data.courses.map((course) => (
              <div
                key={course.course_id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-medium text-zinc-100">
                      {course.course_title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      by {course.teacher_name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      router.push(`/courses/${course.course_id}/learn`)
                    }
                  >
                    Continue
                  </Button>
                </div>

                <ProgressBar value={course.progress} size="sm" />

                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-zinc-600">
                    {course.completed_lessons} / {course.total_lessons} lessons
                  </span>
                  {course.progress === 100 && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <Trophy size={11} />
                      Completed!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}