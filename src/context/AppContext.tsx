"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  Project,
  Annotation,
  Collaborator,
  ActivityItem,
  ReviewAction,
  UserRole,
  ModelMetadata,
} from "@/types";
import {
  DEMO_USERS,
  INITIAL_PROJECTS,
  INITIAL_ANNOTATIONS,
  INITIAL_COLLABORATORS,
  INITIAL_ACTIVITIES,
} from "@/lib/mockData";
import confetti from "canvas-confetti";

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "info" | "warning";
}

export interface CustomModelData {
  url: string;
  name: string;
  size: string;
  format: "GLB" | "GLTF";
  meshCount: number;
  vertexCount: number;
  materialsCount: number;
}

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: "architect" | "reviewer") => void;
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  addProject: (projectData: {
    name: string;
    description: string;
    category: Project["category"];
    location?: string;
    targetCompletion?: string;
  }) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  annotations: Annotation[];
  getProjectAnnotations: (projectId: string) => Annotation[];
  addAnnotation: (
    data: Omit<Annotation, "id" | "createdAt" | "author">
  ) => Annotation;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  deleteAnnotation: (id: string) => void;
  updateAnnotationStatus: (
    id: string,
    status: Annotation["status"]
  ) => void;
  addAnnotationReply: (annotationId: string, content: string) => void;
  customModels: Record<string, CustomModelData | null>;
  setCustomModel: (projectId: string, customModel: CustomModelData | null) => void;
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, "id" | "timestamp">) => void;
  addReviewAction: (
    projectId: string,
    action: ReviewAction["action"],
    comment: string
  ) => void;
  collaborators: Collaborator[];
  addCollaborator: (email: string, role: UserRole) => void;
  toasts: ToastMessage[];
  showToast: (
    title: string,
    message?: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS.architect);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [annotations, setAnnotations] = useState<Annotation[]>(INITIAL_ANNOTATIONS);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [customModels, setCustomModels] = useState<Record<string, CustomModelData | null>>({});
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load persisted state if available in browser
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("mr_cdr_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedProjects = localStorage.getItem("mr_cdr_projects");
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        const existingIds = new Set(parsed.map((p: Project) => p.id));
        const merged = [...parsed, ...INITIAL_PROJECTS.filter((p) => !existingIds.has(p.id))];
        setProjects(merged);
      }
      const savedAnnotations = localStorage.getItem("mr_cdr_annotations");
      if (savedAnnotations) {
        const parsed = JSON.parse(savedAnnotations);
        const existingIds = new Set(parsed.map((a: Annotation) => a.id));
        const merged = [...parsed, ...INITIAL_ANNOTATIONS.filter((a) => !existingIds.has(a.id))];
        setAnnotations(merged);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    try {
      localStorage.setItem("mr_cdr_projects", JSON.stringify(newProjects));
    } catch {
      // Ignore
    }
  };

  const saveAnnotations = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
    try {
      localStorage.setItem("mr_cdr_annotations", JSON.stringify(newAnnotations));
    } catch {
      // Ignore
    }
  };

  const showToast = (
    title: string,
    message?: string,
    type: "success" | "error" | "info" | "warning" = "info"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (role: "architect" | "reviewer") => {
    const selected = role === "architect" ? DEMO_USERS.architect : DEMO_USERS.reviewer;
    setCurrentUser(selected);
    try {
      localStorage.setItem("mr_cdr_user", JSON.stringify(selected));
    } catch {
      // Ignore
    }
    showToast(
      `Switched Role: ${selected.role.toUpperCase()}`,
      `Logged in as ${selected.name} (${selected.title})`,
      "info"
    );
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const addProject = (projectData: {
    name: string;
    description: string;
    category: Project["category"];
    location?: string;
    targetCompletion?: string;
  }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `prj-${projectData.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24)}-${Date.now().toString().slice(-4)}`;
    const newProj: Project = {
      id,
      code: `ARC-${randomNum}`,
      name: projectData.name,
      description: projectData.description,
      category: projectData.category,
      status: "in_review",
      owner: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.title,
        avatar: currentUser.avatar,
      },
      collaborators: [INITIAL_COLLABORATORS[0], INITIAL_COLLABORATORS[1]],
      models: [
        {
          id: `mod-${id}-v1`,
          name: `${projectData.name.replace(/\s+/g, "_")}_BIM_Model_v1.ifc`,
          version: "v1.0.0",
          format: "IFC",
          fileSize: "78.4 MB",
          lod: "LOD 350",
          uploadDate: new Date().toISOString().split("T")[0],
          meshCount: 3420,
          vertexCount: 780000,
          materialsCount: 36,
          floors: 8,
          grossFloorArea: "18,400 m²",
          units: "Metric (mm)",
          coordinateSystem: "EPSG:3857 (WGS 84)",
        },
      ],
      activeModelId: `mod-${id}-v1`,
      annotationsCount: 0,
      unresolvedIssuesCount: 0,
      location: projectData.location || "Central Architecture District",
      thumbnail: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80",
      targetCompletion: projectData.targetCompletion || "Q4 2028",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      progressPercent: 20,
      reviews: [],
    };

    const updated = [newProj, ...projects];
    saveProjects(updated);

    addActivity({
      projectId: id,
      projectName: newProj.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: "upload",
      description: `Created new architectural project '${newProj.name}' (${newProj.code})`,
      badge: "Project Created",
    });

    showToast("Project Created", `${newProj.name} (${newProj.code}) added to active workspace`, "success");
    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updated = projects.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString().split("T")[0],
        };
      }
      return p;
    });
    saveProjects(updated);
  };

  const deleteProject = (id: string) => {
    const project = projects.find((p) => p.id === id);
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    if (project) {
      showToast("Project Removed", `${project.name} has been archived.`, "warning");
    }
  };

  const getProjectAnnotations = (projectId: string) => {
    return annotations.filter((a) => a.projectId === projectId);
  };

  const addAnnotation = (data: Omit<Annotation, "id" | "createdAt" | "author">) => {
    const newAnn: Annotation = {
      ...data,
      id: `ann-${Date.now().toString(36)}`,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.title,
        avatar: currentUser.avatar,
      },
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const updated = [newAnn, ...annotations];
    saveAnnotations(updated);

    // Update project issue count
    const targetProj = projects.find((p) => p.id === data.projectId);
    if (targetProj) {
      updateProject(data.projectId, {
        annotationsCount: targetProj.annotationsCount + 1,
        unresolvedIssuesCount: targetProj.unresolvedIssuesCount + 1,
      });

      addActivity({
        projectId: targetProj.id,
        projectName: targetProj.name,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        type: "annotation",
        description: `Added review markup: "${newAnn.title}" [${newAnn.priority.toUpperCase()}]`,
        badge: newAnn.category,
      });
    }

    showToast("Annotation Added", newAnn.title, "success");
    return newAnn;
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    const updated = annotations.map((a) => {
      if (a.id === id) {
        return { ...a, ...updates };
      }
      return a;
    });
    saveAnnotations(updated);
    showToast("Annotation Updated", "Review markup saved", "success");
  };

  const deleteAnnotation = (id: string) => {
    const targetAnn = annotations.find((a) => a.id === id);
    const updated = annotations.filter((a) => a.id !== id);
    saveAnnotations(updated);

    if (targetAnn) {
      const targetProj = projects.find((p) => p.id === targetAnn.projectId);
      if (targetProj) {
        updateProject(targetProj.id, {
          annotationsCount: Math.max(0, targetProj.annotationsCount - 1),
          unresolvedIssuesCount:
            targetAnn.status !== "resolved"
              ? Math.max(0, targetProj.unresolvedIssuesCount - 1)
              : targetProj.unresolvedIssuesCount,
        });
        addActivity({
          projectId: targetProj.id,
          projectName: targetProj.name,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          type: "annotation",
          description: `Removed markup pin: "${targetAnn.title}"`,
          badge: "Removed",
        });
      }
      showToast("Annotation Removed", `Deleted pin "${targetAnn.title}"`, "warning");
    }
  };

  const setCustomModel = (projectId: string, modelData: CustomModelData | null) => {
    setCustomModels((prev) => ({
      ...prev,
      [projectId]: modelData,
    }));

    if (modelData) {
      const proj = projects.find((p) => p.id === projectId);
      if (proj) {
        const newModel: ModelMetadata = {
          id: `mod-custom-${Date.now().toString(36)}`,
          name: modelData.name,
          version: "vCustom.1",
          format: modelData.format,
          fileSize: modelData.size,
          lod: "LOD 350",
          uploadDate: new Date().toISOString().split("T")[0],
          meshCount: modelData.meshCount,
          vertexCount: modelData.vertexCount,
          materialsCount: modelData.materialsCount,
          floors: 6,
          grossFloorArea: "Custom Model",
          units: "Metric (mm)",
          coordinateSystem: "Local 3D Assembly",
          isCustomUploaded: true,
          customFileUrl: modelData.url,
        };
        updateProject(projectId, {
          models: [newModel, ...proj.models],
          activeModelId: newModel.id,
        });
        addActivity({
          projectId,
          projectName: proj.name,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          type: "upload",
          description: `Loaded 3D model ${modelData.name} (${modelData.size}, ${modelData.meshCount} meshes)`,
          badge: modelData.format,
        });
      }
      showToast("3D Model Loaded", `Displaying ${modelData.name} in viewer`, "success");
    } else {
      showToast("Model Reset", "Restored default architectural model", "info");
    }
  };

  const updateAnnotationStatus = (id: string, status: Annotation["status"]) => {
    const updated = annotations.map((a) => {
      if (a.id === id) {
        return { ...a, status };
      }
      return a;
    });
    saveAnnotations(updated);

    const targetAnn = annotations.find((a) => a.id === id);
    if (targetAnn) {
      showToast("Status Updated", `Issue marked as ${status.replace("_", " ").toUpperCase()}`, "info");
    }
  };

  const addAnnotationReply = (annotationId: string, content: string) => {
    const updated = annotations.map((a) => {
      if (a.id === annotationId) {
        const newReply = {
          id: `rep-${Date.now().toString(36)}`,
          author: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.title,
          content,
          createdAt: new Date().toISOString(),
        };
        return {
          ...a,
          replies: [...(a.replies || []), newReply],
        };
      }
      return a;
    });
    saveAnnotations(updated);
    showToast("Reply Added", "Comment posted to review discussion", "success");
  };

  const addActivity = (activity: Omit<ActivityItem, "id" | "timestamp">) => {
    const newAct: ActivityItem = {
      ...activity,
      id: `act-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const addReviewAction = (
    projectId: string,
    action: ReviewAction["action"],
    comment: string
  ) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;

    const newReview: ReviewAction = {
      id: `rev-${Date.now().toString(36)}`,
      projectId,
      reviewerId: currentUser.id,
      reviewerName: currentUser.name,
      reviewerRole: currentUser.title,
      action,
      comment,
      timestamp: new Date().toISOString(),
      version: proj.models[0]?.version || "v1.0",
    };

    let nextStatus: Project["status"] = proj.status;
    let toastType: "success" | "warning" | "error" | "info" = "info";
    let toastTitle = "Review Submitted";

    if (action === "approved") {
      nextStatus = "approved";
      toastType = "success";
      toastTitle = "Design Officially Approved!";
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#00F0FF", "#0EA5E9", "#10B981", "#FFFFFF"],
        });
      } catch {
        // Ignore in non-browser context
      }
    } else if (action === "requested_changes") {
      nextStatus = "changes_requested";
      toastType = "warning";
      toastTitle = "Changes Requested";
    } else if (action === "rejected") {
      nextStatus = "changes_requested";
      toastType = "error";
      toastTitle = "Design Revision Required";
    }

    updateProject(projectId, {
      status: nextStatus,
      reviews: [newReview, ...(proj.reviews || [])],
    });

    addActivity({
      projectId: proj.id,
      projectName: proj.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type: action === "approved" ? "approval" : "status_change",
      description: `${currentUser.name} (${currentUser.title}) ${action.replace("_", " ")}: "${comment.slice(0, 70)}..."`,
      badge: action === "approved" ? "Approved" : "Action Needed",
    });

    showToast(toastTitle, comment.slice(0, 90), toastType);
  };

  const addCollaborator = (email: string, role: UserRole) => {
    const namePart = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = namePart
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const newCollab: Collaborator = {
      id: `usr-${Date.now().toString(36)}`,
      name: formattedName || "New Collaborator",
      email,
      role,
      title: role === "reviewer" ? "Consulting Reviewer" : "Associate Architect",
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      status: "online",
      lastActive: "Just now",
    };

    setCollaborators((prev) => [newCollab, ...prev]);
    showToast("Invitation Sent", `Invited ${email} as ${role.toUpperCase()}`, "success");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        projects,
        getProject,
        addProject,
        updateProject,
        deleteProject,
        annotations,
        getProjectAnnotations,
        addAnnotation,
        updateAnnotation,
        deleteAnnotation,
        updateAnnotationStatus,
        addAnnotationReply,
        customModels,
        setCustomModel,
        activities,
        addActivity,
        addReviewAction,
        collaborators,
        addCollaborator,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
