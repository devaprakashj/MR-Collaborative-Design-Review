"use client";

import React from "react";
import { Project, ModelMetadata } from "@/types";
import { Box, Layers, HardHat, FileSpreadsheet, Compass, CheckCircle2 } from "lucide-react";

interface ModelInspectorPanelProps {
  project: Project;
  model: ModelMetadata;
}

export function ModelInspectorPanel({ project, model }: ModelInspectorPanelProps) {
  return (
    <div className="w-80 flex flex-col h-full bg-cad-900/95 border-l border-cad-800 p-4 overflow-y-auto space-y-4">
      {/* Header */}
      <div>
        <div className="text-[10px] font-mono uppercase text-cad-400">
          BIM INSPECTION METADATA
        </div>
        <h3 className="text-sm font-bold text-cad-50 mt-0.5 truncate">
          {model.name}
        </h3>
        <span className="inline-block mt-1 px-2 py-0.5 bg-cyan/15 text-cyan border border-cyan/30 rounded font-mono text-[10px]">
          {model.format} • {model.lod} SPECIFICATION
        </span>
      </div>

      {/* Primary Model Stats */}
      <div className="p-3 bg-cad-850 rounded-lg border border-cad-750 grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-cad-400 font-mono block">FLOORS</span>
          <span className="font-mono font-bold text-cad-100">{model.floors} Levels</span>
        </div>
        <div>
          <span className="text-[10px] text-cad-400 font-mono block">AREA (GFA)</span>
          <span className="font-mono font-bold text-cad-100">{model.grossFloorArea}</span>
        </div>
        <div>
          <span className="text-[10px] text-cad-400 font-mono block">POLYGONS</span>
          <span className="font-mono font-bold text-cad-100">{model.meshCount.toLocaleString()} meshes</span>
        </div>
        <div>
          <span className="text-[10px] text-cad-400 font-mono block">VERTICES</span>
          <span className="font-mono font-bold text-cad-100">{model.vertexCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Engineering Specs */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase text-cad-400">
          Geometric Calibration
        </div>
        <div className="p-3 bg-cad-850/60 rounded-lg border border-cad-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-cad-400">Measurement Units:</span>
            <span className="font-mono text-cyan-300">{model.units}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cad-400">Spatial Ref:</span>
            <span className="font-mono text-[11px] text-cad-200 truncate max-w-[150px]">
              {model.coordinateSystem}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cad-400">Package Version:</span>
            <span className="font-mono text-cyan-300">{model.version}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-cad-400">File Weight:</span>
            <span className="font-mono text-cad-200">{model.fileSize}</span>
          </div>
        </div>
      </div>

      {/* BIM Structural Layers Breakdown */}
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase text-cad-400">
          Component Classification
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between p-2 rounded bg-cad-850/50 border border-cad-800">
            <span className="text-cad-300">IfcColumn / Trusses</span>
            <span className="font-mono text-cyan-400">128 Elements</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-cad-850/50 border border-cad-800">
            <span className="text-cad-300">IfcCurtainWall</span>
            <span className="font-mono text-cyan-400">54 Panels</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-cad-850/50 border border-cad-800">
            <span className="text-cad-300">IfcSlab (Mass-Timber)</span>
            <span className="font-mono text-cyan-400">18 Slabs</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded bg-cad-850/50 border border-cad-800">
            <span className="text-cad-300">IfcDuctSegment (MEP)</span>
            <span className="font-mono text-amber-400">92 Runs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

