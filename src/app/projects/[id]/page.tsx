"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/context/AppContext";
import { getStatusBadgeConfig, formatDate, formatTimeAgo } from "@/lib/utils";
import {
  ArrowLeft,
  Box,
  Compass,
  FileSpreadsheet,
  Users2,
  History,
  Activity,
  Plus,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Layers,
  MapPin,
  Calendar,
  Building2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getProject, addActivity, showToast, currentUser, collaborators } = useApp();

  const projectId = params.id as string;
  const project = getProject(projectId);

  const [activeTab, setActiveTab] = useState<"overview" | "models" | "collaborators" | "reviews">("overview");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newModelVersion, setNewModelVersion] = useState("v3.3.0");
  const [newModelFormat, setNewModelFormat] = useState<"IFC" | "RVT" | "GLTF">("IFC");
  const [newModelLod, setNewModelLod] = useState<"LOD 300" | "LOD 350" | "LOD 400">("LOD 350");

  if (!project) {
    return (
      <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-cad-100">Project Not Found</h2>
            <p className="text-sm text-cad-400">
              The requested architectural project could not be loaded.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan/15 text-cyan border border-cyan/30 rounded-md text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusBadgeConfig(project.status);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadModalOpen(false);

    addActivity({
      projectId: project.id,
      projectName: project.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: "upload",
      description: `Uploaded BIM model package ${project.name.replace(/\s+/g, "_")}_${newModelVersion}.${newModelFormat.toLowerCase()} (${newModelLod})`,
      badge: newModelVersion,
    });

    showToast("Model Uploaded", `Package ${newModelVersion} (${newModelFormat}) successfully indexed`, "success");
  };

  return (
    <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Breadcrumb & Navigation Back */}
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="text-xs text-cad-400 hover:text-cyan flex items-center gap-1.5 transition-colors font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              BACK TO PORTFOLIO DIRECTORY
            </Link>

            <Link
              href={`/projects/${project.id}/review`}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric to-cyan text-cad-950 font-semibold rounded-md text-xs tracking-wider uppercase shadow-cyan-glow-sm hover:shadow-cyan-glow transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3D Workspace</span>
            </Link>
          </div>

          {/* Project Title Card */}
          <div className="p-6 lg:p-8 rounded-2xl bg-cad-900 border border-cad-800 shadow-cad-panel flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cad-850 border border-cad-700 text-cyan-300">
                  {project.code}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-mono text-xs border ${statusConfig.className}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                  {statusConfig.label.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-cad-400">
                  {project.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-cad-50 tracking-tight">
                {project.name}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-xs text-cad-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cad-500" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cad-500" />
                  <span>Target: {project.targetCompletion}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cad-500" />
                  <span>Principal: {project.owner.name}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Mini Preview */}
            <div className="w-full md:w-64 h-36 rounded-xl overflow-hidden ring-1 ring-cad-700 relative shrink-0">
              <img
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cad-950/80 via-transparent to-transparent flex items-end p-3">
                <Link
                  href={`/projects/${project.id}/review`}
                  className="w-full py-1.5 px-2 bg-cyan/20 hover:bg-cyan/30 text-cyan border border-cyan/40 rounded text-center text-[11px] font-mono transition-all backdrop-blur-sm"
                >
                  Open 3D Model →
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-cad-800 gap-1 overflow-x-auto text-xs font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "overview"
                  ? "border-cyan text-cyan"
                  : "border-transparent text-cad-400 hover:text-cad-200"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              OVERVIEW & SPECS
            </button>
            <button
              onClick={() => setActiveTab("models")}
              className={`px-4 py-2.5 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "models"
                  ? "border-cyan text-cyan"
                  : "border-transparent text-cad-400 hover:text-cad-200"
              }`}
            >
              <Box className="w-4 h-4" />
              UPLOADED MODELS ({project.models.length})
            </button>
            <button
              onClick={() => setActiveTab("collaborators")}
              className={`px-4 py-2.5 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "collaborators"
                  ? "border-cyan text-cyan"
                  : "border-transparent text-cad-400 hover:text-cad-200"
              }`}
            >
              <Users2 className="w-4 h-4" />
              COLLABORATORS ({project.collaborators.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2.5 font-semibold transition-colors flex items-center gap-2 border-b-2 ${
                activeTab === "reviews"
                  ? "border-cyan text-cyan"
                  : "border-transparent text-cad-400 hover:text-cad-200"
              }`}
            >
              <History className="w-4 h-4" />
              REVIEW HISTORY ({project.reviews?.length || 0})
            </button>
          </div>

          {/* Tab 1: Overview & Specs */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                {/* Architectural Brief */}
                <div className="p-6 rounded-xl bg-cad-900 border border-cad-800 space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-cad-400 font-mono">
                    Architectural Intent & Review Scope
                  </h3>
                  <p className="text-sm text-cad-200 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Primary Model Technical Metadata */}
                {project.models[0] && (
                  <div className="p-6 rounded-xl bg-cad-900 border border-cad-800 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-cyan font-mono">
                      Active Model BIM Metrics ({project.models[0].name})
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-cad-850 rounded-lg border border-cad-750">
                        <span className="text-[10px] text-cad-400 font-mono block">SPECIFICATION</span>
                        <span className="text-sm font-bold font-mono text-cyan">{project.models[0].lod}</span>
                      </div>
                      <div className="p-3 bg-cad-850 rounded-lg border border-cad-750">
                        <span className="text-[10px] text-cad-400 font-mono block">FLOORS / HEIGHT</span>
                        <span className="text-sm font-bold font-mono text-cad-100">{project.models[0].floors} Levels</span>
                      </div>
                      <div className="p-3 bg-cad-850 rounded-lg border border-cad-750">
                        <span className="text-[10px] text-cad-400 font-mono block">TOTAL GFA</span>
                        <span className="text-sm font-bold font-mono text-cad-100">{project.models[0].grossFloorArea}</span>
                      </div>
                      <div className="p-3 bg-cad-850 rounded-lg border border-cad-750">
                        <span className="text-[10px] text-cad-400 font-mono block">POLYGON COUNT</span>
                        <span className="text-sm font-bold font-mono text-cad-100">{project.models[0].meshCount.toLocaleString()} meshes</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Readiness & Next Steps */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-5 rounded-xl bg-cad-900 border border-cad-800 space-y-4">
                  <div className="text-xs font-mono uppercase text-cad-400">
                    Design Sign-Off Progress
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-mono text-cyan">
                      {project.progressPercent}%
                    </span>
                    <span className="text-xs text-cad-400">
                      Target: {project.targetCompletion}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-cad-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-electric to-cyan rounded-full"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                  <Link
                    href={`/projects/${project.id}/review`}
                    className="w-full py-2 bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/30 rounded-md text-xs font-mono flex items-center justify-center gap-2 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Open in 3D Viewer
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Uploaded Models */}
          {activeTab === "models" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-cad-100">
                    BIM & Geometry File Packages
                  </h3>
                  <p className="text-xs text-cad-400">
                    Version-controlled IFC, RVT, and glTF assemblies with mesh validation.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload BIM Package</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {project.models.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-5 rounded-xl bg-cad-900 border border-cad-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 bg-cad-850 rounded-lg border border-cad-750 text-cyan">
                        <Box className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-cad-100">
                            {mod.name}
                          </span>
                          <Badge variant="cyan">{mod.version}</Badge>
                          <Badge variant="outline">{mod.lod}</Badge>
                        </div>
                        <div className="text-xs text-cad-400 mt-1 flex flex-wrap gap-4 font-mono">
                          <span>FORMAT: {mod.format}</span>
                          <span>FILE SIZE: {mod.fileSize}</span>
                          <span>MESHES: {mod.meshCount}</span>
                          <span>VERTICES: {mod.vertexCount.toLocaleString()}</span>
                          <span>UPLOADED: {formatDate(mod.uploadDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          showToast("Exporting File", `Preparing ${mod.name} download package...`, "info")
                        }
                        className="px-3 py-1.5 rounded text-xs bg-cad-850 hover:bg-cad-800 border border-cad-750 text-cad-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                      <Link
                        href={`/projects/${project.id}/review`}
                        className="px-3 py-1.5 rounded text-xs font-semibold bg-cyan/15 hover:bg-cyan/25 text-cyan border border-cyan/30 flex items-center gap-1.5 transition-all shadow-cyan-glow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect in 3D
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Collaborators */}
          {activeTab === "collaborators" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-cad-100">
                    Project Review Team
                  </h3>
                  <p className="text-xs text-cad-400">
                    Architectural principals, structural reviewers, and engineering consultants assigned to this design.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-cad-900 border border-cad-800 flex items-center gap-3.5"
                  >
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-cad-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-cad-100 truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase">
                          {c.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-cad-400 truncate">
                        {c.title}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {c.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Review History */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-cad-100">
                Formal Sign-Off & Change Request Timeline
              </h3>
              {(!project.reviews || project.reviews.length === 0) ? (
                <div className="p-8 text-center bg-cad-900 border border-cad-800 rounded-xl text-xs text-cad-400">
                  No formal review actions logged yet. Launch 3D review to submit approvals or change requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {project.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl bg-cad-900 border border-cad-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              rev.action === "approved"
                                ? "success"
                                : rev.action === "requested_changes"
                                ? "warning"
                                : "danger"
                            }
                          >
                            {rev.action.replace("_", " ")}
                          </Badge>
                          <span className="text-xs font-bold text-cad-100">
                            {rev.reviewerName}
                          </span>
                          <span className="text-xs text-cad-400 font-mono">
                            ({rev.reviewerRole})
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-cad-500">
                          {formatTimeAgo(rev.timestamp)} • Package {rev.version}
                        </span>
                      </div>
                      <p className="text-xs text-cad-300 leading-relaxed bg-cad-850 p-3 rounded-lg border border-cad-800">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Model Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Revised BIM Package"
        subtitle={`Upload new 3D model revision for ${project.name}`}
      >
        <form onSubmit={handleSimulateUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
              Package Version Code
            </label>
            <input
              type="text"
              required
              value={newModelVersion}
              onChange={(e) => setNewModelVersion(e.target.value)}
              className="w-full px-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
                Model Format
              </label>
              <select
                value={newModelFormat}
                onChange={(e) => setNewModelFormat(e.target.value as any)}
                className="w-full px-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan"
              >
                <option value="IFC">IFC 4x3 (Industry Foundation)</option>
                <option value="RVT">RVT (Autodesk Revit)</option>
                <option value="GLTF">GLTF 2.0 (Khronos 3D)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
                LOD Specification
              </label>
              <select
                value={newModelLod}
                onChange={(e) => setNewModelLod(e.target.value as any)}
                className="w-full px-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan"
              >
                <option value="LOD 300">LOD 300 (Design Detail)</option>
                <option value="LOD 350">LOD 350 (Fabrication / Clashes)</option>
                <option value="LOD 400">LOD 400 (Tender Certified)</option>
              </select>
            </div>
          </div>

          <div className="p-8 border-2 border-dashed border-cad-750 hover:border-cyan/50 rounded-xl text-center bg-cad-850/40 cursor-pointer transition-colors">
            <Upload className="w-8 h-8 text-cyan mx-auto mb-2" />
            <div className="text-xs font-semibold text-cad-100">
              Drop IFC / RVT / GLTF files here
            </div>
            <div className="text-[10px] text-cad-400 mt-1">
              Supports files up to 500 MB with multi-core mesh compression
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Complete Ingestion</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

