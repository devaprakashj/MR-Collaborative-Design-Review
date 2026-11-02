"use client";

import React, { useState, useRef } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import {
  Upload,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  Box,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface ModelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModelLoaded: (modelData: {
    url: string;
    name: string;
    size: string;
    format: "GLB" | "GLTF";
    meshCount: number;
    vertexCount: number;
    materialsCount: number;
  }) => void;
  onResetToSample: () => void;
  currentModelName?: string;
  isCustomLoaded?: boolean;
}

export function ModelUploadModal({
  isOpen,
  onClose,
  onModelLoaded,
  onResetToSample,
  currentModelName,
  isCustomLoaded,
}: ModelUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = async (file: File) => {
    setError(null);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "glb" && extension !== "gltf") {
      setError("Unsupported format. Please select a .glb or .gltf 3D building model file.");
      return;
    }

    setIsParsing(true);
    setParseStatus(`Reading ${file.name} (${formatFileSize(file.size)})...`);

    try {
      const buffer = await file.arrayBuffer();
      setParseStatus("Parsing 3D scene & indexing BIM meshes...");

      const loader = new GLTFLoader();
      loader.parse(
        buffer,
        "",
        (gltf) => {
          let meshCount = 0;
          let vertexCount = 0;
          const materialsSet = new Set<string>();

          gltf.scene.traverse((node: any) => {
            if (node.isMesh) {
              meshCount++;
              if (node.geometry && node.geometry.attributes.position) {
                vertexCount += node.geometry.attributes.position.count;
              }
              if (node.material) {
                if (Array.isArray(node.material)) {
                  node.material.forEach((m: any) => materialsSet.add(m.uuid));
                } else {
                  materialsSet.add(node.material.uuid);
                }
              }
            }
          });

          const objectUrl = URL.createObjectURL(file);

          onModelLoaded({
            url: objectUrl,
            name: file.name,
            size: formatFileSize(file.size),
            format: extension === "glb" ? "GLB" : "GLTF",
            meshCount: meshCount || 1,
            vertexCount: vertexCount || 1000,
            materialsCount: materialsSet.size || 1,
          });

          setIsParsing(false);
          setParseStatus("");
          onClose();
        },
        (err) => {
          console.error("GLTF Loader parse error:", err);
          setError("Failed to parse 3D geometry buffers. Please ensure the file is not corrupted.");
          setIsParsing(false);
        }
      );
    } catch (err: any) {
      console.error("File read error:", err);
      setError(`Error reading file: ${err.message || "Unknown error"}`);
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // One-click demo test with built-in GLB
  const handleLoadSampleGLB = async () => {
    setError(null);
    setIsParsing(true);
    setParseStatus("Fetching built-in architectural sample GLB (32 KB)...");

    try {
      const res = await fetch("/models/sample-architecture.glb");
      if (!res.ok) throw new Error("Could not find sample model asset.");
      const blob = await res.blob();
      const file = new File([blob], "Atrium_Pavilion_LOD350.glb", {
        type: "model/gltf-binary",
      });
      await processFile(file);
    } catch (err: any) {
      setError(`Could not load sample GLB: ${err.message}`);
      setIsParsing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Architectural 3D Model"
      subtitle="Select or drop .glb / .gltf BIM files for WebGL inspection"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Box */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
            dragOver
              ? "border-cyan bg-cyan/10 scale-[1.01]"
              : "border-cad-750 hover:border-cyan/50 bg-cad-850/40 hover:bg-cad-850/70"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan shadow-cyan-glow-sm">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <div className="text-sm font-semibold text-cad-100">
                Click to browse or drop your 3D model here
              </div>
              <p className="text-xs text-cad-400 mt-1 font-mono">
                Supports binary <span className="text-cyan font-bold">.GLB</span> and{" "}
                <span className="text-electric-bright font-bold">.GLTF</span> assemblies
              </p>
            </div>

            <span className="text-[10px] text-cad-500 font-mono">
              Mesh optimization & auto-centering enabled
            </span>
          </div>
        </div>

        {/* Parsing Progress Indicator */}
        {isParsing && (
          <div className="p-3 bg-cad-850 rounded-lg border border-cyan/40 flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-cyan border-t-transparent rounded-full animate-spin shrink-0" />
            <div className="text-xs font-mono text-cyan truncate">
              {parseStatus}
            </div>
          </div>
        )}

        {/* Quick Sample Test Option */}
        <div className="p-4 bg-cad-850/60 rounded-xl border border-cad-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Box className="w-4 h-4 text-cyan" />
            <div>
              <div className="text-xs font-semibold text-cad-100">
                Need a model to test right now?
              </div>
              <div className="text-[11px] text-cad-400">
                Load our built-in Atrium Pavilion GLB sample asset
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLoadSampleGLB}
            isLoading={isParsing}
            className="shrink-0 text-xs font-mono"
          >
            Load Sample GLB
          </Button>
        </div>

        {/* Currently Loaded Model Status & Reset */}
        {isCustomLoaded && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-cad-200">
                Viewing custom model:{" "}
                <span className="font-semibold text-emerald-400 font-mono">
                  {currentModelName}
                </span>
              </span>
            </div>

            <button
              onClick={() => {
                onResetToSample();
                onClose();
              }}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to Default
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-cad-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

