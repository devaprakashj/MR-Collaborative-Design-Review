"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

export function MetricsGrid() {
  const { projects, annotations } = useApp();

  const totalProjects = projects.length;
  const inReview = projects.filter((p) => p.status === "in_review").length;
  const changesReq = projects.filter((p) => p.status === "changes_requested").length;
  const approved = projects.filter((p) => p.status === "approved").length;
  const criticalIssues = annotations.filter(
    (a) => a.priority === "critical" && a.status !== "resolved"
  ).length;

  const cards = [
    {
      label: "TOTAL ARCHITECTURAL ASSETS",
      value: totalProjects,
      subtitle: "BIM projects managed",
      icon: FolderKanban,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30",
      iconColor: "text-cyan-400",
      href: "/projects",
    },
    {
      label: "ACTIVE IN REVIEW",
      value: inReview,
      subtitle: "Awaiting peer feedback",
      icon: Clock,
      color: "from-amber-500/20 to-yellow-500/10 border-amber-500/30",
      iconColor: "text-amber-400",
      href: "/reviews",
    },
    {
      label: "APPROVED DESIGNS",
      value: approved,
      subtitle: "Ready for fabrication / tender",
      icon: CheckCircle2,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
      iconColor: "text-emerald-400",
      href: "/projects?status=approved",
    },
    {
      label: "CRITICAL CLASHES",
      value: criticalIssues,
      subtitle: "Requires engineering revision",
      icon: AlertTriangle,
      color: "from-rose-500/20 to-orange-500/10 border-rose-500/30",
      iconColor: "text-rose-400",
      href: "/reviews",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Link
            key={i}
            href={card.href}
            className={`group relative p-5 rounded-xl bg-cad-900 border transition-all duration-200 hover:shadow-cad-panel hover:border-cad-600 bg-gradient-to-br ${card.color}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-[10px] font-mono tracking-wider text-cad-400">
                {card.label}
              </div>
              <div
                className={`p-2 rounded-lg bg-cad-850/80 border border-cad-700/60 ${card.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <div className="text-3xl font-bold font-mono tracking-tight text-cad-50">
                {card.value}
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-cad-500 group-hover:text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            <div className="mt-1 text-xs text-cad-400">{card.subtitle}</div>
          </Link>
        );
      })}
    </div>
  );
}

