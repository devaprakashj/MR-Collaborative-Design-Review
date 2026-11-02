<div align="center">

# 🏛️ MR Collaborative Design Review (MR // CDR)
### *Next-Generation WebGL Collaborative Architectural & BIM Review Platform*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_2.0-049EF4?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)

<br/>

**A collaborative architecture design review suite where architects, structural engineers, facade specialists, and clients inspect 3D building models, pinpoint spatial clashes, place precision annotations, and certify designs for fabrication.**

[Explore Features](#-key-features) • [Client Demo Walkthrough](#-client-presentation--demo-guide) • [Quick Start](#-getting-started) • [Tech Stack](#-technical-architecture)

</div>

---

## 🌟 Executive Overview

In modern architectural engineering and BIM (Building Information Modeling) workflows, cross-disciplinary coordination between architects, structural consultants, and client stakeholders often suffers from fragmented 2D drawing reviews and disconnected email chains. 

**MR Collaborative Design Review** solves this by delivering an interactive, browser-native 3D review workspace inspired by industry standards like *Autodesk Navisworks, Revizto, and BIM Track*. It requires zero desktop software installation and runs fluidly on standard modern browsers.

---

## 🚀 Key Features

### 1. 🏛️ High-Fidelity 3D Architectural Scene
- **Photorealistic Lighting & Environment**: Studio HDRI city daylight reflections (`Environment preset="city"`), realistic glass refraction (`ior: 1.52`), and soft ambient contact shadows (`<ContactShadows />`).
- **Authentic Building Anatomy**: Modeled with off-white limestone facade cladding, rhythmic Scandinavian timber sun louvers (brise-soleil), floor-to-ceiling curtain wall glazing, concrete elevator core, green rooftop turf, and a 4-meter cantilevered observation deck.
- **Physical 3D MEP Collision**: Features an authentic galvanized zinc HVAC ventilation trunk duct intersecting a diagonal glulam timber cross-brace at Grid Axis E-4, making spatial clash inspection unmistakable.

### 2. ⚡ Real 3D Model Upload (.GLB & .GLTF)
- **Direct Drag-and-Drop / File Picker**: Supports uploading custom `.glb` and `.gltf` assemblies.
- **Client-Side Geometric Indexing**: Automatically parses vertices, meshes, and materials in memory via Three.js `GLTFLoader`.
- **Built-in Sample Asset**: Includes [`public/models/sample-architecture.glb`](public/models/sample-architecture.glb) (170 KB) with one-click instant testing.
- **Model Replacement & Reset**: Switch seamlessly between custom uploaded models and the default architectural building.

### 3. 🎥 Precision CAD Camera & Viewport Director
- **Preset Camera Viewpoints**: Instant orientation to:
  - **`PERSP`**: 3/4 Isometric Perspective.
  - **`TOP`**: Plan View (looking directly down along the Y-axis).
  - **`FRONT`**: Front Elevation View.
  - **`SIDE`**: Side Elevation View.
- **Auto Fit to View (`⛶`)**: Automatically computes the bounding box and centers any 3D model in the viewport.
- **Interactive Tools**:
  - `+ / -`: Smooth camera zoom in and out.
  - `Wireframe`: Toggles mesh polygon wireframe overlays.
  - `Explode`: Translates floor slabs vertically to inspect interior levels.
  - `Grid`: Toggles CAD ground reference grid.
  - `Sun Study`: Interactive solar azimuth slider (0°–360°) and Day / Dusk / Studio lighting presets.
  - `Fullscreen`: Browser-native immersion mode for executive review meetings.

### 4. 🎯 Precision 3D Spatial Annotations
- **Exact Surface Raycasting**: Click `+ ADD MARKUP PIN` and click anywhere on the 3D building surface to capture exact `[X, Y, Z]` coordinates.
- **Instant Callout Badges**: Compact 3D markers with pulsing priority beacons (Critical: Red, High: Amber, Medium: Cyan, Low: Green).
- **Camera Auto-Focus**: Clicking any annotation smoothly flies the camera to inspect that exact location.
- **Full Lifecycle Management**: Edit, update, resolve, and delete markup pins with threaded peer discussions.

### 5. 👥 Dual-Persona Review Workflow & Sign-Off
- **Role Switcher**: Toggle dynamically between **Lead Architect** (Elena Rostova) and **Senior Reviewer** (Marcus Vance).
- **Formal Sign-Off**: Reviewers can submit formal approvals (with celebratory confetti! 🎉) or request design revisions with binding commentary.
- **Immutable Audit Trail**: All uploads, comments, markups, and status transitions append to the live audit log.

---

## 📱 Client Presentation & Demo Guide

When presenting this project to a client or stakeholder, follow this **5-step walkthrough**:

```
Step 1: Sign in via Demo Persona  →  Step 2: Executive Dashboard
                                             ↓
Step 3: Project Directory & Filter  ←  Step 4: Launch 3D Review Workspace
         ↓
Step 5: Drop 3D Pin, Inspect Clash & Sign-Off with Confetti
```

1. **Sign In (`/`)**: Click **"Launch as Architect"** or **"Launch as Reviewer"** to demonstrate role-based access.
2. **Dashboard (`/dashboard`)**: Showcase the 4 key portfolio metrics, project readiness bars, and real-time activity feed.
3. **Projects Directory (`/projects`)**: Filter by category (*Commercial High-Rise*, *Cultural & Museum*) and toggle between Grid and CAD List views.
4. **3D Review Workspace (`/projects/prj-nordic-cultural/review`)**:
   - Rotate with Orbit controls and demonstrate **`PERSP`**, **`TOP`**, **`FRONT`**, **`SIDE`** camera views.
   - Adjust the **Sun Study slider** to watch daylight reflections and shadows shift.
   - Click **`Upload Model`** and choose **"Load Sample GLB"** to show instant 3D model parsing.
5. **Interactive Markup & Sign-Off**:
   - Rotate to the **HVAC duct collision** at Grid E-4.
   - Click **`+ ADD MARKUP PIN`**, drop a pin on the model surface, and save a review note.
   - Click the green **"Approve Design"** button to trigger the formal sign-off celebration.

---

## 🛠️ Technical Architecture

```
MR-Collaborative-Design-Review/
├── public/
│   └── models/
│       └── sample-architecture.glb    # High-fidelity 170 KB architectural GLB asset
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with AppProvider & Toast notifications
│   │   ├── page.tsx                   # Professional CAD login & persona selector
│   │   ├── dashboard/page.tsx         # Executive metrics & active review queue
│   │   ├── projects/
│   │   │   ├── page.tsx               # Portfolio directory with filters & creation modal
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Project overview, model specs & review history
│   │   │       └── review/page.tsx    # 3D WebGL Design Review Workspace
│   │   ├── reviews/page.tsx           # Compliance desk & pending approvals
│   │   ├── collaborators/page.tsx     # Peer directory & invitation management
│   │   ├── activity/page.tsx          # Real-time audit log
│   │   └── settings/page.tsx          # CAD units, graphics quality & Supabase bridge
│   ├── components/
│   │   ├── viewer3d/
│   │   │   ├── ArchitecturalScene.tsx # Three.js Canvas, R3F lighting, shaders & camera
│   │   │   ├── ViewportControls.tsx   # CAD toolstrip, preset views & sun study
│   │   │   ├── AnnotationPanel.tsx    # 3D pin discussion, edit, and resolution drawer
│   │   │   ├── ModelInspectorPanel.tsx# BIM metadata, polygon counts & LOD specs
│   │   │   ├── ModelUploadModal.tsx   # GLTF/GLB drag-and-drop parser
│   │   │   └── ReviewActionBar.tsx    # Formal sign-off & status actions
│   │   ├── layout/                    # Header & Sidebar CAD navigation
│   │   └── ui/                        # Buttons, Badges, Modals, Toasts
│   ├── context/
│   │   └── AppContext.tsx             # Central reactive state store with localStorage persistence
│   ├── types/
│   │   └── index.ts                   # Strict TypeScript definitions for BIM assets
│   └── lib/
│       ├── mockData.ts                # Realistic architectural sample projects
│       ├── supabase.ts                # Production Supabase adapter interface
│       └── utils.ts                   # Class merging & formatters
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **NPM** or **PNPM**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/MR-Collaborative-Design-Review.git
   cd MR-Collaborative-Design-Review
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build & Verification

To verify full TypeScript type-checking and bundle optimization:
```bash
npm run build
npm run start
```

---

## ☁️ Cloudflare Pages Live Deployment (Step-by-Step)

The project is pre-configured with Next.js **Static HTML Export** (`output: 'export'`) in `next.config.mjs` and includes a ready `wrangler.toml`. It deploys to **Cloudflare Pages** in under 2 minutes with zero configuration headaches!

### Method 1: Deploy via Cloudflare Dashboard (Recommended)

1. **Push your code to GitHub** (see [GitHub Setup Guide](#-pushing-to-github) below).
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your repository: `MR-Collaborative-Design-Review`.
4. Configure the build settings:
   - **Framework preset**: `Next.js (Static HTML Export)` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (leave empty or default)
5. Under **Environment variables (advanced)**, add:
   - `NODE_VERSION`: `20.17.0`
6. Click **Save and Deploy**. Your live URL will be active immediately (e.g. `https://mr-collaborative-design-review.pages.dev`)!

---

### Method 2: Deploy directly via Wrangler CLI

If you prefer terminal deployment without connecting Git:
```bash
# 1. Build the static production bundle
npm run build

# 2. Deploy the 'out' directory to Cloudflare Pages
npx wrangler pages deploy out --project-name=mr-collaborative-design-review
```

---

## 🐙 Pushing to GitHub

To publish this project to your GitHub account:

```bash
# 1. Create a new repository on GitHub named "MR-Collaborative-Design-Review"
# (Do NOT initialize with README or license, as they are already here)

# 2. Link your local repo to GitHub (replace YOUR-USERNAME with your GitHub handle):
git remote add origin https://github.com/YOUR-USERNAME/MR-Collaborative-Design-Review.git

# 3. Rename branch to main if preferred, then push:
git branch -M main
git push -u origin main
```

---

## 🔌 Supabase Cloud Integration (Phase 2 Ready)

The application includes an abstracted cloud adapter in [`src/lib/supabase.ts`](src/lib/supabase.ts). To connect to a live Supabase project:

1. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
2. When configured, the platform binds seamlessly to production Postgres tables and S3-compatible model storage buckets.
3. In local demo mode, the platform operates autonomously using `localStorage` persistence and bundled architectural datasets.

---

## ⌨️ Viewport Navigation & Shortcuts

| Action | Control |
| :--- | :--- |
| **Orbit / Rotate** | Left-click + Drag |
| **Pan** | Right-click + Drag (or Middle-click + Drag) |
| **Zoom** | Mouse Scroll Wheel (or `+` / `-` buttons) |
| **Drop 3D Pin** | Click `+ ADD MARKUP PIN`, then click on any model surface |
| **Focus Camera on Issue** | Click any annotation in the right-side list |
| **Reset View** | Click `↺ Reset` on the CAD toolstrip |
| **Fullscreen** | Click `⛶ Fullscreen` toggle |

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Engineered with precision for architects and structural engineers worldwide.</sub>
</div>
