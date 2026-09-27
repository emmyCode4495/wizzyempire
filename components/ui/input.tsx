import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-medium text-ink-600">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "focus-ring h-11 rounded-sm border border-ink/15 bg-paper px-3.5 text-sm placeholder:text-ink-400",
            error && "border-signal",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-signal">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
