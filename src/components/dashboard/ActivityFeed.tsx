"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { formatTimeAgo } from "@/lib/utils";
import {
  FileUp,
  MessageSquare,
  AlertOctagon,
  CheckCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function ActivityFeed() {
  const { activities } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <FileUp className="w-3.5 h-3.5 text-cyan-400" />;
      case "annotation":
        return <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />;
      case "approval":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case "collaboration":
        return <UserPlus className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-cad-300" />;
    }
  };

  return (
    <div className="bg-cad-900 border border-cad-800 rounded-xl p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-cad-800">
          <div>
            <div className="text-xs font-mono uppercase text-cad-400">
              AUDIT LOG
            </div>
            <div className="text-sm font-semibold text-cad-100">
              Live Review Stream
            </div>
          </div>
          <Link
            href="/activity"
            className="text-xs text-cyan hover:underline flex items-center gap-1"
          >
            Full Log
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="mt-4 space-y-4">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-xs">
              <div className="p-1.5 rounded-md bg-cad-850 border border-cad-750 shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-cad-200 truncate">
                    {act.userName}
                  </span>
                  <span className="text-[10px] font-mono text-cad-500 shrink-0">
                    {formatTimeAgo(act.timestamp)}
                  </span>
                </div>
                <p className="text-cad-400 mt-0.5 leading-relaxed">
                  {act.description}
                </p>
                {act.badge && (
                  <span className="inline-block mt-1 font-mono text-[9px] px-1.5 py-0.2 bg-cad-800 text-cad-300 rounded border border-cad-700">
                    {act.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

