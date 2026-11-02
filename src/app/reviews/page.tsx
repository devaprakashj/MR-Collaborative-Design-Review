"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/context/AppContext";
import { getStatusBadgeConfig, formatDate, formatTimeAgo } from "@/lib/utils";
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Compass,
  ArrowRight,
  Filter,
  Eye,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AllReviewsPage() {
  const { projects, currentUser } = useApp();
  const [filter, setFilter] = useState<"all" | "in_review" | "changes_requested" | "approved">("all");

  const filtered = projects.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const pendingCount = projects.filter((p) => p.status === "in_review").length;
  const changesCount = projects.filter((p) => p.status === "changes_requested").length;
  const approvedCount = projects.filter((p) => p.status === "approved").length;

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
                COMPLIANCE & SIGN-OFF DESK
              </div>
              <h1 className="text-2xl font-bold text-cad-50 tracking-tight">
                All Architectural Reviews
              </h1>
              <p className="text-xs text-cad-400 mt-1">
                Multi-disciplinary queue for code verification, BIM spatial clash resolution, and client sign-off.
              </p>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex bg-cad-900 p-1 rounded-xl border border-cad-800 text-xs font-mono">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === "all"
                    ? "bg-cad-800 text-cyan font-bold"
                    : "text-cad-400 hover:text-white"
                }`}
              >
                ALL ({projects.length})
              </button>
              <button
                onClick={() => setFilter("in_review")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === "in_review"
                    ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                    : "text-cad-400 hover:text-white"
                }`}
              >
                PENDING ({pendingCount})
              </button>
              <button
                onClick={() => setFilter("changes_requested")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === "changes_requested"
                    ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30"
                    : "text-cad-400 hover:text-white"
                }`}
              >
                REVISIONS ({changesCount})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === "approved"
                    ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30"
                    : "text-cad-400 hover:text-white"
                }`}
              >
                APPROVED ({approvedCount})
              </button>
            </div>
          </div>

          {/* Review Items List */}
          <div className="space-y-4">
            {filtered.map((project) => {
              const statusConfig = getStatusBadgeConfig(project.status);
              const latestReview = project.reviews?.[0];

              return (
                <div
                  key={project.id}
                  className="p-6 rounded-xl bg-cad-900 border border-cad-800 hover:border-cad-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-cad-850 border border-cad-750 text-cyan-300">
                        {project.code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border ${statusConfig.className}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                        />
                        {statusConfig.label.toUpperCase()}
                      </span>
                      <span className="text-xs text-cad-400 font-mono">
                        {project.category}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-cad-100 truncate">
                      {project.name}
                    </h2>

                    <p className="text-xs text-cad-300 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Latest Review Feedback Snippet */}
                    {latestReview && (
                      <div className="p-3 bg-cad-850/80 rounded-lg border border-cad-800 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-mono text-cad-400 mb-1">
                          <span>
                            LATEST REVIEW BY {latestReview.reviewerName.toUpperCase()} ({latestReview.reviewerRole})
                          </span>
                          <span>{formatTimeAgo(latestReview.timestamp)}</span>
                        </div>
                        <p className="text-cad-200 italic">
                          &ldquo;{latestReview.comment}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-cad-800">
                    <div className="text-left lg:text-right text-xs">
                      <div className="font-mono text-cad-400">
                        OPEN CLASHES / ISSUES:
                      </div>
                      <div
                        className={`text-base font-bold font-mono ${
                          project.unresolvedIssuesCount > 0
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {project.unresolvedIssuesCount} Issues
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${project.id}`}
                        className="px-3 py-2 bg-cad-850 hover:bg-cad-800 border border-cad-750 text-cad-300 rounded text-xs transition-colors"
                      >
                        Project Details
                      </Link>
                      <Link
                        href={`/projects/${project.id}/review`}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/30 rounded text-xs font-semibold shadow-cyan-glow-sm transition-all"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Inspect in 3D</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

