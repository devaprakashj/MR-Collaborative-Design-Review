"use client";

import React, { useState } from "react";
import {
  Layers,
  Box,
  Maximize2,
  Minimize2,
  RotateCcw,
  MapPin,
  Eye,
  Sliders,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sun,
  Upload,
  RefreshCw,
  Compass,
  Scissors,
  Play,
  Pause,
  Ruler,
  X,
} from "lucide-react";
import { CameraPresetView } from "./ArchitecturalScene";

interface ViewportControlsProps {
  wireframeMode: boolean;
  onToggleWireframe: () => void;
  explodedView: boolean;
  onToggleExploded: () => void;
  isAddingAnnotation: boolean;
  onToggleAddingAnnotation: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  // Camera controls
  onPresetView: (view: CameraPresetView) => void;
  activePresetView?: CameraPresetView | null;
  onResetCamera: () => void;
  onFitToView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  // Grid & Lighting
  showGrid: boolean;
  onToggleGrid: () => void;
  lightingMode: "day" | "dusk" | "studio";
  onChangeLightingMode: (mode: "day" | "dusk" | "studio") => void;
  sunAngle: number;
  onChangeSunAngle: (angle: number) => void;
  // Model
  isCustomModel: boolean;
  onOpenUpload: () => void;
  onResetModel: () => void;
  // Section Cut (Clipping Plane)
  isSectionCut?: boolean;
  onToggleSectionCut?: () => void;
  sectionCutHeight?: number;
  onChangeSectionCutHeight?: (val: number) => void;
  // Turntable Auto-Rotate Presentation
  autoRotate?: boolean;
  onToggleAutoRotate?: () => void;
  // 3D Laser Measurement
  isMeasuring?: boolean;
  onToggleMeasuring?: () => void;
  measuredDistance?: number | null;
  onClearMeasurement?: () => void;
}

