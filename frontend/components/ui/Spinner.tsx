import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Spinner({ size = "md", className }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={cn(
        "rounded-full border-zinc-600 border-t-violet-500 animate-spin",
        sizes[size],
        className
      )}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <Spinner size="lg" />
    </div>
  );
}