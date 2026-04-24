import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5",
            "text-zinc-100 placeholder-zinc-500 text-sm",
            "focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30",
            "transition-colors duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500/50 focus:border-red-500",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-zinc-500">{hint}</p>
        )}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;