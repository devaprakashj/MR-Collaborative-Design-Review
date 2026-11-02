"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = "border-cyan-500/40 text-cyan-400";
        let bgClass = "bg-cad-900/95";

        if (toast.type === "success") {
          Icon = CheckCircle2;
          borderClass = "border-emerald-500/40 text-emerald-400";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          borderClass = "border-amber-500/40 text-amber-400";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          borderClass = "border-rose-500/40 text-rose-400";
        }

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-3",
              bgClass,
              borderClass
            )}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-cad-50 leading-tight">
                {toast.title}
              </div>
              {toast.message && (
                <div className="text-xs text-cad-300 mt-1 leading-relaxed">
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-cad-400 hover:text-cad-100 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

