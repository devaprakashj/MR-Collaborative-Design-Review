"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users2,
  Activity,
  Settings,
  Box,
  Compass,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

export function Sidebar() {
  const pathname = usePathname();
  const { projects } = useApp();

  const pendingCount = projects.filter((p) => p.status === "in_review").length;

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Projects",
      href: "/projects",
      icon: FolderKanban,
      badge: `${projects.length}`,
    },
    {
      label: "All Reviews",
      href: "/reviews",
      icon: CheckSquare,
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
      badgeVariant: "cyan" as const,
    },
    {
      label: "Collaborators",
      href: "/collaborators",
      icon: Users2,
    },
    {
      label: "Activity History",
      href: "/activity",
      icon: Activity,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-cad-800 bg-cad-900/90 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-cad-800 gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan to-electric flex items-center justify-center shadow-cyan-glow-sm">
            <Box className="w-5 h-5 text-cad-950 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-cad-50">
                MR // CDR
              </span>
              <span className="text-[9px] px-1 py-0.2 bg-cyan/15 text-cyan font-mono rounded">
                PRO
              </span>
            </div>
            <div className="text-[10px] text-cad-400 font-mono tracking-wider">
              DESIGN REVIEW
            </div>
          </div>
        </div>

        {/* CAD Coordinate Bar */}
        <div className="px-6 py-2.5 bg-cad-850/40 border-b border-cad-800/60 flex items-center justify-between text-[10px] font-mono text-cad-400">
          <span>COORDINATES</span>
          <span className="text-cyan-400">WGS84 • EPSG:3857</span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cad-400 px-3 py-2">
            Main Navigation
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-cad-800 text-cyan border border-cyan/30 shadow-sm"
                    : "text-cad-300 hover:text-cad-50 hover:bg-cad-850"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-cyan"
                        : "text-cad-400 group-hover:text-cad-200"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[11px] font-mono rounded-full",
                      item.badgeVariant === "cyan"
                        ? "bg-cyan/20 text-cyan font-bold"
                        : "bg-cad-750 text-cad-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Fast CAD Quick Launch */}
        <div className="px-4 py-2">
          <div className="p-3 rounded-lg bg-cad-850/60 border border-cad-750">
            <div className="flex items-center justify-between text-xs text-cad-200 font-medium mb-1.5">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Compass className="w-3.5 h-3.5" /> 3D Quick View
              </span>
              <span className="text-[10px] text-cad-400 font-mono">Nordic Forum</span>
            </div>
            <p className="text-[11px] text-cad-400 mb-2.5 leading-relaxed">
              Superstructure REV03 ready for markup and clash review.
            </p>
            <Link
              href="/projects/prj-nordic-cultural/review"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-cyan/15 hover:bg-cyan/25 text-cyan-300 border border-cyan/30 rounded text-xs font-medium transition-all"
            >
              Launch 3D Workspace
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-cad-800 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-cad-400 font-mono">SUPABASE</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            READY
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-cad-400 font-mono">GRAPHICS</span>
          <span className="text-cad-300 font-mono text-[10px]">WEBGL 2.0 / R3F</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-cad-400 hover:text-rose-400 transition-colors pt-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Session / Relog</span>
        </Link>
      </div>
    </aside>
  );
}

