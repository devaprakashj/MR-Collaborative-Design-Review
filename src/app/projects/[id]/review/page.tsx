"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { ViewportControls } from "@/components/viewer3d/ViewportControls";
import { AnnotationPanel } from "@/components/viewer3d/AnnotationPanel";
import { ModelInspectorPanel } from "@/components/viewer3d/ModelInspectorPanel";
import { ReviewActionBar } from "@/components/viewer3d/ReviewActionBar";
import { ModelUploadModal } from "@/components/viewer3d/ModelUploadModal";
import { CameraPresetView } from "@/components/viewer3d/ArchitecturalScene";
import {
  ArrowLeft,
  Box,
  Layers,
  Info,
  Users,
  Compass,
  MessageSquare,
  Sparkles,
  Maximize2,
  Minimize2,
  Upload,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// Dynamic import with SSR disabled for Three.js WebGL canvas
const ArchitecturalScene = dynamic(
  () => import("@/components/viewer3d/ArchitecturalScene"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-cad-950 text-cad-400 gap-3">
        <div className="w-10 h-10 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-cyan tracking-wider">
          INITIALIZING WEBGL 2.0 CAD ENGINE...
        </span>
      </div>
    ),
  }
);

export default function DesignWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    getProject,
    getProjectAnnotations,
    currentUser,
    customModels,
    setCustomModel,
    showToast,
  } = useApp();

  const project = getProject(projectId);
  const annotations = getProjectAnnotations(projectId);
  const customModel = customModels[projectId] || null;

  // Viewport display states
  const [wireframeMode, setWireframeMode] = useState(false);
  const [explodedView, setExplodedView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [pendingPinPosition, setPendingPinPosition] = useState<[number, number, number] | null>(null);

  // Camera Controls states
  const [presetView, setPresetView] = useState<CameraPresetView | null>(null);
  const [resetCameraTrigger, setResetCameraTrigger] = useState(0);
  const [fitToViewTrigger, setFitToViewTrigger] = useState(0);
  const [zoomInTrigger, setZoomInTrigger] = useState(0);
  const [zoomOutTrigger, setZoomOutTrigger] = useState(0);
  const [focusPosition, setFocusPosition] = useState<[number, number, number] | null>(null);

  // Grid & Lighting controls
  const [showGrid, setShowGrid] = useState(true);
  const [lightingMode, setLightingMode] = useState<"day" | "dusk" | "studio">("day");
  const [sunAngle, setSunAngle] = useState(45);

  // Modals & Drawers
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [rightDrawer, setRightDrawer] = useState<"annotations" | "inspector" | "none">("annotations");
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleCanvasClickToAdd = (position: [number, number, number]) => {
    setPendingPinPosition(position);
    setIsAddingAnnotation(false);
    setRightDrawer("annotations");
  };

  const handleSelectAnnotation = (id: string | null) => {
    setActiveAnnotationId(id);
    if (id) {
      const target = annotations.find((a) => a.id === id);
      if (target) {
        setFocusPosition(target.position);
      }
    }
  };

  const handleFocusAnnotation = (position: [number, number, number]) => {
    setFocusPosition(position);
  };

  const handlePresetView = (view: CameraPresetView) => {
    setPresetView(view);
    // Reset after trigger
    setTimeout(() => setPresetView(null), 100);
  };

  const handleModelLoaded = (modelData: any) => {
    setCustomModel(projectId, modelData);
    setFitToViewTrigger((prev) => prev + 1);
  };

  const handleResetModel = () => {
    setCustomModel(projectId, null);
    setFitToViewTrigger((prev) => prev + 1);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-cad-950 flex items-center justify-center text-cad-400 text-xs font-mono">
        LOADING 3D PROJECT CONTEXT...
      </div>
    );
  }

  const activeModel = project.models[0];

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-cad-950 flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Top Technical CAD Ribbon */}
      <header className="h-14 bg-cad-900/90 border-b border-cad-800 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="p-1.5 rounded-lg bg-cad-850 hover:bg-cad-800 text-cad-300 hover:text-cyan border border-cad-750 transition-colors"
            title="Exit 3D Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-cad-850 border border-cad-700 text-cyan-400">
              {project.code}
            </span>
            <span className="text-sm font-bold text-cad-50 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {project.name}
            </span>

            {/* Active Model Identifier Badge */}
            {customModel ? (
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CUSTOM: {customModel.name} ({customModel.size})
              </span>
            ) : (
              <span className="hidden md:inline-block font-mono text-[10px] text-cad-400 bg-cad-850/60 px-2 py-0.5 rounded border border-cad-800">
                DEFAULT ARCHITECTURE: {activeModel?.name} ({activeModel?.lod})
              </span>
            )}
          </div>
        </div>

        {/* Right Action Icons to toggle side drawers & model upload */}
        <div className="flex items-center gap-2">
          {/* Quick Model Upload Button in Top Ribbon */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono bg-cad-850 hover:bg-cad-800 text-cyan border border-cyan/30 transition-colors shadow-cyan-glow-sm"
            title="Upload or Replace 3D Model (.GLB / .GLTF)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>UPLOAD .GLB</span>
          </button>

          {/* Drawer Toggle: Annotations */}
          <button
            onClick={() =>
              setRightDrawer(rightDrawer === "annotations" ? "none" : "annotations")
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${
              rightDrawer === "annotations"
                ? "bg-cyan/20 border-cyan text-cyan font-bold"
                : "bg-cad-850 border-cad-750 text-cad-300 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>MARKUPS ({annotations.length})</span>
          </button>

          {/* Drawer Toggle: BIM Inspector */}
          <button
            onClick={() =>
              setRightDrawer(rightDrawer === "inspector" ? "none" : "inspector")
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border transition-all ${
              rightDrawer === "inspector"
                ? "bg-electric/25 border-electric text-electric-bright font-bold"
                : "bg-cad-850 border-cad-750 text-cad-300 hover:text-white"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">INSPECTOR</span>
          </button>

          {/* Fullscreen toggle button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-cad-850 hover:bg-cad-800 text-cad-300 hover:text-white border border-cad-750 transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Central Viewport & Sliding Side Drawers */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* 3D WebGL Canvas Area */}
        <div className="relative flex-1 h-full w-full bg-cad-950">
          <ArchitecturalScene
            projectId={projectId}
            projectCategory={project?.category}
            projectName={project?.name}
            customModelUrl={customModel?.url}
            wireframeMode={wireframeMode}
            explodedView={explodedView}
            showGrid={showGrid}
            sunAngle={sunAngle}
            lightingMode={lightingMode}
            annotations={annotations}
            activeAnnotationId={activeAnnotationId}
            onSelectAnnotation={handleSelectAnnotation}
            isAddingAnnotation={isAddingAnnotation}
            onCanvasClickToAddAnnotation={handleCanvasClickToAdd}
            presetView={presetView}
            resetCameraTrigger={resetCameraTrigger}
            fitToViewTrigger={fitToViewTrigger}
            zoomInTrigger={zoomInTrigger}
            zoomOutTrigger={zoomOutTrigger}
            focusPosition={focusPosition}
            onModelError={(err) => showToast("3D Model Error", err, "error")}
          />

          {/* Floating Viewport Toolstrip */}
          <ViewportControls
            wireframeMode={wireframeMode}
            onToggleWireframe={() => setWireframeMode(!wireframeMode)}
            explodedView={explodedView}
            onToggleExploded={() => setExplodedView(!explodedView)}
            isAddingAnnotation={isAddingAnnotation}
            onToggleAddingAnnotation={() => setIsAddingAnnotation(!isAddingAnnotation)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onPresetView={handlePresetView}
            onResetCamera={() => setResetCameraTrigger((prev) => prev + 1)}
            onFitToView={() => setFitToViewTrigger((prev) => prev + 1)}
            onZoomIn={() => setZoomInTrigger((prev) => prev + 1)}
            onZoomOut={() => setZoomOutTrigger((prev) => prev + 1)}
            showGrid={showGrid}
            onToggleGrid={() => setShowGrid(!showGrid)}
            lightingMode={lightingMode}
            onChangeLightingMode={setLightingMode}
            sunAngle={sunAngle}
            onChangeSunAngle={setSunAngle}
            isCustomModel={!!customModel}
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onResetModel={handleResetModel}
          />

          {/* Bottom Review Action & Peer Bar */}
          <ReviewActionBar project={project} />
        </div>

        {/* Sliding Right Panels */}
        {rightDrawer === "annotations" && (
          <AnnotationPanel
            project={project}
            annotations={annotations}
            activeAnnotationId={activeAnnotationId}
            onSelectAnnotation={handleSelectAnnotation}
            pendingPinPosition={pendingPinPosition}
            onClearPendingPin={() => setPendingPinPosition(null)}
            onFocusAnnotation={handleFocusAnnotation}
          />
        )}

        {rightDrawer === "inspector" && (
          <ModelInspectorPanel
            project={project}
            model={{
              ...activeModel,
              name: customModel ? customModel.name : activeModel.name,
              format: customModel ? customModel.format : activeModel.format,
              fileSize: customModel ? customModel.size : activeModel.fileSize,
              meshCount: customModel ? customModel.meshCount : activeModel.meshCount,
              vertexCount: customModel ? customModel.vertexCount : activeModel.vertexCount,
              materialsCount: customModel ? customModel.materialsCount : activeModel.materialsCount,
            }}
          />
        )}
      </div>

      {/* Model Upload Modal */}
      <ModelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onModelLoaded={handleModelLoaded}
        onResetToSample={handleResetModel}
        currentModelName={customModel?.name}
        isCustomLoaded={!!customModel}
      />
    </div>
  );
}
