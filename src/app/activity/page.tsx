"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/context/AppContext";
import { formatTimeAgo, formatDate } from "@/lib/utils";
import {
  Activity,
  FileUp,
  AlertOctagon,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function ActivityHistoryPage() {
  const { activities } = useApp();
  const [filterType, setFilterType] = useState<string>("all");

  const filtered = activities.filter((act) => {
    if (filterType === "all") return true;
    return act.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <FileUp className="w-4 h-4 text-cyan-400" />;
      case "annotation":
        return <AlertOctagon className="w-4 h-4 text-amber-400" />;
      case "approval":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "collaboration":
        return <UserPlus className="w-4 h-4 text-purple-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-cad-300" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-cyan tracking-wider">
                AUDIT TRAIL & REVIEWS
              </div>
              <h1 className="text-2xl font-bold text-cad-50 tracking-tight">
                Activity History
              </h1>
              <p className="text-xs text-cad-400 mt-1">
                Immutable event stream tracking 3D model uploads, spatial clash annotations, and sign-offs.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap bg-cad-900 p-1 rounded-xl border border-cad-800 text-xs font-mono">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === "all" ? "bg-cad-800 text-cyan font-bold" : "text-cad-400"
                }`}
              >
                ALL EVENTS ({activities.length})
              </button>
              <button
                onClick={() => setFilterType("annotation")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === "annotation" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-cad-400"
                }`}
              >
                MARKUPS
              </button>
              <button
                onClick={() => setFilterType("upload")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === "upload" ? "bg-cyan/20 text-cyan font-bold" : "text-cad-400"
                }`}
              >
                UPLOADS
              </button>
              <button
                onClick={() => setFilterType("approval")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filterType === "approval" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-cad-400"
                }`}
              >
                APPROVALS
              </button>
            </div>
          </div>

          {/* Activity Timeline List */}
          <div className="bg-cad-900 border border-cad-800 rounded-xl divide-y divide-cad-800/80 overflow-hidden">
            {filtered.map((act) => (
              <div
                key={act.id}
                className="p-5 flex items-start gap-4 hover:bg-cad-850/50 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-cad-850 border border-cad-750 shrink-0">
                  {getIcon(act.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={act.userAvatar}
                        alt={act.userName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-sm font-semibold text-cad-100">
                        {act.userName}
                      </span>
                      {act.projectName && (
                        <span className="text-xs text-cad-400 font-mono">
                          on <span className="text-cyan">{act.projectName}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-cad-500">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-cad-300 mt-1.5 leading-relaxed">
                    {act.description}
                  </p>

                  {act.badge && (
                    <span className="inline-block mt-2 font-mono text-[10px] px-2 py-0.5 bg-cad-850 text-cyan-300 rounded border border-cad-700">
                      {act.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

