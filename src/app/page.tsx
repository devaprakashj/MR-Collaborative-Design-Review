"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { DEMO_USERS } from "@/lib/mockData";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  Box,
  Compass,
  Layers,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, showToast } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDemoRole, setSelectedDemoRole] = useState<"architect" | "reviewer">("architect");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!email.trim()) {
      setAuthError("Please enter your registered email address.");
      return;
    }
    if (!password.trim()) {
      setAuthError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const lowerEmail = email.trim().toLowerCase();
      let user = DEMO_USERS.architect;

      if (lowerEmail.includes("deva") || selectedDemoRole === "reviewer") {
        user = {
          ...DEMO_USERS.reviewer,
          email: email.trim(),
        };
      } else {
        user = {
          ...DEMO_USERS.architect,
          email: email.trim(),
        };
      }

      setCurrentUser(user);
      try {
        localStorage.setItem("mr_cdr_user", JSON.stringify(user));
      } catch {
        // Ignore
      }

      showToast(
        "Authentication Successful",
        `Welcome, ${user.name} (${user.title})`,
        "success"
      );
      router.push("/dashboard");
    }, 500);
  };

  const handleSelectRole = (role: "architect" | "reviewer") => {
    setSelectedDemoRole(role);
    setAuthError("");
    if (role === "architect") {
      setEmail("diwakar24281@gmail.com");
      setPassword("password123");
    } else {
      setEmail("deva@mr-cdr.io");
      setPassword("password123");
    }
  };

  const handleQuickDemo = (role: "architect" | "reviewer") => {
    setSelectedDemoRole(role);
    const user = role === "architect" ? DEMO_USERS.architect : DEMO_USERS.reviewer;
    setCurrentUser(user);
    try {
      localStorage.setItem("mr_cdr_user", JSON.stringify(user));
    } catch {
      // Ignore
    }
    showToast(
      "Quick Access Activated",
      `Logged in as ${user.name} [${role.toUpperCase()}]`,
      "info"
    );
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-cad-950 flex flex-col justify-between relative overflow-hidden bg-cad-grid">
      {/* CAD Ambient Blueprint Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-electric/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-cyan/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Bar Branding */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6 border-b border-cad-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan to-electric flex items-center justify-center shadow-cyan-glow-sm">
            <Box className="w-5 h-5 text-cad-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-cad-50">
                MR Collaborative Design Review
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan/15 text-cyan border border-cyan/30">
                v2.4 CAD
              </span>
            </div>
            <div className="text-[11px] text-cad-400 font-mono">
              BIM 3D Superstructure & Multi-Disciplinary Review Suite
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-cad-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ENGINE CLOUD ONLINE
          </span>
          <span className="text-cad-700">|</span>
          <span>IFC 4x3 & GLTF 2.0</span>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cad-900 border border-cad-700 text-xs text-cad-300 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan" />
              <span>SPATIAL CLASH DETECTION & ARCHITECTURAL SIGN-OFF</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-cad-50 tracking-tight leading-[1.15]">
              Architectural review at the speed of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan via-electric-bright to-blue-400">
                precision 3D.
              </span>
            </h1>

            <p className="text-base text-cad-300 leading-relaxed max-w-xl">
              Inspect mass-timber cantilevers, double-curved facades, and complex
              MEP routes in interactive WebGL. Pin markups, resolve engineering
              conflicts, and certify projects with verifiable audit trails.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-cad-900/80 border border-cad-800">
                <Compass className="w-5 h-5 text-cyan mb-2" />
                <div className="text-xs font-semibold text-cad-100">
                  Full 3D Inspection
                </div>
                <div className="text-[11px] text-cad-400 mt-1">
                  Three.js & R3F LOD 350 model viewer
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-cad-900/80 border border-cad-800">
                <Layers className="w-5 h-5 text-electric-bright mb-2" />
                <div className="text-xs font-semibold text-cad-100">
                  Spatial Markups
                </div>
                <div className="text-[11px] text-cad-400 mt-1">
                  Drop 3D issue pins on coordinate surfaces
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-cad-900/80 border border-cad-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-xs font-semibold text-cad-100">
                  Compliance Sign-Off
                </div>
                <div className="text-[11px] text-cad-400 mt-1">
                  Certify structural & egress compliance
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:col-span-5 bg-cad-900/95 border border-cad-750 rounded-2xl p-6 sm:p-8 shadow-cad-panel backdrop-blur-xl cad-corner-marks relative">
            <div className="mb-5">
              <div className="text-xs font-mono uppercase text-cyan tracking-wider">
                PORTAL AUTHENTICATION
              </div>
              <h2 className="text-xl font-bold text-cad-50 mt-1">
                Sign In to Review Space
              </h2>
              <p className="text-xs text-cad-400 mt-1">
                Select an account or enter your credentials below
              </p>
            </div>

            {/* Role Persona Cards */}
            <div className="space-y-2 mb-5">
              <div className="text-[11px] font-mono uppercase text-cad-400 flex items-center justify-between">
                <span>Select Account Role:</span>
                <span className="text-[10px] text-cyan-400 lowercase">click to auto-fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSelectRole("architect")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDemoRole === "architect"
                      ? "bg-cad-800 border-cyan text-cad-50 shadow-cyan-glow-sm ring-1 ring-cyan/40"
                      : "bg-cad-850/60 border-cad-750 text-cad-400 hover:text-cad-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <UserAvatar name="Diwakar" role="architect" className="w-6 h-6 text-[10px]" />
                    {selectedDemoRole === "architect" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-cad-100">
                    Diwakar
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    Lead Architect
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole("reviewer")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDemoRole === "reviewer"
                      ? "bg-cad-800 border-electric-bright text-cad-50 shadow-blue-glow ring-1 ring-electric-bright/40"
                      : "bg-cad-850/60 border-cad-750 text-cad-400 hover:text-cad-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <UserAvatar name="Deva" role="reviewer" className="w-6 h-6 text-[10px]" />
                    {selectedDemoRole === "reviewer" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-electric-bright" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-cad-100">
                    Deva
                  </div>
                  <div className="text-[10px] text-electric-bright font-mono">
                    Senior Reviewer
                  </div>
                </button>
              </div>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleCustomLogin} className="space-y-3.5">
              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono animate-in fade-in">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAuthError("");
                    }}
                    placeholder={
                      selectedDemoRole === "architect"
                        ? "diwakar24281@gmail.com"
                        : "deva@mr-cdr.io"
                    }
                    className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-lg text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-cad-300">
                    Password
                  </label>
                  <span className="text-[10px] font-mono text-cad-400">
                    (default: password123)
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-lg text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/40"
                  />
                </div>
              </div>

              {/* Login Submit Button */}
              <Button
                type="submit"
                className="w-full py-2.5 mt-1 flex items-center justify-center gap-2"
                isLoading={isLoading}
              >
                <span>Enter Architectural Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              {/* Quick One-Click Direct Access */}
              <div className="pt-3 border-t border-cad-800 grid grid-cols-2 gap-2 text-center">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("architect")}
                  className="py-1.5 px-2 bg-cyan/10 hover:bg-cyan/20 text-cyan border border-cyan/30 rounded-lg text-[11px] font-mono transition-colors"
                >
                  ⚡ Direct as Diwakar
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("reviewer")}
                  className="py-1.5 px-2 bg-electric/15 hover:bg-electric/25 text-electric-bright border border-electric/30 rounded-lg text-[11px] font-mono transition-colors"
                >
                  ⚡ Direct as Deva
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-4 border-t border-cad-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-cad-400 font-mono gap-2">
        <div>MR Collaborative Design Review • Architectural Engineering Standard</div>
        <div className="flex items-center gap-4">
          <span>WebGL 2.0</span>
          <span>BIM LOD 350</span>
          <span>Supabase Bridge Ready</span>
        </div>
      </footer>
    </div>
  );
}
