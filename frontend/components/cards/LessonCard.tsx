"use client";

import {
  PlayCircle,
  FileText,
  ExternalLink,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Lesson } from "@/types";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  lesson: Lesson;
  completed?: boolean;
  onClick?: () => void;
  actionSlot?: React.ReactNode;
}

export default function LessonCard({
  lesson,
  completed = false,
  onClick,
  actionSlot,
}: LessonCardProps) {
  const hasVideo = lesson.video_url || lesson.external_video_link;

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-all duration-200",
        "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* completion icon */}
      <div className="mt-0.5 shrink-0">
        {completed ? (
          <CheckCircle size={20} className="text-green-400" />
        ) : (
          <Circle size={20} className="text-zinc-600" />
        )}
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs text-zinc-600 font-mono">
              #{lesson.order + 1}
            </span>
            <h4 className="font-medium text-zinc-100 mt-0.5">{lesson.title}</h4>
            {lesson.description && (
              <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                {lesson.description}
              </p>
            )}
          </div>
        </div>

        {/* media indicators */}
        <div className="flex items-center gap-3 mt-2">
          {hasVideo && (
            <span className="flex items-center gap-1 text-xs text-violet-400">
              <PlayCircle size={12} />
              Video
            </span>
          )}
          {lesson.pdf_url && (
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <FileText size={12} />
              PDF
            </span>
          )}
          {lesson.external_video_link && !lesson.video_url && (
            <span className="flex items-center gap-1 text-xs text-orange-400">
              <ExternalLink size={12} />
              External
            </span>
          )}
        </div>
      </div>

      {actionSlot && (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {actionSlot}
        </div>
      )}
    </div>
  );
}