"use client";

import React, { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectFilterBar } from "@/components/projects/ProjectFilterBar";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { useApp } from "@/context/AppContext";
import { getStatusBadgeConfig } from "@/lib/utils";
import {
  Plus,
  FolderKanban,
  Box,
  MapPin,
  Calendar,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProjectsPage() {
  const { projects, deleteProject } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "All Categories" ||
        project.category === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || project.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenNewProject={() => setIsCreateModalOpen(true)} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-cyan tracking-wider">
                PORTFOLIO DIRECTORY
              </div>
              <h1 className="text-2xl font-bold text-cad-50 tracking-tight">
                Architectural Projects
              </h1>
              <p className="text-xs text-cad-400 mt-1">
                Manage BIM building models, inspect clash issues, and review engineering drawings.
              </p>
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Button>
          </div>

          {/* Filter Bar */}
          <ProjectFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Results Summary & Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-cad-400 px-1">
            <span>
              SHOWING {filteredProjects.length} OF {projects.length} PROJECTS
            </span>
            {(searchQuery ||
              selectedCategory !== "All Categories" ||
              selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Categories");
                  setSelectedStatus("all");
                }}
                className="text-cyan hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Project List / Grid View */}
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-cad-900 border border-cad-800 space-y-4">
              <FolderKanban className="w-12 h-12 text-cad-600 mx-auto" />
              <div>
                <h3 className="text-base font-semibold text-cad-100">
                  No architectural projects found
                </h3>
                <p className="text-xs text-cad-400 mt-1 max-w-md mx-auto">
                  Try adjusting your search criteria or create a new project to start reviewing 3D models.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create New Project
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-cad-900 border border-cad-800 rounded-xl overflow-hidden divide-y divide-cad-800">
              {filteredProjects.map((project) => {
                const statusConfig = getStatusBadgeConfig(project.status);
                const activeModel = project.models[0];

                return (
                  <div
                    key={project.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-cad-850/60 transition-colors"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-16 h-16 rounded-lg object-cover ring-1 ring-cad-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-cyan-300 bg-cad-850 px-1.5 py-0.5 rounded border border-cad-700">
                            {project.code}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.2 rounded-full font-mono text-[10px] border ${statusConfig.className}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                            />
                            {statusConfig.label}
                          </span>
                          <span className="text-[11px] font-mono text-cad-400">
                            {project.category}
                          </span>
                        </div>
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-base font-semibold text-cad-100 hover:text-cyan transition-colors truncate block"
                        >
                          {project.name}
                        </Link>
                        <p className="text-xs text-cad-400 line-clamp-1 mt-0.5">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="hidden lg:block text-right text-xs">
                        <div className="text-cad-200 font-mono">
                          {activeModel?.format} • {activeModel?.lod}
                        </div>
                        <div className="text-cad-500 text-[10px]">
                          {project.unresolvedIssuesCount} Issues Flagged
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="px-3 py-1.5 rounded text-xs text-cad-300 hover:text-white bg-cad-850 border border-cad-750 hover:bg-cad-800 transition-colors"
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
                );
              })}
            </div>
          )}
        </main>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

