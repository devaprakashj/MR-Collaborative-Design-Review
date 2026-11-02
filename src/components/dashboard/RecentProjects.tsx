"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function RecentProjects() {
  const { projects } = useApp();
  const recent = projects.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-mono uppercase text-cad-400">
            ACTIVE PORTFOLIO
          </div>
          <h2 className="text-lg font-bold text-cad-50 tracking-tight">
            Priority Architectural Reviews
          </h2>
        </div>
        <Link
          href="/projects"
          className="text-xs text-cyan hover:underline flex items-center gap-1 font-medium"
        >
          View All ({projects.length})
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {recent.map((proj) => (
          <ProjectCard key={proj.id} project={proj} />
        ))}
      </div>
    </div>
  );
}

