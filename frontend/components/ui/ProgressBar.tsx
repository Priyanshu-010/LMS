import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 - 100
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function ProgressBar({
  value,
  showLabel = true,
  size = "md",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const color =
    clamped === 100
      ? "bg-green-500"
      : clamped >= 50
      ? "bg-violet-500"
      : "bg-violet-600";

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "w-full bg-zinc-800 rounded-full overflow-hidden",
          heights[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-zinc-500 mt-1 text-right">
          {clamped}% complete
        </p>
      )}
    </div>
  );
}