export function ViewportControls({
  wireframeMode,
  onToggleWireframe,
  explodedView,
  onToggleExploded,
  isAddingAnnotation,
  onToggleAddingAnnotation,
  isFullscreen,
  onToggleFullscreen,
  onPresetView,
  activePresetView,
  onResetCamera,
  onFitToView,
  onZoomIn,
  onZoomOut,
  showGrid,
  onToggleGrid,
  lightingMode,
  onChangeLightingMode,
  sunAngle,
  onChangeSunAngle,
  isCustomModel,
  onOpenUpload,
  onResetModel,
  isSectionCut = false,
  onToggleSectionCut,
  sectionCutHeight = 100,
  onChangeSectionCutHeight,
  autoRotate = false,
  onToggleAutoRotate,
  isMeasuring = false,
  onToggleMeasuring,
  measuredDistance = null,
  onClearMeasurement,
}: ViewportControlsProps) {
  const [showLightingMenu, setShowLightingMenu] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-32px)]">
      {/* Primary Toolstrip */}
      <div className="flex flex-wrap items-center gap-1.5 bg-cad-900/90 backdrop-blur-md border border-cad-750 rounded-xl p-1.5 shadow-2xl">
        {/* Add 3D Pin Button */}
        <button
          onClick={onToggleAddingAnnotation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            isAddingAnnotation
              ? "bg-rose-500 text-white font-bold shadow-lg animate-pulse"
              : "bg-cyan/15 text-cyan hover:bg-cyan/25 border border-cyan/30"
          }`}
          title="Click to place a pin on the 3D model surface"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{isAddingAnnotation ? "CANCEL PIN" : "+ ADD MARKUP PIN"}</span>
        </button>

        <div className="w-px h-5 bg-cad-800 mx-1 hidden sm:block" />

        {/* Camera Preset View Switcher */}
        <div className="flex items-center bg-cad-850/80 rounded-lg p-0.5 border border-cad-750 text-[10px] font-mono">
          <button
            onClick={() => onPresetView("perspective")}
            className={`px-2 py-1 rounded transition-colors ${
              activePresetView === "perspective"
                ? "bg-cyan text-cad-950 font-bold"
                : "text-cad-300 hover:text-white"
            }`}
            title="3D Perspective View"
          >
            PERSP
          </button>
          <button
            onClick={() => onPresetView("top")}
            className={`px-2 py-1 rounded transition-colors ${
              activePresetView === "top"
                ? "bg-cyan text-cad-950 font-bold"
                : "text-cad-300 hover:text-white"
            }`}
            title="Top View (Plan)"
          >
            TOP
          </button>
          <button
            onClick={() => onPresetView("front")}
            className={`px-2 py-1 rounded transition-colors ${
              activePresetView === "front"
                ? "bg-cyan text-cad-950 font-bold"
                : "text-cad-300 hover:text-white"
            }`}
            title="Front Elevation"
          >
            FRONT
          </button>
          <button
            onClick={() => onPresetView("side")}
            className={`px-2 py-1 rounded transition-colors ${
              activePresetView === "side"
                ? "bg-cyan text-cad-950 font-bold"
                : "text-cad-300 hover:text-white"
            }`}
            title="Side Elevation"
          >
            SIDE
          </button>
        </div>

        <div className="w-px h-5 bg-cad-800 mx-1 hidden sm:block" />

        {/* Camera Navigation: Fit, Reset, Zoom In, Zoom Out */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFitToView}
            className="p-1.5 rounded-lg text-cad-300 hover:text-cyan hover:bg-cad-800 border border-cad-800 transition-colors"
            title="Auto Fit Model to Camera"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onResetCamera}
            className="p-1.5 rounded-lg text-cad-300 hover:text-cyan hover:bg-cad-800 border border-cad-800 transition-colors"
            title="Reset Camera Orientation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onZoomIn}
            className="p-1.5 rounded-lg text-cad-300 hover:text-cyan hover:bg-cad-800 border border-cad-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-1.5 rounded-lg text-cad-300 hover:text-cyan hover:bg-cad-800 border border-cad-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-cad-800 mx-1 hidden sm:block" />

        {/* Unity-Grade CAD Tools: Wireframe, Explode, Section Cut, Turntable, Measure */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleWireframe}
            className={`p-1.5 rounded-lg text-xs transition-colors border ${
              wireframeMode
                ? "bg-cyan text-cad-950 font-bold border-cyan"
                : "text-cad-300 hover:text-white bg-cad-850/50 border-cad-800"
            }`}
            title="Toggle CAD Wireframe Mesh"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleExploded}
            className={`p-1.5 rounded-lg text-xs transition-colors border ${
              explodedView
                ? "bg-electric text-white font-bold border-electric"
                : "text-cad-300 hover:text-white bg-cad-850/50 border-cad-800"
            }`}
            title="Explode BIM Floor Levels"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Section Cut Tool */}
          {onToggleSectionCut && (
            <button
              onClick={onToggleSectionCut}
              className={`p-1.5 rounded-lg text-xs transition-colors border ${
                isSectionCut
                  ? "bg-amber-500 text-cad-950 font-bold border-amber-500 shadow-md"
                  : "text-cad-300 hover:text-white bg-cad-850/50 border-cad-800"
              }`}
              title="Toggle Live Section Box / Floor Cutting Plane"
            >
              <Scissors className="w-3.5 h-3.5" />
            </button>
          )}

          {/* 3D Laser Measure Tool */}
          {onToggleMeasuring && (
            <button
              onClick={onToggleMeasuring}
              className={`p-1.5 rounded-lg text-xs transition-colors border ${
                isMeasuring
                  ? "bg-emerald-500 text-cad-950 font-bold border-emerald-500 shadow-md animate-pulse"
                  : "text-cad-300 hover:text-white bg-cad-850/50 border-cad-800"
              }`}
              title="Laser Distance Measurement (Click 2 points)"
            >
              <Ruler className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Presentation Turntable Auto-Rotate Mode */}
          {onToggleAutoRotate && (
            <button
              onClick={onToggleAutoRotate}
              className={`p-1.5 rounded-lg text-xs transition-colors border ${
                autoRotate
                  ? "bg-cyan text-cad-950 font-bold border-cyan shadow-lg"
                  : "text-cad-300 hover:text-white bg-cad-850/50 border-cad-800"
              }`}
              title="Cinematic Presentation Turntable (Auto-Rotate)"
            >
              {autoRotate ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          <button
            onClick={onToggleGrid}
            className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-colors border ${
              showGrid
                ? "bg-cad-800 text-cyan border-cyan/40"
                : "text-cad-500 bg-cad-850/50 border-cad-800 line-through"
            }`}
            title="Toggle CAD Ground Grid"
          >
            GRID
          </button>

          {/* Lighting Controls Button */}
          <div className="relative">
            <button
              onClick={() => setShowLightingMenu(!showLightingMenu)}
              className={`p-1.5 rounded-lg text-xs transition-colors border ${
                showLightingMenu
                  ? "bg-amber-400 text-cad-950 border-amber-400 font-bold"
                  : "text-cad-300 hover:text-white bg-cad-850/50 border-cad-800"
              }`}
              title="Lighting & Sun Study Controls"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>

            {/* Lighting Popover Menu */}
            {showLightingMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-cad-900 border border-cad-700 rounded-xl p-3 shadow-2xl space-y-3 z-30 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-mono text-cyan uppercase tracking-wider">
                  Lighting & Sun Study
                </div>
                {/* Lighting Mode Selector */}
                <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
                  {(["day", "dusk", "studio"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onChangeLightingMode(mode)}
                      className={`py-1 rounded uppercase ${
                        lightingMode === mode
                          ? "bg-cyan text-cad-950 font-bold"
                          : "bg-cad-850 text-cad-300 hover:text-white"
                      }`}
                    >
                      {mode === "dusk" ? "Sunset" : mode}
                    </button>
                  ))}
                </div>
                {/* Sun Angle Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-cad-400">
                    <span>SOLAR AZIMUTH</span>
                    <span className="text-cyan">{sunAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={sunAngle}
                    onChange={(e) => onChangeSunAngle(Number(e.target.value))}
                    className="w-full accent-cyan bg-cad-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-5 bg-cad-800 mx-1 hidden sm:block" />

        {/* Model Actions: Upload & Reset */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-cad-800 hover:bg-cad-750 text-cad-200 border border-cad-700 transition-colors"
            title="Upload .GLB or .GLTF 3D Building Model"
          >
            <Upload className="w-3.5 h-3.5 text-cyan" />
            <span className="hidden sm:inline">Upload Model</span>
          </button>

          {isCustomModel && (
            <button
              onClick={onResetModel}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-mono bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              title="Reset to Default Architectural Sample Model"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset Sample</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-cad-300 hover:text-white bg-cad-850/50 border border-cad-800 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Floating Section Box Cut Elevation Slider */}
      {isSectionCut && onChangeSectionCutHeight && (
        <div className="flex items-center gap-3 bg-cad-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl px-3.5 py-2 shadow-2xl text-xs font-mono w-fit animate-in fade-in">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Scissors className="w-3.5 h-3.5" />
            <span>SECTION CUT:</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={sectionCutHeight}
            onChange={(e) => onChangeSectionCutHeight(Number(e.target.value))}
            className="w-40 accent-amber-400 bg-cad-800 h-1.5 rounded cursor-pointer"
          />
          <span className="text-amber-300 min-w-[42px] font-bold">
            {sectionCutHeight === 100 ? "FULL" : `${sectionCutHeight}%`}
          </span>
          <button
            onClick={onToggleSectionCut}
            className="text-cad-400 hover:text-white p-0.5 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating 3D Measurement Distance Readout */}
      {isMeasuring && (
        <div className="flex items-center gap-2.5 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/60 rounded-xl px-3.5 py-1.5 shadow-2xl text-xs font-mono text-emerald-300 animate-in fade-in">
          <Ruler className="w-3.5 h-3.5 text-emerald-400" />
          {measuredDistance !== null ? (
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">
                MEASURED SPAN: {measuredDistance.toFixed(2)} m ({Math.round(measuredDistance * 1000)} mm)
              </span>
              {onClearMeasurement && (
                <button
                  onClick={onClearMeasurement}
                  className="px-1.5 py-0.5 bg-emerald-800/60 hover:bg-emerald-700 text-white rounded text-[10px]"
                >
                  Reset
                </button>
              )}
            </div>
          ) : (
            <span>Click Point A, then Point B on the building surface to measure span</span>
          )}
        </div>
      )}

      {/* Auto-Rotate Turntable Active Pill */}
      {autoRotate && (
        <div className="flex items-center gap-2 bg-cyan/15 backdrop-blur-md border border-cyan/40 text-cyan rounded-lg px-3 py-1 text-[11px] font-mono w-fit animate-pulse">
          <Play className="w-3 h-3 fill-cyan" />
          <span>CINEMATIC PRESENTATION TURNTABLE ACTIVE</span>
        </div>
      )}

      {/* Helper Banner when Pin Mode is Active */}
      {isAddingAnnotation && (
        <div className="bg-rose-500/90 text-white text-xs px-3.5 py-1.5 rounded-lg border border-rose-400 font-mono shadow-2xl flex items-center gap-2 animate-bounce w-fit">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>Click anywhere on the 3D model surface to drop an issue pin!</span>
        </div>
      )}
    </div>
  );
}
