export type UserRole = "architect" | "reviewer" | "lead_architect" | "client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  organization: string;
  initials: string;
}

export type ProjectStatus = "in_review" | "changes_requested" | "approved" | "draft" | "archived";

export type ProjectCategory = 
  | "Commercial High-Rise" 
  | "Cultural & Museum" 
  | "Residential Complex" 
  | "Civic & Infrastructure" 
  | "Educational Campus" 
  | "Sustainable Pavilion";

export interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  format: "IFC" | "RVT" | "GLTF" | "FBX" | "OBJ" | "GLB";
  fileSize: string;
  lod: "LOD 200" | "LOD 300" | "LOD 350" | "LOD 400";
  uploadDate: string;
  meshCount: number;
  vertexCount: number;
  materialsCount: number;
  floors: number;
  grossFloorArea: string;
  units: "Metric (mm)" | "Imperial (ft)";
  coordinateSystem: string;
  isCustomUploaded?: boolean;
  customFileUrl?: string;
}

export interface Annotation {
  id: string;
  projectId: string;
  modelId: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  title: string;
  description: string;
  category: "Clash Detection" | "Structural Integrity" | "Aesthetic / Facade" | "Code Compliance" | "Material Spec";
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  position: [number, number, number]; // 3D coordinates on the model
  cameraPosition?: [number, number, number];
  replies?: {
    id: string;
    author: string;
    avatar: string;
    role: string;
    content: string;
    createdAt: string;
  }[];
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatar: string;
  status: "online" | "away" | "offline";
  lastActive: string;
}

export interface ReviewAction {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  action: "approved" | "requested_changes" | "rejected" | "submitted";
  comment: string;
  timestamp: string;
  version: string;
}

export interface ActivityItem {
  id: string;
  projectId?: string;
  projectName?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: "upload" | "annotation" | "status_change" | "comment" | "approval" | "collaboration";
  description: string;
  timestamp: string;
  badge?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  owner: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  };
  collaborators: Collaborator[];
  models: ModelMetadata[];
  activeModelId: string;
  annotationsCount: number;
  unresolvedIssuesCount: number;
  location: string;
  thumbnail: string;
  targetCompletion: string;
  createdAt: string;
  updatedAt: string;
  progressPercent: number;
  reviews: ReviewAction[];
}

