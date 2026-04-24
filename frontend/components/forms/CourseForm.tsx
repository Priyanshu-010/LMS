"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { Course } from "@/types";
import Image from "next/image";

interface CourseFormProps {
  initial?: Partial<Course>;
  onSubmit: (data: {
    title: string;
    description: string;
    thumbnail: File | null;
  }) => Promise<void>;
  submitLabel?: string;
}

export default function CourseForm({
  initial,
  onSubmit,
  submitLabel = "Create Course",
}: CourseFormProps) {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initial?.thumbnail_url || null,
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

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
      await onSubmit({ title, description, thumbnail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Course Title"
        placeholder="e.g. Introduction to Python"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <Textarea
        label="Description"
        placeholder="What will students learn in this course?"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />

      {/* thumbnail upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">
          Thumbnail Image
        </label>
        <label className="cursor-pointer">
          <div className="w-full h-44 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center hover:border-violet-500/50 transition-colors overflow-hidden">
            {preview ? (
              <Image
                src={preview}
                alt="preview"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <ImagePlus size={28} />
                <span className="text-sm">Click to upload thumbnail</span>
                <span className="text-xs">PNG, JPG up to 5MB</span>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>
      </div>

      <Button type="submit" loading={loading} fullWidth>
        {submitLabel}
      </Button>
    </form>
  );
}
