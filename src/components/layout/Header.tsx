"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Bell,
  Search,
  Shield,
  Layers,
  Sparkles,
  UserCheck,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserAvatar } from "@/components/ui/UserAvatar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onOpenNewProject?: () => void;
}

export function Header({ onOpenNewProject }: HeaderProps) {
  const { currentUser, switchRole, projects } = useApp();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  const filteredSearch = searchQuery.trim()
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-cad-800 bg-cad-900/80 backdrop-blur-md px-6">
      {/* Search Input with CAD Command style */}
      <div className="relative w-80 lg:w-96">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cad-400" />
          <input
            type="text"
            placeholder="Search projects, BIM models, specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            className="w-full pl-9 pr-12 py-1.5 bg-cad-850/80 border border-cad-750 rounded-md text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/40 transition-all font-sans"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-cad-800 text-cad-400 px-1.5 py-0.5 rounded border border-cad-700 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Live Search Results Dropdown */}
        {searchFocused && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-cad-900 border border-cad-700 rounded-lg shadow-2xl p-2 z-50">
            <div className="text-[10px] font-mono text-cad-400 px-2 py-1 border-b border-cad-800">
              MATCHING ARCHITECTURAL PROJECTS ({filteredSearch.length})
            </div>
            {filteredSearch.length === 0 ? (
              <div className="text-xs text-cad-400 p-3 text-center">
                No matching projects found
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-1">
                {filteredSearch.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      router.push(`/projects/${p.id}`);
                      setSearchQuery("");
                    }}
                    className="flex items-center justify-between p-2 rounded hover:bg-cad-800 text-left transition-colors"
                  >
                    <div>
                      <div className="text-xs font-medium text-cad-100">
                        {p.name}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400">
                        {p.code} • {p.category}
                      </div>
                    </div>
                    <Badge variant="cyan" size="sm">
                      {p.status.replace("_", " ")}
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Project Creation Trigger */}
        {onOpenNewProject && (
          <Button
            size="sm"
            onClick={onOpenNewProject}
            className="hidden sm:inline-flex gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Button>
        )}

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-cad-850 hover:bg-cad-800 border border-cad-700 rounded-lg transition-colors text-xs"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser.role === "architect" ? "bg-cyan" : "bg-electric-bright"
                }`}
              />
              <span className="font-mono text-cad-400">ROLE:</span>
              <span className="font-semibold text-cad-100 uppercase">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-cad-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-cad-900 border border-cad-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-cad-800">
                <div className="text-[10px] font-mono uppercase text-cad-400">
                  Switch Active Persona
                </div>
                <div className="text-xs text-cad-200 mt-0.5">
                  Simulate permissions & review workflows
                </div>
              </div>
              <div className="flex flex-col gap-1 p-1">
                <button
                  onClick={() => {
                    switchRole("architect");
                    setRoleMenuOpen(false);
                  }}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-colors ${
                    currentUser.role === "architect"
                      ? "bg-cad-800 border border-cyan/30"
                      : "hover:bg-cad-800/60"
                  }`}
                >
                  <UserAvatar
                    name="Diwakar"
                    role="architect"
                    className="w-7 h-7 text-xs mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cad-100">
                        Diwakar
                      </span>
                      {currentUser.role === "architect" && (
                        <Check className="w-3.5 h-3.5 text-cyan" />
                      )}
                    </div>
                    <div className="text-[11px] text-cad-400">
                      Lead Architect • Author & Edit
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    switchRole("reviewer");
                    setRoleMenuOpen(false);
                  }}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg text-left transition-colors ${
                    currentUser.role === "reviewer"
                      ? "bg-cad-800 border border-electric/30"
                      : "hover:bg-cad-800/60"
                  }`}
                >
                  <UserAvatar
                    name="Deva"
                    role="reviewer"
                    className="w-7 h-7 text-xs mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cad-100">
                        Deva
                      </span>
                      {currentUser.role === "reviewer" && (
                        <Check className="w-3.5 h-3.5 text-electric-bright" />
                      )}
                    </div>
                    <div className="text-[11px] text-cad-400">
                      Senior Reviewer • Approve & Sign-off
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <Link
          href="/activity"
          className="relative p-2 rounded-lg bg-cad-850 hover:bg-cad-800 text-cad-300 hover:text-cad-100 border border-cad-750 transition-colors"
          title="Activity & Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan" />
        </Link>

        {/* User Avatar Badge */}
        <div className="flex items-center gap-3 pl-2 border-l border-cad-800">
          <UserAvatar
            name={currentUser.name}
            avatar={currentUser.avatar}
            initials={currentUser.initials}
            role={currentUser.role}
            className="w-8 h-8 text-xs"
          />
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-cad-100 leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-cad-400 truncate max-w-[120px]">
              {currentUser.organization}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

