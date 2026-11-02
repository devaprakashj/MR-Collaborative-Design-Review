"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Center,
  Html,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Annotation } from "@/types";

export type CameraPresetView = "perspective" | "top" | "front" | "side";

interface ArchitecturalSceneProps {
  customModelUrl?: string | null;
  wireframeMode: boolean;
  explodedView: boolean;
  showGrid?: boolean;
  sunAngle?: number; // 0 to 360 degrees
  lightIntensity?: number; // 0.2 to 2.5
  lightingMode?: "day" | "dusk" | "studio";
  annotations: Annotation[];
  activeAnnotationId: string | null;
  onSelectAnnotation: (id: string) => void;
  isAddingAnnotation: boolean;
  onCanvasClickToAddAnnotation: (position: [number, number, number]) => void;
  presetView?: CameraPresetView | null;
  resetCameraTrigger?: number;
  fitToViewTrigger?: number;
  zoomInTrigger?: number;
  zoomOutTrigger?: number;
  focusPosition?: [number, number, number] | null;
  onModelLoaded?: (stats: { meshCount: number; vertexCount: number; materialsCount: number; boundingBox: [number, number, number] }) => void;
  onModelError?: (errorMsg: string) => void;
}

// -------------------------------------------------------------
// Sleek Interactive 3D Annotation Pin
// -------------------------------------------------------------
function AnnotationPin({
  annotation,
  isSelected,
  onClick,
}: {
  annotation: Annotation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      beaconRef.current.position.y =
        0.55 + Math.sin(state.clock.elapsedTime * 3.5) * 0.05;
    }
  });

  const priorityColor =
    annotation.priority === "critical"
      ? "#EF4444"
      : annotation.priority === "high"
      ? "#F59E0B"
      : annotation.priority === "medium"
      ? "#06B6D4"
      : "#10B981";

  return (
    <group position={annotation.position}>
      {/* Ground Contact Target Ring */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.1, 0.02, 0.08, 16]} />
        <meshBasicMaterial color={priorityColor} />
      </mesh>

      {/* Vertical Pin Needle */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.55, 8]} />
        <meshBasicMaterial color={isSelected || hovered ? "#FFFFFF" : priorityColor} />
      </mesh>

      {/* Floating Glowing Beacon */}
      <mesh
        ref={beaconRef}
        position={[0, 0.6, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color={priorityColor}
          emissive={priorityColor}
          emissiveIntensity={isSelected || hovered ? 1.0 : 0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Refined Callout Badge */}
      <Html distanceFactor={14} position={[0, 0.82, 0]} center>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`cursor-pointer group flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md transition-all select-none shadow-xl ${
            isSelected
              ? "bg-cad-900 border-cyan text-white shadow-cyan-glow scale-110 ring-2 ring-cyan/40"
              : hovered
              ? "bg-cad-900/95 border-cad-600 text-cad-100 scale-105"
              : "bg-cad-950/85 border-cad-750 text-cad-300"
          }`}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 animate-pulse"
            style={{ backgroundColor: priorityColor }}
          />
          <span className="text-[10px] font-mono font-medium max-w-[130px] truncate">
            {annotation.title}
          </span>
          <span className="text-[8px] font-mono text-cad-400 uppercase px-1 py-0.2 rounded bg-cad-800">
            {annotation.priority.slice(0, 4)}
          </span>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// Real Architectural Building Model: Nordic Cultural Forum
// Complete with realistic limestone facade, Scandinavian timber louvers,
// clear glass curtain wall, paved plaza, cantilever terrace, green roof,
// structural grid, and visible HVAC duct clash.
// -------------------------------------------------------------
function RealArchitecturalBuilding({
  wireframe,
  exploded,
}: {
  wireframe: boolean;
  exploded: boolean;
}) {
  const explodeFactor = exploded ? 1.6 : 1.0;

  // Authentic Architectural Materials
  const mats = useMemo(() => {
    return {
      // Light Architectural Limestone Facade Panels
      limestoneFacade: new THREE.MeshStandardMaterial({
        color: "#E2E8F0", // Clean off-white limestone
        roughness: 0.85,
        metalness: 0.05,
        wireframe,
      }),
      // Fair-Faced Structural Concrete
      concreteCore: new THREE.MeshStandardMaterial({
        color: "#64748B", // Matte architectural concrete
        roughness: 0.75,
        metalness: 0.1,
        wireframe,
      }),
      // Granite Plaza Paving
      granitePaving: new THREE.MeshStandardMaterial({
        color: "#334155", // Dark granite paving stone
        roughness: 0.8,
        wireframe,
      }),
      plazaCurbs: new THREE.MeshStandardMaterial({
        color: "#94A3B8",
        roughness: 0.6,
        wireframe,
      }),
      // Slabs and Structural Sills
      floorSlabs: new THREE.MeshStandardMaterial({
        color: "#475569", // Slate grey architectural slab
        roughness: 0.6,
        wireframe,
      }),
      slabEdgeMetal: new THREE.MeshStandardMaterial({
        color: "#1E293B", // Dark bronze / anthracite powder coated slab edge
        metalness: 0.8,
        roughness: 0.3,
        wireframe,
      }),
      // Warm Scandinavian Glulam Timber & Sun Louvers (Brise-Soleil)
      timberWood: new THREE.MeshStandardMaterial({
        color: "#D97706", // Warm honey oak timber
        roughness: 0.45,
        metalness: 0.05,
        wireframe,
      }),
      timberDecking: new THREE.MeshStandardMaterial({
        color: "#B45309", // Teak outdoor terrace decking
        roughness: 0.65,
        wireframe,
      }),
      // Crystal Clear Architectural Curtain Wall Glass
      curtainGlass: new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        transparent: true,
        opacity: wireframe ? 0.95 : 0.22,
        roughness: 0.03,
        transmission: 0.94,
        thickness: 0.6,
        ior: 1.52,
        wireframe,
      }),
      // Dark Architectural Bronze / Anthracite Mullion Frames
      mullions: new THREE.MeshStandardMaterial({
        color: "#0F172A",
        metalness: 0.85,
        roughness: 0.2,
        wireframe,
      }),
      // Stainless Steel & Tension Rods
      stainlessSteel: new THREE.MeshStandardMaterial({
        color: "#CBD5E1",
        metalness: 0.95,
        roughness: 0.15,
        wireframe,
      }),
      // Industrial Galvanized Zinc MEP HVAC Ductwork
      galvanizedDuct: new THREE.MeshStandardMaterial({
        color: "#CBD5E1", // Zinc galvanized sheet metal
        metalness: 0.85,
        roughness: 0.25,
        wireframe,
      }),
      // Tempered Glass Balustrades
      glassBalustrade: new THREE.MeshPhysicalMaterial({
        color: "#F1F5F9",
        transparent: true,
        opacity: wireframe ? 0.9 : 0.35,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 0.25,
        wireframe,
      }),
      // Biophilic Green Roof & Garden Planters
      lawnGrass: new THREE.MeshStandardMaterial({
        color: "#16A34A", // Vibrant architectural roof lawn
        roughness: 0.9,
        wireframe,
      }),
      planterHedge: new THREE.MeshStandardMaterial({
        color: "#15803D",
        roughness: 0.85,
        wireframe,
      }),
      // Interior warm flooring & warm ceiling glow
      interiorWoodFloor: new THREE.MeshStandardMaterial({
        color: "#E2BA86",
        roughness: 0.4,
        wireframe,
      }),
    };
  }, [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* =============================================================
          1. GROUND PLAZA, ENTRANCE STEPS, RAMPS & BIOPHILIC PLANTERS
      ============================================================= */}
      <group position={[0, 0, 0]}>
        {/* Main Paved Public Plaza */}
        <mesh position={[0, 0.1, 0]} material={mats.granitePaving} receiveShadow>
          <boxGeometry args={[16, 0.2, 13]} />
        </mesh>

        {/* Expansion Joint Scoring Bands */}
        {[-5, 0, 5].map((x) => (
          <mesh key={`pave-joint-${x}`} position={[x, 0.21, 0]} material={mats.plazaCurbs}>
            <boxGeometry args={[0.08, 0.02, 13]} />
          </mesh>
        ))}

        {/* Entrance Terraced Steps (5 broad architectural risers) */}
        {[0, 1, 2, 3, 4].map((step) => (
          <mesh
            key={`step-${step}`}
            position={[0, 0.04 + step * 0.06, 6.6 + step * 0.4]}
            material={mats.granitePaving}
            receiveShadow
          >
            <boxGeometry args={[7.2 - step * 0.2, 0.06, 0.45]} />
          </mesh>
        ))}

        {/* Low Perimeter Planters with Green Hedges */}
        {[-7.2, 7.2].map((x) => (
          <group key={`plaza-planter-${x}`} position={[x, 0.35, 0]}>
            <mesh material={mats.limestoneFacade} castShadow receiveShadow>
              <boxGeometry args={[1.0, 0.5, 10.5]} />
            </mesh>
            <mesh position={[0, 0.32, 0]} material={mats.planterHedge} castShadow>
              <boxGeometry args={[0.8, 0.22, 10.3]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* =============================================================
          2. STRUCTURAL CONCRETE ELEVATOR / SERVICE CORE (Continuous)
      ============================================================= */}
      <group position={[-2.4, 4.4 * explodeFactor, -1.2]}>
        <mesh material={mats.concreteCore} castShadow receiveShadow>
          <boxGeometry args={[2.8, 8.8 * explodeFactor, 2.6]} />
        </mesh>
        {/* Architectural Reveals / Formwork Lines */}
        {[-2.5, -0.8, 0.9, 2.6].map((y, i) => (
          <mesh key={`formwork-${i}`} position={[1.41, y * explodeFactor, 0]} material={mats.slabEdgeMetal}>
            <boxGeometry args={[0.03, 0.04, 2.6]} />
          </mesh>
        ))}
      </group>

      {/* =============================================================
          3. LEVEL 1: DOUBLE-HEIGHT GROUND ATRIUM & REVOLVING DOORS
      ============================================================= */}
      <group position={[0, 0.2 * explodeFactor, 0]}>
        {/* L1 Interior Warm Wood Flooring */}
        <mesh position={[0, 0.02, 0]} material={mats.interiorWoodFloor} receiveShadow>
          <boxGeometry args={[12.8, 0.04, 9.8]} />
        </mesh>

        {/* Ground Floor Structural Columns on Axis Grid */}
        {[-4.6, -1.6, 1.6, 4.6].map((x) =>
          [-3.4, 0, 3.4].map((z) => (
            <group key={`col-l1-${x}-${z}`} position={[x, 1.4, z]}>
              <mesh material={mats.timberWood} castShadow>
                <cylinderGeometry args={[0.13, 0.13, 2.7, 16]} />
              </mesh>
              {/* Stainless Steel Capital & Base Collars */}
              <mesh position={[0, -1.3, 0]} material={mats.stainlessSteel}>
                <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
              </mesh>
              <mesh position={[0, 1.3, 0]} material={mats.stainlessSteel}>
                <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
              </mesh>
            </group>
          ))
        )}

        {/* Floor-to-Ceiling Ultra-Clear Glass Curtain Wall */}
        <mesh position={[0, 1.4, 0]} material={mats.curtainGlass}>
          <boxGeometry args={[13.0, 2.7, 10.0]} />
        </mesh>

        {/* Vertical Architectural Mullions (Spaced every 1.4m) */}
        {[-6.5, -5.1, -3.7, -2.3, -0.9, 0.9, 2.3, 3.7, 5.1, 6.5].map((x) => (
          <mesh key={`mullion-front-${x}`} position={[x, 1.4, 5.01]} material={mats.mullions}>
            <boxGeometry args={[0.05, 2.7, 0.08]} />
          </mesh>
        ))}
        {[-6.5, -5.1, -3.7, -2.3, -0.9, 0.9, 2.3, 3.7, 5.1, 6.5].map((x) => (
          <mesh key={`mullion-back-${x}`} position={[x, 1.4, -5.01]} material={mats.mullions}>
            <boxGeometry args={[0.05, 2.7, 0.08]} />
          </mesh>
        ))}

        {/* Entrance Revolving Glass Door Detail at Center Front */}
        <group position={[0, 1.0, 5.05]}>
          <mesh material={mats.mullions}>
            <cylinderGeometry args={[1.0, 1.0, 2.0, 24, 1, true]} />
          </mesh>
          <mesh material={mats.stainlessSteel}>
            <cylinderGeometry args={[0.04, 0.04, 2.0, 12]} />
          </mesh>
          <mesh material={mats.curtainGlass}>
            <boxGeometry args={[1.8, 1.9, 0.04]} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]} material={mats.curtainGlass}>
            <boxGeometry args={[1.8, 1.9, 0.04]} />
          </mesh>
        </group>
      </group>

      {/* =============================================================
          4. LEVEL 2: MEZZANINE SLAB & SCANDINAVIAN SUN LOUVERS
      ============================================================= */}
      <group position={[0, 2.9 * explodeFactor, 0]}>
        {/* Floor Slab with Edge Banding */}
        <mesh position={[0, 0, 0]} material={mats.floorSlabs} castShadow receiveShadow>
          <boxGeometry args={[13.2, 0.32, 10.2]} />
        </mesh>
        <mesh position={[0, 0, 0]} material={mats.slabEdgeMetal}>
          <boxGeometry args={[13.28, 0.28, 10.28]} />
        </mesh>

        {/* L2 Columns */}
        {[-4.6, 0, 4.6].map((x) =>
          [-3.4, 3.4].map((z) => (
            <mesh key={`col-l2-${x}-${z}`} position={[x, 1.15, z]} material={mats.timberWood} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 2.1, 16]} />
            </mesh>
          ))
        )}

        {/* L2 Glazing */}
        <mesh position={[0, 1.15, 0]} material={mats.curtainGlass}>
          <boxGeometry args={[12.6, 2.1, 9.6]} />
        </mesh>

        {/* Vertical Timber Brise-Soleil Sun Louvers on South-West Facade */}
        {[-6.2, -5.6, -5.0, -4.4, -3.8, -3.2, -2.6, -2.0].map((x) => (
          <mesh
            key={`louver-${x}`}
            position={[x, 1.15, 4.95]}
            rotation={[0, 0.35, 0]}
            material={mats.timberWood}
            castShadow
          >
            <boxGeometry args={[0.06, 2.1, 0.32]} />
          </mesh>
        ))}
      </group>

      {/* =============================================================
          5. LEVEL 3: CANTILEVERED OBSERVATION TERRACE & BALUSTRADES
      ============================================================= */}
      <group position={[0, 5.2 * explodeFactor, 0]}>
        {/* Main Building Slab */}
        <mesh position={[-1.2, 0, 0]} material={mats.floorSlabs} castShadow receiveShadow>
          <boxGeometry args={[10.6, 0.35, 9.8]} />
        </mesh>

        {/* Solid Architectural Limestone Cladding on West Elevation */}
        <mesh position={[-6.4, 1.25, 0]} material={mats.limestoneFacade} castShadow receiveShadow>
          <boxGeometry args={[0.4, 2.3, 9.8]} />
        </mesh>

        {/* -------------------------------------------------------------
            DRAMATIC 4.0m CANTILEVER OBSERVATION TERRACE (East Overhang)
        ------------------------------------------------------------- */}
        <group position={[4.6, 0, 0.8]}>
          {/* Outdoor Cedar Timber Decking */}
          <mesh position={[0, 0.08, 0]} material={mats.timberDecking} castShadow receiveShadow>
            <boxGeometry args={[4.4, 0.14, 5.2]} />
          </mesh>

          {/* Structural Steel Tapered Outrigger Beams Underneath */}
          {[-2.0, 0, 2.0].map((z) => (
            <mesh key={`outrigger-${z}`} position={[-0.6, -0.32, z]} material={mats.slabEdgeMetal} castShadow>
              <boxGeometry args={[3.2, 0.48, 0.14]} />
            </mesh>
          ))}

          {/* Frameless Tempered Glass Railing Around Perimeter */}
          {/* East Edge */}
          <mesh position={[2.18, 0.6, 0]} material={mats.glassBalustrade}>
            <boxGeometry args={[0.04, 1.0, 5.2]} />
          </mesh>
          <mesh position={[2.18, 1.12, 0]} material={mats.stainlessSteel}>
            <boxGeometry args={[0.08, 0.05, 5.24]} />
          </mesh>
          {/* North Edge */}
          <mesh position={[0, 0.6, 2.58]} material={mats.glassBalustrade}>
            <boxGeometry args={[4.36, 1.0, 0.04]} />
          </mesh>
          <mesh position={[0, 1.12, 2.58]} material={mats.stainlessSteel}>
            <boxGeometry args={[4.4, 0.05, 0.08]} />
          </mesh>
          {/* South Edge */}
          <mesh position={[0, 0.6, -2.58]} material={mats.glassBalustrade}>
            <boxGeometry args={[4.36, 1.0, 0.04]} />
          </mesh>
          <mesh position={[0, 1.12, -2.58]} material={mats.stainlessSteel}>
            <boxGeometry args={[4.4, 0.05, 0.08]} />
          </mesh>
        </group>

        {/* Level 3 Upper Glazed Lounge */}
        <mesh position={[-1.2, 1.25, 0]} material={mats.curtainGlass}>
          <boxGeometry args={[10.2, 2.3, 9.4]} />
        </mesh>
      </group>

      {/* =============================================================
          6. LEVEL 4: ROOFTOP PENTHOUSE, GREEN TURF LAWN & PERGOLA
      ============================================================= */}
      <group position={[0, 7.6 * explodeFactor, 0]}>
        {/* Roof Structural Concrete Slab */}
        <mesh position={[0, 0, 0]} material={mats.floorSlabs} castShadow receiveShadow>
          <boxGeometry args={[13.4, 0.32, 10.4]} />
        </mesh>

        {/* Extensive Green Roof Lawn (Real Green Grass Turf!) */}
        <mesh position={[-1.5, 0.18, 0]} material={mats.lawnGrass} receiveShadow>
          <boxGeometry args={[8.8, 0.06, 9.4]} />
        </mesh>

        {/* Roof Perimeter Limestone Parapet Wall */}
        <mesh position={[0, 0.45, 5.15]} material={mats.limestoneFacade}>
          <boxGeometry args={[13.4, 0.65, 0.25]} />
        </mesh>
        <mesh position={[0, 0.45, -5.15]} material={mats.limestoneFacade}>
          <boxGeometry args={[13.4, 0.65, 0.25]} />
        </mesh>
        <mesh position={[6.65, 0.45, 0]} material={mats.limestoneFacade}>
          <boxGeometry args={[0.25, 0.65, 10.4]} />
        </mesh>
        <mesh position={[-6.65, 0.45, 0]} material={mats.limestoneFacade}>
          <boxGeometry args={[0.25, 0.65, 10.4]} />
        </mesh>

        {/* Central Skylight Lantern Atrium Opening */}
        <mesh position={[0, 0.4, 0]} material={mats.curtainGlass}>
          <boxGeometry args={[3.6, 0.6, 3.6]} />
        </mesh>
        <mesh position={[0, 0.72, 0]} material={mats.mullions}>
          <boxGeometry args={[3.7, 0.06, 3.7]} />
        </mesh>

        {/* Architectural Rooftop Timber Pergola / Canopy */}
        <group position={[3.6, 1.4, 0]}>
          {/* 4 Corner Support Posts */}
          {[-1.8, 1.8].map((x) =>
            [-1.8, 1.8].map((z) => (
              <mesh key={`pergola-post-${x}-${z}`} position={[x, -0.6, z]} material={mats.mullions}>
                <boxGeometry args={[0.1, 1.4, 0.1]} />
              </mesh>
            ))
          )}
          {/* Horizontal Timber Rafters */}
          {[-1.6, -1.0, -0.4, 0.2, 0.8, 1.4].map((x) => (
            <mesh key={`rafter-${x}`} position={[x, 0.1, 0]} material={mats.timberWood} castShadow>
              <boxGeometry args={[0.08, 0.22, 4.0]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* =============================================================
          7. CRITICAL 3D MEP DUCTWORK CLASH AT GRID E-4
          (Matches Annotation #1: Galvanized HVAC trunk duct colliding
          directly with glulam diagonal cross-brace at atrium +3.4m level)
      ============================================================= */}
      <group position={[1.8, 3.4 * explodeFactor, -0.6]}>
        {/* Galvanized Zinc Sheet Metal Trunk Duct */}
        <mesh material={mats.galvanizedDuct} castShadow>
          <boxGeometry args={[4.6, 0.65, 0.8]} />
        </mesh>
        {/* Stiffening Reinforcement Flanges & Joints */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((x) => (
          <mesh key={`flange-${x}`} position={[x, 0, 0]} material={mats.stainlessSteel}>
            <boxGeometry args={[0.04, 0.72, 0.88]} />
          </mesh>
        ))}
        {/* Circular Air Supply Branch Diffuser */}
        <mesh position={[0.9, -0.4, 0.4]} material={mats.galvanizedDuct}>
          <cylinderGeometry args={[0.18, 0.18, 0.45, 16]} />
        </mesh>

        {/* Glulam Diagonal Strut PHYSICALLY COLLIDING With Duct */}
        <mesh
          position={[0, 0, 0]}
          rotation={[0.32, 0.2, 0.62]}
          material={mats.timberWood}
          castShadow
        >
          <boxGeometry args={[0.26, 1.9, 0.26]} />
        </mesh>

        {/* Clash Indicator Cage */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.9, 1.1]} />
          <meshBasicMaterial color="#EF4444" wireframe opacity={0.65} transparent />
        </mesh>
      </group>

      {/* =============================================================
          8. WARM INTERIOR LIGHTING ELEMENTS
          (Soft luminous light shining through the glass from inside)
      ============================================================= */}
      <pointLight position={[0, 1.6 * explodeFactor, 0]} color="#FDE68A" intensity={1.4} distance={9} />
      <pointLight position={[2.2, 4.0 * explodeFactor, 0.5]} color="#FED7AA" intensity={1.2} distance={8} />
      <pointLight position={[-1.8, 6.2 * explodeFactor, 0]} color="#FDE68A" intensity={1.0} distance={7} />
    </group>
  );
}

