import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none",
          variant === "primary" &&
            "bg-insight text-ink hover:bg-[#D9B36E] active:scale-[0.98]",
          variant === "ghost" &&
            "border border-ink-line text-paper hover:border-insight-dim hover:text-insight",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
