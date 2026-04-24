import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "violet" | "blue" | "green" | "orange";
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "violet",
  subtitle,
}: StatCardProps) {
  const colors = {
    violet: {
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      icon: "text-violet-400",
      value: "text-violet-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      icon: "text-blue-400",
      value: "text-blue-400",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      icon: "text-green-400",
      value: "text-green-400",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      icon: "text-orange-400",
      value: "text-orange-400",
    },
  };

  const c = colors[color];

  return (
    <div
      className={cn(
        "rounded-xl border p-5 flex items-center gap-4",
        "bg-zinc-900/60 backdrop-blur-sm",
        c.border
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          c.bg
        )}
      >
        <Icon size={22} className={c.icon} />
      </div>
      <div>
        <p className="text-sm text-zinc-500">{title}</p>
        <p className={cn("text-2xl font-bold", c.value)}>{value}</p>
        {subtitle && (
          <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}