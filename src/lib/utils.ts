import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTimeAgo(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getStatusBadgeConfig(status: string) {
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        variant: "success",
        className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        dotColor: "bg-emerald-400",
      };
    case "in_review":
      return {
        label: "In Review",
        variant: "warning",
        className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        dotColor: "bg-amber-400 animate-pulse",
      };
    case "changes_requested":
      return {
        label: "Changes Requested",
        variant: "danger",
        className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        dotColor: "bg-rose-400",
      };
    case "draft":
      return {
        label: "Draft",
        variant: "neutral",
        className: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        dotColor: "bg-slate-400",
      };
    case "archived":
      return {
        label: "Archived",
        variant: "neutral",
        className: "bg-zinc-700/20 text-zinc-400 border-zinc-700/40",
        dotColor: "bg-zinc-500",
      };
    default:
      return {
        label: status,
        variant: "neutral",
        className: "bg-slate-500/10 text-slate-400 border-slate-500/30",
        dotColor: "bg-slate-400",
      };
  }
}

