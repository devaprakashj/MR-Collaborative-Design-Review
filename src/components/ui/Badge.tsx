import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "cyan" | "electric" | "success" | "warning" | "danger" | "neutral" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-cad-800 text-cad-200 border-cad-700/60",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    electric: "bg-electric/15 text-electric-bright border-electric/40",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    neutral: "bg-cad-750 text-cad-300 border-cad-600/50",
    outline: "bg-transparent text-cad-300 border-cad-700",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] font-mono",
    md: "px-2.5 py-1 text-xs font-mono",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-medium border uppercase tracking-wider transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

