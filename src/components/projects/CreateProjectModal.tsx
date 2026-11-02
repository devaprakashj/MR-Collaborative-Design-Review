"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useApp } from "@/context/AppContext";
import { ProjectCategory } from "@/types";
import { Building2, MapPin, Calendar, FileText, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: ProjectCategory[] = [
  "Commercial High-Rise",
  "Cultural & Museum",
  "Residential Complex",
  "Civic & Infrastructure",
  "Educational Campus",
  "Sustainable Pavilion",
];

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject, currentUser } = useApp();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Cultural & Museum");
  const [location, setLocation] = useState("");
  const [targetCompletion, setTargetCompletion] = useState("Q4 2028");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a project name.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const created = addProject({
        name: name.trim(),
        description: description.trim() || "Architectural project submitted for multi-disciplinary peer review and clash detection.",
        category,
        location: location.trim() || "Metropolitan Design District",
        targetCompletion,
      });

      setIsSubmitting(false);
      onClose();
      // Redirect to the newly created project's details
      router.push(`/projects/${created.id}`);
    } catch {
      setIsSubmitting(false);
      setError("Failed to create project. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Architectural Project"
      subtitle="Initialize project space, upload initial BIM models & invite reviewers"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Project Name */}
        <div>
          <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
            Project Name <span className="text-cyan">*</span>
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Solaris Performing Arts Center"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-md text-sm text-cad-50 placeholder:text-cad-500 focus:outline-none focus:border-cyan/60 focus:ring-1 focus:ring-cyan/40"
            />
          </div>
        </div>

        {/* Category & Target Completion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
              Typology / Category <span className="text-cyan">*</span>
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-md text-sm text-cad-50 focus:outline-none focus:border-cyan/60"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
              Target Completion
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Q3 2027"
                value={targetCompletion}
                onChange={(e) => setTargetCompletion(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-md text-sm text-cad-50 focus:outline-none focus:border-cyan/60"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
            Site Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. Zurich Financial District, Switzerland"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-md text-sm text-cad-50 focus:outline-none focus:border-cyan/60"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono uppercase text-cad-300 mb-1">
            Design Brief & Review Scope
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-cad-400 absolute left-3 top-3" />
            <textarea
              rows={3}
              placeholder="Detail the architectural intent, structural systems, and specific review milestones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-cad-850 border border-cad-700 rounded-md text-sm text-cad-50 focus:outline-none focus:border-cyan/60 resize-none"
            />
          </div>
        </div>

        {/* Lead Architect Attribution info */}
        <div className="p-3 bg-cad-850/60 border border-cad-800 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={currentUser.name}
              avatar={currentUser.avatar}
              role={currentUser.role}
              className="w-6 h-6 ring-1 ring-cyan/40"
              textClassName="text-[9px]"
            />
            <div>
              <span className="text-cad-400">Project Principal: </span>
              <span className="text-cad-100 font-medium">{currentUser.name}</span>
            </div>
          </div>
          <span className="font-mono text-[10px] text-cyan-400 bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">
            AUTO-PROVISION IFC LOD 350
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-cad-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Project & Initialize Workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
}

