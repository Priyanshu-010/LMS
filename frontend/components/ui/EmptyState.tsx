import { LucideIcon } from "lucide-react";
import { BookOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon: Icon = BookOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center mb-4">
        <Icon size={28} className="text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-200 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}