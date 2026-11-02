"use client";

import React from "react";
import Link from "next/link";
import { Project } from "@/types";
import { getStatusBadgeConfig } from "@/lib/utils";
import {
  Building2,
  Box,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = getStatusBadgeConfig(project.status);
  const activeModel = project.models[0];

  return (
    <div className="group relative flex flex-col justify-between bg-cad-900 border border-cad-800 hover:border-cad-600 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-cad-panel">
      {/* Thumbnail + Overlays */}
      <div className="relative h-44 w-full overflow-hidden bg-cad-950">
        <img
          src={project.thumbnail}
          alt={project.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cad-900 via-cad-900/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded bg-cad-950/80 backdrop-blur-md border border-cad-700/80 font-mono text-[10px] text-cyan-300">
            {project.code}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold border backdrop-blur-md ${statusConfig.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
            {statusConfig.label}
          </span>
        </div>

        {/* Bottom Model Format Specs */}
        {activeModel && (
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-cad-300">
            <span className="flex items-center gap-1 bg-cad-950/80 px-2 py-0.5 rounded border border-cad-800">
              <Box className="w-3 h-3 text-cyan-400" />
              {activeModel.format} • {activeModel.lod}
            </span>
            <span className="bg-cad-950/80 px-2 py-0.5 rounded border border-cad-800">
              {activeModel.floors} FLOORS • {activeModel.grossFloorArea}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
            {project.category}
          </div>
          <Link
            href={`/projects/${project.id}`}
            className="text-base font-semibold text-cad-50 group-hover:text-cyan transition-colors line-clamp-1"
          >
            {project.name}
          </Link>
          <p className="text-xs text-cad-400 mt-1.5 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Location & Issues Count */}
        <div className="pt-3 border-t border-cad-800/80 grid grid-cols-2 gap-2 text-xs text-cad-300">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-cad-500 shrink-0" />
            <span className="truncate text-[11px]">{project.location}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5">
            <AlertCircle
              className={`w-3.5 h-3.5 ${
                project.unresolvedIssuesCount > 0
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            />
            <span className="font-mono text-[11px]">
              {project.unresolvedIssuesCount} Issues Flagged
            </span>
          </div>
        </div>

        {/* Progress Bar & Reviewers Stack */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-cad-400">DESIGN READINESS</span>
            <span className="text-cyan-400">{project.progressPercent}%</span>
          </div>
          <div className="w-full h-1 bg-cad-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-electric to-cyan rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-2">
          {/* Collaborator Avatars */}
          <div className="flex -space-x-1.5 overflow-hidden">
            {project.collaborators.slice(0, 3).map((collab) => (
              <img
                key={collab.id}
                src={collab.avatar}
                alt={collab.name}
                title={`${collab.name} (${collab.role})`}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-cad-900 object-cover"
              />
            ))}
            {project.collaborators.length > 3 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cad-800 text-[10px] font-mono text-cad-300 ring-2 ring-cad-900">
                +{project.collaborators.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${project.id}`}
              className="px-2.5 py-1.5 rounded text-xs text-cad-300 hover:text-cad-100 hover:bg-cad-800 border border-cad-750 transition-colors"
            >
              Details
            </Link>
            <Link
              href={`/projects/${project.id}/review`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/30 transition-all shadow-cyan-glow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3D Review</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

