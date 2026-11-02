"use client";

import React, { useState } from "react";
import { Annotation, Project } from "@/types";
import { useApp } from "@/context/AppContext";
import { formatTimeAgo } from "@/lib/utils";
import {
  AlertOctagon,
  CheckCircle,
  MessageSquare,
  Send,
  X,
  Plus,
  Filter,
  Check,
  ChevronDown,
  Layers,
  Crosshair,
  Pencil,
  Trash2,
  Save,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface AnnotationPanelProps {
  project: Project;
  annotations: Annotation[];
  activeAnnotationId: string | null;
  onSelectAnnotation: (id: string | null) => void;
  pendingPinPosition: [number, number, number] | null;
  onClearPendingPin: () => void;
  onFocusAnnotation?: (position: [number, number, number]) => void;
}

export function AnnotationPanel({
  project,
  annotations,
  activeAnnotationId,
  onSelectAnnotation,
  pendingPinPosition,
  onClearPendingPin,
  onFocusAnnotation,
}: AnnotationPanelProps) {
  const {
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    updateAnnotationStatus,
    addAnnotationReply,
    currentUser,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "resolved">("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // New annotation state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<Annotation["category"]>("Clash Detection");
  const [newPriority, setNewPriority] = useState<Annotation["priority"]>("high");

  // Edit annotation state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCategory, setEditCategory] = useState<Annotation["category"]>("Clash Detection");
  const [editPriority, setEditPriority] = useState<Annotation["priority"]>("high");

  // Reply text
  const [replyText, setReplyText] = useState("");

  const activeAnnotation = annotations.find((a) => a.id === activeAnnotationId);

  const filteredAnnotations = annotations.filter((a) => {
    if (filterStatus === "open" && a.status === "resolved") return false;
    if (filterStatus === "resolved" && a.status !== "resolved") return false;
    if (filterPriority !== "all" && a.priority !== filterPriority) return false;
    return true;
  });

  const handleCreateAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const pos = pendingPinPosition || [0, 2.5, 0];
    const created = addAnnotation({
      projectId: project.id,
      modelId: project.activeModelId,
      title: newTitle.trim(),
      description: newDesc.trim() || "Design issue submitted during collaborative BIM review.",
      category: newCategory,
      priority: newPriority,
      status: "open",
      position: pos,
    });

    setNewTitle("");
    setNewDesc("");
    onClearPendingPin();
    onSelectAnnotation(created.id);
    if (onFocusAnnotation) {
      onFocusAnnotation(created.position);
    }
  };

  const handleStartEdit = () => {
    if (!activeAnnotation) return;
    setEditTitle(activeAnnotation.title);
    setEditDesc(activeAnnotation.description);
    setEditCategory(activeAnnotation.category);
    setEditPriority(activeAnnotation.priority);
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAnnotation || !editTitle.trim()) return;

    updateAnnotation(activeAnnotation.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this 3D review markup?")) {
      deleteAnnotation(id);
      if (activeAnnotationId === id) {
        onSelectAnnotation(null);
      }
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeAnnotation) return;
    addAnnotationReply(activeAnnotation.id, replyText.trim());
    setReplyText("");
  };

  return (
    <div className="w-80 md:w-96 flex flex-col h-full bg-cad-900/95 border-l border-cad-800 backdrop-blur-md">
      {/* Panel Header */}
      <div className="p-4 border-b border-cad-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <h3 className="text-sm font-bold text-cad-50 tracking-tight">
              Review Markups & Issues
            </h3>
          </div>
          <p className="text-[11px] text-cad-400 mt-0.5">
            {annotations.length} recorded • {annotations.filter((a) => a.status !== "resolved").length} open
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex bg-cad-850 p-0.5 rounded border border-cad-750 text-[10px] font-mono">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-2 py-0.5 rounded ${
              filterStatus === "all" ? "bg-cyan text-cad-950 font-bold" : "text-cad-400"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilterStatus("open")}
            className={`px-2 py-0.5 rounded ${
              filterStatus === "open" ? "bg-amber-400 text-cad-950 font-bold" : "text-cad-400"
            }`}
          >
            OPEN
          </button>
          <button
            onClick={() => setFilterStatus("resolved")}
            className={`px-2 py-0.5 rounded ${
              filterStatus === "resolved" ? "bg-emerald-400 text-cad-950 font-bold" : "text-cad-400"
            }`}
          >
            DONE
          </button>
        </div>
      </div>

      {/* Form: New Pin Placed from 3D Viewport */}
      {pendingPinPosition && (
        <div className="p-4 bg-cad-850/90 border-b border-cyan/40 animate-in fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>
                PIN DROPPED [X:{pendingPinPosition[0]} Y:{pendingPinPosition[1]} Z:{pendingPinPosition[2]}]
              </span>
            </div>
            <button
              onClick={onClearPendingPin}
              className="text-cad-400 hover:text-rose-400 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateAnnotation} className="space-y-2.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-cad-400 mb-0.5">
                Issue Summary / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HVAC Duct & Truss Collision at Grid E-4"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cad-900 border border-cad-700 rounded text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono uppercase text-cad-400 mb-0.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-2 py-1 bg-cad-900 border border-cad-700 rounded text-[11px] text-cad-200"
                >
                  <option value="Clash Detection">Clash Detection</option>
                  <option value="Structural Integrity">Structural</option>
                  <option value="Aesthetic / Facade">Aesthetic</option>
                  <option value="Code Compliance">Code Compliance</option>
                  <option value="Material Spec">Material Spec</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-cad-400 mb-0.5">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-2 py-1 bg-cad-900 border border-cad-700 rounded text-[11px] text-cad-200"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-cad-400 mb-0.5">
                Engineering Details & Note
              </label>
              <textarea
                rows={2}
                placeholder="Describe clash severity, required clearance, or modification instructions..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-cad-900 border border-cad-700 rounded text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" size="sm" variant="ghost" onClick={onClearPendingPin}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Save 3D Markup
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Active Annotation Details & Discussion View */}
      {activeAnnotation ? (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
          <div className="space-y-3">
            {/* Top Toolbar: Back, Focus Camera, Edit, Delete */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  onSelectAnnotation(null);
                  setIsEditing(false);
                }}
                className="text-xs text-cyan hover:underline flex items-center gap-1 font-mono"
              >
                ← Back to List
              </button>

              <div className="flex items-center gap-1">
                {/* Focus Camera in 3D */}
                {onFocusAnnotation && (
                  <button
                    onClick={() => onFocusAnnotation(activeAnnotation.position)}
                    className="p-1 rounded bg-cad-850 hover:bg-cad-800 text-cyan border border-cad-700 transition-colors"
                    title="Focus Camera on this Marker in 3D"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Edit Button */}
                <button
                  onClick={handleStartEdit}
                  className="p-1 rounded bg-cad-850 hover:bg-cad-800 text-cad-300 hover:text-white border border-cad-700 transition-colors"
                  title="Edit Annotation"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(activeAnnotation.id)}
                  className="p-1 rounded bg-cad-850 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                  title="Delete Annotation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <Badge
                  variant={
                    activeAnnotation.status === "resolved"
                      ? "success"
                      : activeAnnotation.priority === "critical"
                      ? "danger"
                      : "warning"
                  }
                  size="sm"
                >
                  {activeAnnotation.status}
                </Badge>
              </div>
            </div>

            {/* Editing Form */}
            {isEditing ? (
              <form onSubmit={handleSaveEdit} className="space-y-2.5 p-3 bg-cad-850 rounded-lg border border-cyan/40">
                <div className="text-[10px] font-mono uppercase text-cyan">Edit Markup</div>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-cad-900 border border-cad-700 rounded text-xs text-cad-100"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="px-2 py-1 bg-cad-900 border border-cad-700 rounded text-[11px] text-cad-200"
                  >
                    <option value="Clash Detection">Clash Detection</option>
                    <option value="Structural Integrity">Structural</option>
                    <option value="Aesthetic / Facade">Aesthetic</option>
                    <option value="Code Compliance">Code Compliance</option>
                    <option value="Material Spec">Material Spec</option>
                  </select>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="px-2 py-1 bg-cad-900 border border-cad-700 rounded text-[11px] text-cad-200"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-cad-900 border border-cad-700 rounded text-xs text-cad-100"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    <Save className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {activeAnnotation.category} • {activeAnnotation.priority.toUpperCase()} PRIORITY
                </div>
                <h4 className="text-sm font-bold text-cad-50 mt-0.5">
                  {activeAnnotation.title}
                </h4>

                {/* Exact 3D Coordinate Badge */}
                <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cad-850 border border-cad-750 text-[10px] font-mono text-cyan-300">
                  <Crosshair className="w-3 h-3 text-cyan" />
                  <span>
                    X:{activeAnnotation.position[0].toFixed(2)} Y:{activeAnnotation.position[1].toFixed(2)} Z:{activeAnnotation.position[2].toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-cad-300 mt-2 leading-relaxed bg-cad-850 p-3 rounded-lg border border-cad-750">
                  {activeAnnotation.description}
                </p>
              </div>
            )}

            {/* Author info */}
            <div className="flex items-center justify-between text-[11px] text-cad-400 pt-1">
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={activeAnnotation.author.name}
                  avatar={activeAnnotation.author.avatar}
                  role={activeAnnotation.author.role}
                  className="w-5 h-5"
                  textClassName="text-[8px]"
                />
                <span>{activeAnnotation.author.name}</span>
              </div>
              <span className="font-mono text-[10px]">
                {formatTimeAgo(activeAnnotation.createdAt)}
              </span>
            </div>

            {/* Resolution Toggle */}
            <div className="pt-2">
              <button
                onClick={() =>
                  updateAnnotationStatus(
                    activeAnnotation.id,
                    activeAnnotation.status === "resolved" ? "open" : "resolved"
                  )
                }
                className={`w-full py-1.5 px-3 rounded text-xs font-medium flex items-center justify-center gap-2 border transition-all ${
                  activeAnnotation.status === "resolved"
                    ? "bg-cad-800 text-cad-300 border-cad-700 hover:text-white"
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25"
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {activeAnnotation.status === "resolved"
                    ? "Reopen Issue"
                    : "Mark Issue as Resolved"}
                </span>
              </button>
            </div>

            {/* Discussion Feed */}
            <div className="pt-3 border-t border-cad-800 space-y-2.5">
              <div className="text-[10px] font-mono uppercase text-cad-400">
                Discussion Thread ({activeAnnotation.replies?.length || 0})
              </div>
              {activeAnnotation.replies?.map((rep) => (
                <div
                  key={rep.id}
                  className="p-2.5 rounded-lg bg-cad-850/60 border border-cad-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cad-200">{rep.author}</span>
                    <span className="text-[10px] text-cad-500 font-mono">
                      {formatTimeAgo(rep.createdAt)}
                    </span>
                  </div>
                  <p className="text-cad-300 leading-relaxed">{rep.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="pt-3 border-t border-cad-800 flex gap-2">
            <input
              type="text"
              placeholder="Post a reply or review note..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-cad-850 border border-cad-750 rounded text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan"
            />
            <Button size="sm" type="submit">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      ) : (
        /* List of All Annotations */
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredAnnotations.length === 0 ? (
            <div className="text-center py-12 text-cad-400 text-xs">
              <AlertOctagon className="w-8 h-8 text-cad-600 mx-auto mb-2" />
              <p>No markups matching this filter.</p>
              <p className="text-[10px] text-cad-500 mt-1">
                Use &apos;+ ADD MARKUP PIN&apos; to drop an issue in 3D space.
              </p>
            </div>
          ) : (
            filteredAnnotations.map((ann) => (
              <div
                key={ann.id}
                onClick={() => {
                  onSelectAnnotation(ann.id);
                  if (onFocusAnnotation) {
                    onFocusAnnotation(ann.position);
                  }
                }}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  ann.status === "resolved"
                    ? "bg-cad-850/40 border-cad-800/80 opacity-60 hover:opacity-100"
                    : "bg-cad-850 border-cad-750 hover:border-cyan/50 hover:bg-cad-800"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span
                    className={
                      ann.priority === "critical"
                        ? "text-rose-400 font-bold"
                        : ann.priority === "high"
                        ? "text-amber-400 font-semibold"
                        : "text-cyan-400"
                    }
                  >
                    ● {ann.priority.toUpperCase()} • {ann.category}
                  </span>
                  <span className="text-cad-500">
                    {formatTimeAgo(ann.createdAt)}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-cad-100 line-clamp-1">
                  {ann.title}
                </h4>

                <p className="text-[11px] text-cad-400 mt-1 line-clamp-2 leading-relaxed">
                  {ann.description}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-cad-400 pt-1.5 border-t border-cad-800/60">
                  <span className="font-mono text-cyan/70">
                    X:{ann.position[0].toFixed(1)} Y:{ann.position[1].toFixed(1)} Z:{ann.position[2].toFixed(1)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-mono">
                      <MessageSquare className="w-3 h-3" />
                      {ann.replies?.length || 0}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(ann.id);
                      }}
                      className="text-cad-500 hover:text-rose-400 transition-colors p-0.5"
                      title="Delete Annotation"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
