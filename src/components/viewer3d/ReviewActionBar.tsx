"use client";

import React, { useState } from "react";
import { Project, ReviewAction } from "@/types";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getStatusBadgeConfig } from "@/lib/utils";

interface ReviewActionBarProps {
  project: Project;
}

export function ReviewActionBar({ project }: ReviewActionBarProps) {
  const { addReviewAction, currentUser } = useApp();
  const [modalAction, setModalAction] = useState<ReviewAction["action"] | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusConfig = getStatusBadgeConfig(project.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalAction || !comment.trim()) return;

    setIsSubmitting(true);
    addReviewAction(project.id, modalAction, comment.trim());
    setIsSubmitting(false);
    setModalAction(null);
    setComment("");
  };

  return (
    <>
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Status Capsule */}
        <div className="pointer-events-auto flex items-center gap-3 bg-cad-900/90 backdrop-blur-md border border-cad-750 p-2.5 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
            <span className="text-xs font-mono uppercase text-cad-300">STATUS:</span>
            <span className="text-xs font-bold text-cad-50 font-mono">
              {statusConfig.label.toUpperCase()}
            </span>
          </div>

          <div className="w-px h-4 bg-cad-800" />

          {/* Active Collaborator Peers */}
          <div className="flex items-center gap-2 text-xs text-cad-400">
            <span className="font-mono text-[10px]">LIVE PEERS:</span>
            <div className="flex -space-x-1.5">
              {project.collaborators.slice(0, 3).map((c) => (
                <img
                  key={c.id}
                  src={c.avatar}
                  alt={c.name}
                  title={`${c.name} (${c.role})`}
                  className="w-5 h-5 rounded-full ring-2 ring-cad-900 object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Review Controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-cad-900/90 backdrop-blur-md border border-cad-750 p-1.5 rounded-xl shadow-2xl">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setModalAction("requested_changes")}
            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs font-mono"
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
            Request Changes
          </Button>

          <Button
            size="sm"
            onClick={() => setModalAction("approved")}
            className="bg-emerald-500 hover:bg-emerald-400 text-cad-950 font-mono text-xs font-bold shadow-lg"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
            Approve Design
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!modalAction}
        onClose={() => setModalAction(null)}
        title={
          modalAction === "approved"
            ? "Formal Architectural Sign-Off"
            : "Request Engineering Revisions"
        }
        subtitle={`Project: ${project.name} (${project.code})`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
              Reviewer Commentary & Conditions <span className="text-cyan">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder={
                modalAction === "approved"
                  ? "Detail approval notes, certified code compliance, and tender readiness..."
                  : "Detail required modifications, clash resolutions, or re-submission criteria..."
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 bg-cad-850 border border-cad-700 rounded-md text-sm text-cad-50 placeholder:text-cad-500 focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="p-3 bg-cad-850/60 border border-cad-800 rounded-lg flex items-center justify-between text-xs">
            <span className="text-cad-400">Signing as:</span>
            <span className="font-semibold text-cad-100">
              {currentUser.name} ({currentUser.title})
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalAction(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className={
                modalAction === "approved"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-cad-950"
                  : "bg-amber-500 hover:bg-amber-400 text-cad-950"
              }
            >
              {modalAction === "approved"
                ? "Certify & Approve Design"
                : "Submit Change Request"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

