import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "cyan-ghost";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary:
        "bg-gradient-to-r from-electric to-cyan text-cad-950 font-semibold shadow-cyan-glow-sm hover:shadow-cyan-glow hover:brightness-110 active:brightness-95 border-none",
      secondary:
        "bg-cad-800 hover:bg-cad-750 text-cad-100 border border-cad-700 hover:border-cad-600 active:bg-cad-850",
      outline:
        "bg-transparent border border-cad-700 hover:border-cyan/50 text-cad-200 hover:text-cyan hover:bg-cyan/5",
      ghost:
        "bg-transparent text-cad-300 hover:text-cad-50 hover:bg-cad-800/60 border-transparent",
      "cyan-ghost":
        "bg-transparent text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30",
      danger:
        "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 active:bg-rose-500/30",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs rounded",
      md: "px-4 py-2 text-sm rounded-md",
      lg: "px-6 py-2.5 text-base rounded-md",
      icon: "w-9 h-9 p-0 flex items-center justify-center rounded-md",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/60",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

