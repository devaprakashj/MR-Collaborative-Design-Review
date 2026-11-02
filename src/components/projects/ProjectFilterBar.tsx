"use client";

import React from "react";
import { Search, Filter, SlidersHorizontal, Grid, List } from "lucide-react";
import { ProjectCategory, ProjectStatus } from "@/types";

interface ProjectFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const CATEGORIES = [
  "All Categories",
  "Commercial High-Rise",
  "Cultural & Museum",
  "Residential Complex",
  "Civic & Infrastructure",
  "Educational Campus",
  "Sustainable Pavilion",
];

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "in_review", label: "In Review" },
  { value: "changes_requested", label: "Changes Requested" },
  { value: "approved", label: "Approved" },
  { value: "draft", label: "Draft" },
];

export function ProjectFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
}: ProjectFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-cad-900 border border-cad-800 rounded-xl">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-cad-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter by name, code, or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-cad-850 border border-cad-750 rounded-lg text-xs text-cad-100 placeholder:text-cad-500 focus:outline-none focus:border-cyan/60"
        />
      </div>

      {/* Selects & View Toggles */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-1.5 bg-cad-850 border border-cad-750 rounded-lg text-xs text-cad-200 focus:outline-none focus:border-cyan/60"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status Select */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-1.5 bg-cad-850 border border-cad-750 rounded-lg text-xs text-cad-200 focus:outline-none focus:border-cyan/60"
        >
          {STATUSES.map((stat) => (
            <option key={stat.value} value={stat.value}>
              {stat.label}
            </option>
          ))}
        </select>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-cad-850 border border-cad-750 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded ${
              viewMode === "grid"
                ? "bg-cad-750 text-cyan shadow-sm"
                : "text-cad-400 hover:text-cad-200"
            }`}
            title="Grid View"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded ${
              viewMode === "list"
                ? "bg-cad-750 text-cyan shadow-sm"
                : "text-cad-400 hover:text-cad-200"
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

