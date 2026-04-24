"use client";

import { useRouter } from "next/navigation";
import { BookOpen, User, Calendar } from "lucide-react";
import { Course } from "@/types";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  showTeacher?: boolean;
  actionSlot?: React.ReactNode;
}

export default function CourseCard({
  course,
  showTeacher = true,
  actionSlot,
}: CourseCardProps) {
  const router = useRouter();

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-200 hover:shadow-lg hover:shadow-black/30 flex flex-col">
      {/* thumbnail */}
      <div
        className="relative h-44 bg-zinc-800 overflow-hidden cursor-pointer"
        onClick={() => router.push(`/courses/${course.id}`)}
      >
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            width={100}
            height={100}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={40} className="text-zinc-600" />
          </div>
        )}
      </div>

      {/* content */}
      <div className="p-4 flex flex-col flex-1">
        <h3
          className="font-semibold text-zinc-100 mb-1 line-clamp-2 cursor-pointer hover:text-violet-400 transition-colors"
          onClick={() => router.push(`/courses/${course.id}`)}
        >
          {course.title}
        </h3>

        {course.description && (
          <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
            {course.description}
          </p>
        )}

        <div className="mt-auto space-y-2">
          {showTeacher && course.teacher_name && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <User size={12} />
              <span>{course.teacher_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Calendar size={12} />
            <span>{formatDate(course.created_at)}</span>
          </div>
        </div>

        {actionSlot && (
          <div className="mt-3 pt-3 border-t border-zinc-800">{actionSlot}</div>
        )}
      </div>
    </div>
  );
}
