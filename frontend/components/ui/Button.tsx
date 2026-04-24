import { cn } from "@/lib/utils";
import Spinner from "./Spinner";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20",
    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
    danger:
      "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30",
    ghost: "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100",
    outline:
      "border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}