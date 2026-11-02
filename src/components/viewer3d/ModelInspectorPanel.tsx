"use client";

import React from "react";
import { Project, ModelMetadata, BimElementData } from "@/types";
import {
  Box,
  Layers,
  HardHat,
  FileSpreadsheet,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  Tag,
  Flame,
  ShieldAlert,
  X,
  Target,
} from "lucide-react";

interface ModelInspectorPanelProps {
  project: Project;
  model: ModelMetadata;
  selectedElement?: BimElementData | null;
  onClearSelectedElement?: () => void;
  onAddAnnotationForElement?: (element: BimElementData) => void;
}

export function ModelInspectorPanel({
  project,
  model,
  selectedElement,
  onClearSelectedElement,
  onAddAnnotationForElement,
}: ModelInspectorPanelProps) {
  return (
    <div className="w-80 flex flex-col h-full bg-cad-900/95 border-l border-cad-800 p-4 overflow-y-auto space-y-4">
      {/* Dynamic Header: Active Element vs Model Overview */}
      {selectedElement ? (
        <div className="p-3 bg-cyan/10 border border-cyan/40 rounded-xl space-y-2 relative animate-fadeIn">
          <button
            onClick={onClearSelectedElement}
            className="absolute top-2.5 right-2.5 p-1 text-cad-400 hover:text-white rounded hover:bg-cad-800"
            title="Deselect element"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-cyan tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>SELECTED BIM ELEMENT</span>
          </div>
          <h3 className="text-sm font-bold text-white pr-6 leading-tight">
            {selectedElement.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-1.5 py-0.5 bg-cad-800 border border-cad-700 text-cad-200 text-[10px] font-mono rounded">
              {selectedElement.ifcType}
            </span>
            {selectedElement.clashStatus === "conflict" ? (
              <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono rounded flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                CLASH DETECTED
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono rounded flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                PASSED
              </span>
            )}
          </div>
        </div>
      ) : (
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
      )}

      {/* When Element is Selected: Full IFC & Engineering Properties */}
      {selectedElement ? (
        <div className="space-y-3">
          <div className="p-3 bg-cad-850 rounded-lg border border-cad-750 space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] text-cad-400 font-mono block">MATERIAL SPECIFICATION</span>
              <span className="font-medium text-cad-100">{selectedElement.material}</span>
            </div>
            <div>
              <span className="text-[10px] text-cad-400 font-mono block">DIMENSIONS / BOUNDS</span>
              <span className="font-mono text-cyan-300">{selectedElement.dimensions}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-cad-800">
              <div>
                <span className="text-[10px] text-cad-400 font-mono block">FIRE RATING</span>
                <span className="font-mono text-amber-300 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  {selectedElement.fireRating}
                </span>
              </div>
              {selectedElement.thermalTransmittance && (
                <div>
                  <span className="text-[10px] text-cad-400 font-mono block">U-VALUE</span>
                  <span className="font-mono text-emerald-300">{selectedElement.thermalTransmittance}</span>
                </div>
              )}
            </div>
            {selectedElement.structuralLoad && (
              <div className="pt-1 border-t border-cad-800">
                <span className="text-[10px] text-cad-400 font-mono block">STRUCTURAL LOAD BEARING</span>
                <span className="font-mono text-cad-200">{selectedElement.structuralLoad}</span>
              </div>
            )}
            {selectedElement.manufacturer && (
              <div className="pt-1 border-t border-cad-800">
                <span className="text-[10px] text-cad-400 font-mono block">CERTIFIED FABRICATOR</span>
                <span className="text-cad-300 font-medium">{selectedElement.manufacturer}</span>
              </div>
            )}
          </div>

          {onAddAnnotationForElement && (
            <button
              onClick={() => onAddAnnotationForElement(selectedElement)}
              className="w-full py-2 px-3 bg-cyan/15 hover:bg-cyan/25 border border-cyan/40 text-cyan rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>PIN MARKUP ON THIS ELEMENT</span>
            </button>
          )}
        </div>
      ) : (
        /* Default: Primary Model Stats */
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
      )}

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