// -------------------------------------------------------------
// Custom Uploaded GLTF/GLB Model Loader
// -------------------------------------------------------------
function LoadedGLTFModel({
  url,
  wireframe,
  exploded,
  onLoaded,
  onError,
}: {
  url: string;
  wireframe: boolean;
  exploded: boolean;
  onLoaded?: (stats: { meshCount: number; vertexCount: number; materialsCount: number; boundingBox: [number, number, number] }) => void;
  onError?: (err: string) => void;
}) {
  const [sceneObj, setSceneObj] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const loader = new GLTFLoader();

    loader.load(
      url,
      (gltf) => {
        if (isCancelled) return;
        const root = gltf.scene;

        let meshCount = 0;
        let vertexCount = 0;
        const materialsSet = new Set<string>();

        // Center and normalize model
        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 12 / maxDim : 1;

        root.position.x = -center.x * scale;
        root.position.y = -box.min.y * scale; // align base firmly to ground
        root.position.z = -center.z * scale;
        root.scale.set(scale, scale, scale);

        root.traverse((node: any) => {
          if (node.isMesh) {
            meshCount++;
            if (node.geometry && node.geometry.attributes.position) {
              vertexCount += node.geometry.attributes.position.count;
            }
            if (node.material) {
              if (Array.isArray(node.material)) {
                node.material.forEach((m: any) => materialsSet.add(m.uuid));
              } else {
                materialsSet.add(node.material.uuid);
              }
            }
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        setSceneObj(root);

        if (onLoaded) {
          onLoaded({
            meshCount,
            vertexCount,
            materialsCount: materialsSet.size,
            boundingBox: [
              parseFloat(size.x.toFixed(1)),
              parseFloat(size.y.toFixed(1)),
              parseFloat(size.z.toFixed(1)),
            ],
          });
        }
      },
      undefined,
      (error) => {
        if (isCancelled) return;
        console.error("Failed to load GLTF model:", error);
        if (onError) {
          onError("Could not parse 3D GLTF/GLB file. Please verify it is a valid 3D asset.");
        }
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [url, onLoaded, onError]);

  // Apply wireframe updates recursively across loaded model
  useEffect(() => {
    if (!sceneObj) return;
    sceneObj.traverse((node: any) => {
      if (node.isMesh && node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((mat: any) => {
            mat.wireframe = wireframe;
          });
        } else {
          node.material.wireframe = wireframe;
        }
      }
    });
  }, [sceneObj, wireframe]);

  // Apply exploded view translation if requested
  useEffect(() => {
    if (!sceneObj) return;
    sceneObj.traverse((node: any) => {
      if (node.isMesh && node.position.y > 2) {
        node.position.y = exploded ? node.position.y * 1.3 : node.position.y;
      }
    });
  }, [sceneObj, exploded]);

  if (!sceneObj) return null;

  return <primitive object={sceneObj} />;
}

// -------------------------------------------------------------
// Internal Camera Director: manages smooth animation, presets, fit, zoom, and focus
// -------------------------------------------------------------
function CameraDirector({
  controlsRef,
  presetView,
  resetTrigger,
  fitToViewTrigger,
  zoomInTrigger,
  zoomOutTrigger,
  focusPosition,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl>;
  presetView?: CameraPresetView | null;
  resetTrigger?: number;
  fitToViewTrigger?: number;
  zoomInTrigger?: number;
  zoomOutTrigger?: number;
  focusPosition?: [number, number, number] | null;
}) {
  const { camera } = useThree();

  // Focus on specific annotation coordinates
  useEffect(() => {
    if (!focusPosition || !controlsRef.current) return;
    const [x, y, z] = focusPosition;

    controlsRef.current.target.set(x, y, z);
    camera.position.set(x + 5.5, y + 4.0, z + 5.5);
    camera.lookAt(x, y, z);
    controlsRef.current.update();
  }, [focusPosition, camera, controlsRef]);

  // Handle Preset Camera Angles
  useEffect(() => {
    if (!presetView || !controlsRef.current) return;

    controlsRef.current.target.set(0, 3.5, 0);

    switch (presetView) {
      case "top":
        camera.position.set(0, 26, 0.001);
        break;
      case "front":
        camera.position.set(0, 4.5, 20);
        break;
      case "side":
        camera.position.set(20, 4.5, 0);
        break;
      case "perspective":
      default:
        camera.position.set(14, 11, 14);
        break;
    }
    camera.lookAt(0, 3.5, 0);
    controlsRef.current.update();
  }, [presetView, camera, controlsRef]);

  // Reset Camera View
  useEffect(() => {
    if (resetTrigger === undefined || resetTrigger === 0 || !controlsRef.current) return;
    controlsRef.current.target.set(0, 3.5, 0);
    camera.position.set(14, 11, 14);
    camera.lookAt(0, 3.5, 0);
    controlsRef.current.update();
  }, [resetTrigger, camera, controlsRef]);

  // Fit to View (auto frame)
  useEffect(() => {
    if (fitToViewTrigger === undefined || fitToViewTrigger === 0 || !controlsRef.current) return;
    controlsRef.current.target.set(0, 3.5, 0);
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 3.5, 0);
    controlsRef.current.update();
  }, [fitToViewTrigger, camera, controlsRef]);

  // Zoom In
  useEffect(() => {
    if (zoomInTrigger === undefined || zoomInTrigger === 0 || !controlsRef.current) return;
    const dir = new THREE.Vector3().subVectors(controlsRef.current.target, camera.position).normalize();
    camera.position.addScaledVector(dir, 2.5);
    controlsRef.current.update();
  }, [zoomInTrigger, camera, controlsRef]);

  // Zoom Out
  useEffect(() => {
    if (zoomOutTrigger === undefined || zoomOutTrigger === 0 || !controlsRef.current) return;
    const dir = new THREE.Vector3().subVectors(controlsRef.current.target, camera.position).normalize();
    camera.position.addScaledVector(dir, -2.8);
    controlsRef.current.update();
  }, [zoomOutTrigger, camera, controlsRef]);

  return null;
}

// -------------------------------------------------------------
// Primary Exported Architectural Scene
// -------------------------------------------------------------
export default function ArchitecturalScene({
  customModelUrl,
  wireframeMode,
  explodedView,
  showGrid = true,
  sunAngle = 45,
  lightIntensity = 1.3,
  lightingMode = "day",
  annotations,
  activeAnnotationId,
  onSelectAnnotation,
  isAddingAnnotation,
  onCanvasClickToAddAnnotation,
  presetView,
  resetCameraTrigger,
  fitToViewTrigger,
  zoomInTrigger,
  zoomOutTrigger,
  focusPosition,
  onModelLoaded,
  onModelError,
}: ArchitecturalSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [hoverPosition, setHoverPosition] = useState<[number, number, number] | null>(null);

  // Compute sun position based on sunAngle (degrees)
  const sunPos = useMemo(() => {
    const rad = (sunAngle * Math.PI) / 180;
    const radius = 22;
    return [
      parseFloat((Math.cos(rad) * radius).toFixed(2)),
      20,
      parseFloat((Math.sin(rad) * radius).toFixed(2)),
    ] as [number, number, number];
  }, [sunAngle]);

  const ambientColor = lightingMode === "dusk" ? "#fed7aa" : "#f8fafc";
  const ambientIntensity = lightingMode === "dusk" ? 0.6 : 0.85;
  const directionalColor = lightingMode === "dusk" ? "#fb923c" : "#ffffff";

  // Raycast click handler for placing 3D markup pins on actual model surfaces
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (isAddingAnnotation && e.point) {
      e.stopPropagation();
      const pos: [number, number, number] = [
        parseFloat(e.point.x.toFixed(2)),
        parseFloat(e.point.y.toFixed(2)),
        parseFloat(e.point.z.toFixed(2)),
      ];
      onCanvasClickToAddAnnotation(pos);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isAddingAnnotation && e.point) {
      setHoverPosition([
        parseFloat(e.point.x.toFixed(2)),
        parseFloat(e.point.y.toFixed(2)),
        parseFloat(e.point.z.toFixed(2)),
      ]);
    } else if (hoverPosition) {
      setHoverPosition(null);
    }
  };

  return (
    <div
      className={`relative w-full h-full select-none ${
        isAddingAnnotation ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <Canvas
        shadows
        camera={{ position: [14, 11, 14], fov: 40 }}
        className="w-full h-full bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#070B14]"
      >
        {/* Photorealistic Environment & Reflection Map */}
        <Environment preset={lightingMode === "dusk" ? "sunset" : "city"} />

        {/* Ambient Sky Fill & Directional Sun Light */}
        <ambientLight color={ambientColor} intensity={ambientIntensity} />
        <directionalLight
          position={sunPos}
          color={directionalColor}
          intensity={lightIntensity}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-sunPos[0], 10, -sunPos[2]]}
          intensity={0.5}
          color="#38BDF8"
        />

        {/* Soft High-Fidelity Contact Shadows (Grounds the building naturally!) */}
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.65}
          scale={38}
          blur={2.4}
          far={12}
          resolution={1024}
          color="#000000"
        />

        {/* Camera Director Hook */}
        <CameraDirector
          controlsRef={controlsRef}
          presetView={presetView}
          resetTrigger={resetCameraTrigger}
          fitToViewTrigger={fitToViewTrigger}
          zoomInTrigger={zoomInTrigger}
          zoomOutTrigger={zoomOutTrigger}
          focusPosition={focusPosition}
        />

        {/* 3D Interaction Wrapper */}
        <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
          {/* Ground Grid with visibility toggle */}
          {showGrid && (
            <Grid
              position={[0, -0.015, 0]}
              args={[32, 32]}
              cellSize={1.2}
              cellThickness={1}
              cellColor="#1E293B"
              sectionSize={6}
              sectionThickness={1.5}
              sectionColor="#00F0FF"
              fadeDistance={36}
              fadeStrength={1.5}
            />
          )}

          {/* Model Display: Custom Uploaded GLB/GLTF or Authentic Architectural Building */}
          {customModelUrl ? (
            <Center top>
              <LoadedGLTFModel
                url={customModelUrl}
                wireframe={wireframeMode}
                exploded={explodedView}
                onLoaded={onModelLoaded}
                onError={onModelError}
              />
            </Center>
          ) : (
            <Center top>
              <RealArchitecturalBuilding
                wireframe={wireframeMode}
                exploded={explodedView}
              />
            </Center>
          )}

          {/* Live Crosshair Preview when placing 3D Pin */}
          {isAddingAnnotation && hoverPosition && (
            <mesh position={hoverPosition}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#EF4444" wireframe />
            </mesh>
          )}

          {/* Saved 3D Interactive Annotation Pins */}
          {annotations.map((ann) => (
            <AnnotationPin
              key={ann.id}
              annotation={ann}
              isSelected={ann.id === activeAnnotationId}
              onClick={() => onSelectAnnotation(ann.id)}
            />
          ))}
        </group>

        {/* Orbit Controls with full Pan, Zoom, Rotate */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={2}
          maxDistance={55}
          maxPolarAngle={Math.PI / 2 - 0.02}
        />
      </Canvas>
    </div>
  );
}
