"use client";

import { useState } from "react";
import { UploadCloud, FileVideo, FileText, Link as LinkIcon } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { Lesson } from "@/types";
import { cn } from "@/lib/utils";

interface LessonFormProps {
  initial?: Partial<Lesson>;
  onSubmit: (data: {
    title: string;
    description: string;
    order: number;
    external_video_link: string;
    video: File | null;
    pdf: File | null;
  }) => Promise<void>;
  submitLabel?: string;
}

export default function LessonForm({
  initial,
  onSubmit,
  submitLabel = "Create Lesson",
}: LessonFormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(
    initial?.description || ""
  );
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [externalLink, setExternalLink] = useState(
    initial?.external_video_link || ""
  );
  const [video, setVideo] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const validate = () => {
    const e: { title?: string } = {};
    if (!title.trim()) e.title = "Title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        order,
        external_video_link: externalLink,
        video,
        pdf,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Lesson Title"
            placeholder="e.g. Variables and Data Types"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
        </div>
        <Input
          label="Order"
          type="number"
          min={0}
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          hint="Display order (0 = first)"
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Brief description of what this lesson covers..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <Input
        label="External Video Link"
        placeholder="https://youtube.com/watch?v=..."
        value={externalLink}
        onChange={(e) => setExternalLink(e.target.value)}
        hint="Optional — YouTube, Vimeo, or any video URL"
      />

      {/* file uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* video upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">
            Video File
          </label>
          <label className="cursor-pointer">
            <div
              className={cn(
                "w-full h-32 bg-zinc-900 border-2 border-dashed border-zinc-700",
                "rounded-xl flex flex-col items-center justify-center gap-2",
                "hover:border-violet-500/50 transition-colors",
                video && "border-violet-500/50 bg-violet-500/5"
              )}
            >
              <FileVideo
                size={24}
                className={video ? "text-violet-400" : "text-zinc-500"}
              />
              <span className="text-xs text-zinc-500 text-center px-2">
                {video ? video.name : "Upload video (MP4, WebM)"}
              </span>
            </div>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
            />
          </label>
          {initial?.video_url && !video && (
            <p className="text-xs text-zinc-500">Current video will be kept</p>
          )}
        </div>

        {/* pdf upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">
            PDF Material
          </label>
          <label className="cursor-pointer">
            <div
              className={cn(
                "w-full h-32 bg-zinc-900 border-2 border-dashed border-zinc-700",
                "rounded-xl flex flex-col items-center justify-center gap-2",
                "hover:border-blue-500/50 transition-colors",
                pdf && "border-blue-500/50 bg-blue-500/5"
              )}
            >
              <FileText
                size={24}
                className={pdf ? "text-blue-400" : "text-zinc-500"}
              />
              <span className="text-xs text-zinc-500 text-center px-2">
                {pdf ? pdf.name : "Upload PDF document"}
              </span>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
            />
          </label>
          {initial?.pdf_url && !pdf && (
            <p className="text-xs text-zinc-500">Current PDF will be kept</p>
          )}
        </div>
      </div>

      <Button type="submit" loading={loading} fullWidth>
        {submitLabel}
      </Button>
    </form>
  );
}