import { cn, getRoleBadgeColor } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "role" | "success" | "warning" | "danger" | "default";
  className?: string;
}

export default function Badge({
  label,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    role: getRoleBadgeColor(label),
    success:
      "bg-green-500/20 text-green-400 border border-green-500/30",
    warning:
      "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    danger: "bg-red-500/20 text-red-400 border border-red-500/30",
    default:
      "bg-zinc-700/50 text-zinc-300 border border-zinc-600/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
        variants[variant],
        className
      )}
    >
      {label}
    </span>
  );
}