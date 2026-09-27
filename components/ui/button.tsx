import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

const variants: Record<string, string> = {
  primary: "bg-ink text-paper hover:bg-ink-800",
  secondary: "bg-paper-100 text-ink hover:bg-ink-100",
  ghost: "bg-transparent text-ink hover:bg-ink-50",
  outline: "bg-transparent text-ink border border-ink/20 hover:border-ink",
};

const sizes: Record<string, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "focus-ring inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
