"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/context/AppContext";
import { getSupabaseStatus } from "@/lib/supabase";
import {
  Settings,
  Database,
  Sliders,
  RotateCcw,
  Shield,
  Monitor,
  CheckCircle2,
  HardDrive,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { showToast } = useApp();
  const supabaseStatus = getSupabaseStatus();

  const [unitSystem, setUnitSystem] = useState("metric");
  const [antialiasing, setAntialiasing] = useState(true);
  const [wireframeDefault, setWireframeDefault] = useState(false);
  const [lodThreshold, setLodThreshold] = useState("LOD 350");

  const handleResetData = () => {
    try {
      localStorage.removeItem("mr_cdr_projects");
      localStorage.removeItem("mr_cdr_annotations");
      localStorage.removeItem("mr_cdr_user");
      showToast("Workspace Reset", "Demo data restored to initial factory state.", "info");
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      showToast("Notice", "Local storage reset complete.", "info");
    }
  };

  return (
    <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div>
            <div className="text-xs font-mono uppercase text-cyan tracking-wider">
              CAD CONFIGURATION & ENVIRONMENT
            </div>
            <h1 className="text-2xl font-bold text-cad-50 tracking-tight">
              Platform Settings
            </h1>
            <p className="text-xs text-cad-400 mt-1">
              Configure CAD measurement standards, 3D viewport rendering parameters, and backend integrations.
            </p>
          </div>

          {/* Section 1: Supabase Integration Preparation */}
          <div className="p-6 rounded-xl bg-cad-900 border border-cad-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-cad-100">
                    Supabase Cloud Backend
                  </h3>
                  <p className="text-xs text-cad-400">
                    PostgreSQL database, real-time presence subscriptions, and S3-compatible model storage.
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                INTEGRATION READY
              </span>
            </div>

            <div className="p-4 bg-cad-850 rounded-lg border border-cad-750 text-xs space-y-2">
              <div className="flex items-center justify-between text-cad-300">
                <span>Active Mode:</span>
                <span className="font-mono text-cyan">
                  Client-side reactive store (High-performance demo)
                </span>
              </div>
              <div className="flex items-center justify-between text-cad-300">
                <span>Production Adapter:</span>
                <span className="font-mono text-cad-400">
                  Ready for NEXT_PUBLIC_SUPABASE_URL & ANON_KEY
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: CAD Units & Geometric Calibration */}
          <div className="p-6 rounded-xl bg-cad-900 border border-cad-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-cyan/10 text-cyan border border-cyan/30">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cad-100">
                  CAD Coordinates & Unit Standards
                </h3>
                <p className="text-xs text-cad-400">
                  Standardize architectural dimensions across all imported IFC and RVT files.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
                  Primary Measurement Units
                </label>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  className="w-full sm:w-80 px-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan"
                >
                  <option value="metric">Metric (Millimeters / Meters - ISO 1000)</option>
                  <option value="imperial">Imperial (Architectural Feet & Inches)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
                  Default Target LOD (Level of Development)
                </label>
                <select
                  value={lodThreshold}
                  onChange={(e) => setLodThreshold(e.target.value)}
                  className="w-full sm:w-80 px-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan"
                >
                  <option value="LOD 300">LOD 300 - General Construction Assembly</option>
                  <option value="LOD 350">LOD 350 - Detailed Clash Detection & Fabrication</option>
                  <option value="LOD 400">LOD 400 - Full Tender & Manufacturing Spec</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: WebGL Viewport Quality */}
          <div className="p-6 rounded-xl bg-cad-900 border border-cad-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-electric/15 text-electric-bright border border-electric/30">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cad-100">
                  Three.js Viewport & Graphics Engine
                </h3>
                <p className="text-xs text-cad-400">
                  Control hardware acceleration, MSAA antialiasing, and shadow map resolution.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={antialiasing}
                  onChange={(e) => setAntialiasing(e.target.checked)}
                  className="w-4 h-4 rounded bg-cad-850 border-cad-700 text-cyan focus:ring-cyan"
                />
                <span className="text-xs text-cad-200">
                  Enable High-DPI Multi-Sample Antialiasing (MSAA 4X)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wireframeDefault}
                  onChange={(e) => setWireframeDefault(e.target.checked)}
                  className="w-4 h-4 rounded bg-cad-850 border-cad-700 text-cyan focus:ring-cyan"
                />
                <span className="text-xs text-cad-200">
                  Render technical CAD edge overlays by default on model load
                </span>
              </label>
            </div>
          </div>

          {/* Section 4: Demo State Reset */}
          <div className="p-6 rounded-xl bg-cad-900 border border-cad-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-cad-100">
                Reset Architectural Demo Workspace
              </h3>
              <p className="text-xs text-cad-400 mt-0.5">
                Clear all custom projects, new annotations, and restore initial sample datasets.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              className="gap-2 shrink-0 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

