"use client";

import React from "react";

interface UserAvatarProps {
  name: string;
  avatar?: string;
  initials?: string;
  className?: string;
  textClassName?: string;
  role?: string;
}

export function UserAvatar({
  name,
  avatar,
  initials,
  className = "w-8 h-8",
  textClassName = "text-xs",
  role,
}: UserAvatarProps) {
  const displayInitials =
    initials ||
    (name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "??");

  const isReviewer = role === "reviewer" || name?.toLowerCase().includes("deva");
  const gradientClass = isReviewer
    ? "bg-gradient-to-br from-electric-bright via-electric to-cyan text-white ring-electric/50"
    : "bg-gradient-to-br from-cyan via-teal-400 to-electric text-cad-950 ring-cyan/50";

  if (avatar && avatar.trim().length > 0) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${className} rounded-full object-cover ring-2 ring-cad-700 shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-full ${gradientClass} flex items-center justify-center font-bold ${textClassName} ring-2 shadow-sm font-mono shrink-0 select-none tracking-tight`}
      title={name}
    >
      {displayInitials}
    </div>
  );
}
