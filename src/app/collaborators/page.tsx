"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  Users2,
  UserPlus,
  Mail,
  Shield,
  Building,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function CollaboratorsPage() {
  const { collaborators, addCollaborator } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("reviewer");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    addCollaborator(inviteEmail.trim(), inviteRole);
    setInviteEmail("");
    setIsInviteOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-cad-950 text-cad-50 bg-cad-grid">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase text-cyan tracking-wider">
                PEER NETWORK
              </div>
              <h1 className="text-2xl font-bold text-cad-50 tracking-tight">
                Collaborators & Reviewers
              </h1>
              <p className="text-xs text-cad-400 mt-1">
                Authorized architectural principals, structural inspectors, and client delegates.
              </p>
            </div>

            <Button
              onClick={() => setIsInviteOpen(true)}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Reviewer</span>
            </Button>
          </div>

          {/* Collaborator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborators.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-xl bg-cad-900 border border-cad-800 hover:border-cad-700 transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-cad-700"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-cad-100">{c.name}</h3>
                      <p className="text-xs text-cad-400">{c.title}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                      c.status === "online"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : c.status === "away"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-slate-500/10 text-slate-400 border-slate-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.status === "online"
                          ? "bg-emerald-400"
                          : c.status === "away"
                          ? "bg-amber-400"
                          : "bg-slate-500"
                      }`}
                    />
                    {c.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 bg-cad-850/60 rounded-lg border border-cad-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-cad-300">
                    <span className="text-cad-500 font-mono text-[11px]">ROLE:</span>
                    <Badge variant={c.role === "reviewer" ? "electric" : "cyan"}>
                      {c.role}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-cad-300 truncate">
                    <span className="text-cad-500 font-mono text-[11px]">EMAIL:</span>
                    <span className="font-mono text-[11px] text-cad-300 truncate max-w-[170px]">
                      {c.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-cad-300">
                    <span className="text-cad-500 font-mono text-[11px]">LAST ACTIVE:</span>
                    <span className="font-mono text-[11px] text-cad-400">
                      {c.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Project Collaborator"
        subtitle="Grant review, markup, or approval privileges to project peers"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
              Email Address <span className="text-cyan">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="colleague@architecture-studio.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
              Permission Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 bg-cad-850 border border-cad-700 rounded text-xs text-cad-100 focus:outline-none focus:border-cyan"
            >
              <option value="reviewer">Reviewer (Sign-off, annotations & clash markups)</option>
              <option value="architect">Architect (Model uploads, revisions & editing)</option>
              <option value="client">Client (View-only & milestone tracking)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsInviteOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

