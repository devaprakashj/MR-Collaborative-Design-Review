"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricsGrid } from "@/components/dashboard/MetricsGrid";
import { RecentProjects } from "@/components/dashboard/RecentProjects";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { useApp } from "@/context/AppContext";
import {
  Plus,
  Box,
  Compass,
  FileCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function DashboardPage() {
  const { currentUser, projects } = useApp();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const pendingReviews = projects.filter((p) => p.status === "in_review");
  const approvedDesigns = projects.filter((p) => p.status === "approved");

  return (
    <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenNewProject={() => setIsCreateModalOpen(true)} />

        <main className="flex-1 p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Welcome Architectural Banner */}
          <div className="relative rounded-2xl bg-gradient-to-r from-cad-900 via-cad-850 to-cad-900 border border-cad-750 p-6 lg:p-8 shadow-cad-panel overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cad-blueprint pointer-events-none opacity-40" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/30 text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                  WORKSPACE STATUS: ACTIVE CAD SESSION
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-cad-50 tracking-tight">
                  Welcome back, {currentUser.name}
                </h1>
                <p className="text-sm text-cad-300 max-w-2xl leading-relaxed">
                  You are working as{" "}
                  <span className="text-cyan font-semibold">
                    {currentUser.title}
                  </span>
                  . There are currently{" "}
                  <span className="text-amber-400 font-bold font-mono">
                    {pendingReviews.length} architectural projects
                  </span>{" "}
                  awaiting multi-disciplinary engineering sign-off.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </Button>
                <Link
                  href="/projects/prj-nordic-cultural/review"
                  className="px-4 py-2 bg-cad-800 hover:bg-cad-750 text-cyan-300 border border-cad-700 hover:border-cyan/40 rounded-md text-sm font-medium transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>3D Review Workspace</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <MetricsGrid />

          {/* Main Workspace Split: Priority Projects & Live Activity Audit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <RecentProjects />
            </div>

            <div className="lg:col-span-4 space-y-6">
              <ActivityFeed />

              {/* Architectural CAD Tip / Milestone Card */}
              <div className="p-5 rounded-xl bg-cad-900 border border-cad-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BIM LOD 350 VERIFICATION</span>
                </div>
                <p className="text-xs text-cad-300 leading-relaxed">
                  All uploaded IFC & RVT models automatically undergo bounding-box clash
                  detection for MEP ducts, structural mass timber, and fire egress routes.
                </p>
                <Link
                  href="/reviews"
                  className="text-xs text-cyan hover:underline flex items-center gap-1 font-mono pt-1"
                >
                  View Review Checklist
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Project Creation Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

