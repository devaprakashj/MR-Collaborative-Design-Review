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
import { Annotation, ProjectCategory } from "@/types";

export type CameraPresetView = "perspective" | "top" | "front" | "side";

interface ArchitecturalSceneProps {
  projectId?: string;
  projectCategory?: ProjectCategory;
  projectName?: string;
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
// 1. MODEL: NORDIC HORIZON CULTURAL FORUM (Cultural & Museum)
// -------------------------------------------------------------
function NordicCulturalForum({ wireframe, exploded }: { wireframe: boolean; exploded: boolean }) {
  const explodeFactor = exploded ? 1.55 : 1.0;

  const mats = useMemo(() => ({
    limestone: new THREE.MeshStandardMaterial({ color: "#E2E8F0", roughness: 0.85, metalness: 0.05, wireframe }),
    concrete: new THREE.MeshStandardMaterial({ color: "#64748B", roughness: 0.75, metalness: 0.1, wireframe }),
    paving: new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.8, wireframe }),
    slabs: new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.6, wireframe }),
    edgeMetal: new THREE.MeshStandardMaterial({ color: "#1E293B", metalness: 0.8, roughness: 0.3, wireframe }),
    timber: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.45, metalness: 0.05, wireframe }),
    timberDeck: new THREE.MeshStandardMaterial({ color: "#B45309", roughness: 0.65, wireframe }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", transparent: true, opacity: wireframe ? 0.95 : 0.22, roughness: 0.03, transmission: 0.94, thickness: 0.6, ior: 1.52, wireframe }),
    mullions: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.85, roughness: 0.2, wireframe }),
    steel: new THREE.MeshStandardMaterial({ color: "#CBD5E1", metalness: 0.95, roughness: 0.15, wireframe }),
    galvDuct: new THREE.MeshStandardMaterial({ color: "#CBD5E1", metalness: 0.85, roughness: 0.25, wireframe }),
    balustrade: new THREE.MeshPhysicalMaterial({ color: "#F1F5F9", transparent: true, opacity: wireframe ? 0.9 : 0.35, roughness: 0.05, transmission: 0.9, thickness: 0.25, wireframe }),
    lawn: new THREE.MeshStandardMaterial({ color: "#16A34A", roughness: 0.9, wireframe }),
    hedge: new THREE.MeshStandardMaterial({ color: "#15803D", roughness: 0.85, wireframe }),
    woodFloor: new THREE.MeshStandardMaterial({ color: "#E2BA86", roughness: 0.4, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Plaza & Stepped Approach */}
      <mesh position={[0, 0.1, 0]} material={mats.paving} receiveShadow>
        <boxGeometry args={[16, 0.2, 13]} />
      </mesh>
      {[0, 1, 2, 3, 4].map((step) => (
        <mesh key={`step-${step}`} position={[0, 0.04 + step * 0.06, 6.6 + step * 0.4]} material={mats.paving} receiveShadow>
          <boxGeometry args={[7.2 - step * 0.2, 0.06, 0.45]} />
        </mesh>
      ))}
      {[-7.2, 7.2].map((x) => (
        <group key={`plaza-planter-${x}`} position={[x, 0.35, 0]}>
          <mesh material={mats.limestone} castShadow receiveShadow><boxGeometry args={[1.0, 0.5, 10.5]} /></mesh>
          <mesh position={[0, 0.32, 0]} material={mats.hedge} castShadow><boxGeometry args={[0.8, 0.22, 10.3]} /></mesh>
        </group>
      ))}

      {/* Concrete Core */}
      <group position={[-2.4, 4.4 * explodeFactor, -1.2]}>
        <mesh material={mats.concrete} castShadow receiveShadow><boxGeometry args={[2.8, 8.8 * explodeFactor, 2.6]} /></mesh>
      </group>

      {/* L1 Double-Height Atrium */}
      <group position={[0, 0.2 * explodeFactor, 0]}>
        <mesh position={[0, 0.02, 0]} material={mats.woodFloor} receiveShadow><boxGeometry args={[12.8, 0.04, 9.8]} /></mesh>
        {[-4.6, -1.6, 1.6, 4.6].map((x) =>
          [-3.4, 0, 3.4].map((z) => (
            <mesh key={`col-l1-${x}-${z}`} position={[x, 1.4, z]} material={mats.timber} castShadow>
              <cylinderGeometry args={[0.13, 0.13, 2.7, 16]} />
            </mesh>
          ))
        )}
        <mesh position={[0, 1.4, 0]} material={mats.glass}><boxGeometry args={[13.0, 2.7, 10.0]} /></mesh>
        {[-6.5, -3.7, -0.9, 0.9, 3.7, 6.5].map((x) => (
          <mesh key={`mullion-${x}`} position={[x, 1.4, 5.01]} material={mats.mullions}><boxGeometry args={[0.05, 2.7, 0.08]} /></mesh>
        ))}
      </group>

      {/* L2 Mezzanine with Sun Louvers */}
      <group position={[0, 2.9 * explodeFactor, 0]}>
        <mesh position={[0, 0, 0]} material={mats.slabs} castShadow receiveShadow><boxGeometry args={[13.2, 0.32, 10.2]} /></mesh>
        <mesh position={[0, 1.15, 0]} material={mats.glass}><boxGeometry args={[12.6, 2.1, 9.6]} /></mesh>
        {[-6.2, -5.4, -4.6, -3.8, -3.0].map((x) => (
          <mesh key={`louver-${x}`} position={[x, 1.15, 4.95]} rotation={[0, 0.35, 0]} material={mats.timber} castShadow>
            <boxGeometry args={[0.06, 2.1, 0.32]} />
          </mesh>
        ))}
      </group>

      {/* L3 Cantilevered Observation Deck */}
      <group position={[0, 5.2 * explodeFactor, 0]}>
        <mesh position={[-1.2, 0, 0]} material={mats.slabs} castShadow receiveShadow><boxGeometry args={[10.6, 0.35, 9.8]} /></mesh>
        {/* Cantilever Deck */}
        <group position={[4.6, 0, 0.8]}>
          <mesh position={[0, 0.08, 0]} material={mats.timberDeck} castShadow receiveShadow><boxGeometry args={[4.4, 0.14, 5.2]} /></mesh>
          {[-2.0, 0, 2.0].map((z) => (
            <mesh key={`outrigger-${z}`} position={[-0.6, -0.32, z]} material={mats.edgeMetal} castShadow><boxGeometry args={[3.2, 0.48, 0.14]} /></mesh>
          ))}
          <mesh position={[2.18, 0.6, 0]} material={mats.balustrade}><boxGeometry args={[0.04, 1.0, 5.2]} /></mesh>
          <mesh position={[0, 0.6, 2.58]} material={mats.balustrade}><boxGeometry args={[4.36, 1.0, 0.04]} /></mesh>
          <mesh position={[0, 0.6, -2.58]} material={mats.balustrade}><boxGeometry args={[4.36, 1.0, 0.04]} /></mesh>
        </group>
        <mesh position={[-1.2, 1.25, 0]} material={mats.glass}><boxGeometry args={[10.2, 2.3, 9.4]} /></mesh>
      </group>

      {/* L4 Green Roof Lawn & Pergola */}
      <group position={[0, 7.6 * explodeFactor, 0]}>
        <mesh position={[0, 0, 0]} material={mats.slabs} castShadow receiveShadow><boxGeometry args={[13.4, 0.32, 10.4]} /></mesh>
        <mesh position={[-1.5, 0.18, 0]} material={mats.lawn} receiveShadow><boxGeometry args={[8.8, 0.06, 9.4]} /></mesh>
        {/* Pergola */}
        <group position={[3.6, 1.4, 0]}>
          {[-1.6, -0.8, 0, 0.8, 1.6].map((x) => (
            <mesh key={`rafter-${x}`} position={[x, 0.1, 0]} material={mats.timber} castShadow><boxGeometry args={[0.08, 0.22, 4.0]} /></mesh>
          ))}
        </group>
      </group>

      {/* Visible MEP Duct Collision at Grid E-4 */}
      <group position={[1.8, 3.4 * explodeFactor, -0.6]}>
        <mesh material={mats.galvDuct} castShadow><boxGeometry args={[4.6, 0.65, 0.8]} /></mesh>
        <mesh position={[0, 0, 0]} rotation={[0.32, 0.2, 0.62]} material={mats.timber} castShadow>
          <boxGeometry args={[0.26, 1.9, 0.26]} />
        </mesh>
        <mesh position={[0, 0, 0]}><boxGeometry args={[1.1, 0.9, 1.1]} /><meshBasicMaterial color="#EF4444" wireframe opacity={0.65} transparent /></mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 2. MODEL: VERTEX BIOPHILIC MIXED-USE TOWER (Commercial High-Rise)
// Soaring multi-tier skyscraper with spiraling sky-gardens, curved
// aerodynamic glass facade, titanium structural exoskeleton & crown
// -------------------------------------------------------------
function VertexBiophilicTower({ wireframe, exploded }: { wireframe: boolean; exploded: boolean }) {
  const explodeFactor = exploded ? 1.4 : 1.0;

  const mats = useMemo(() => ({
    towerGlass: new THREE.MeshPhysicalMaterial({ color: "#BAE6FD", transparent: true, opacity: wireframe ? 0.95 : 0.25, roughness: 0.04, transmission: 0.92, thickness: 0.8, ior: 1.52, wireframe }),
    titaniumSpandrel: new THREE.MeshStandardMaterial({ color: "#1E293B", metalness: 0.9, roughness: 0.2, wireframe }),
    exoSteel: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.85, roughness: 0.25, wireframe }),
    skyGardenLawn: new THREE.MeshStandardMaterial({ color: "#15803D", roughness: 0.85, wireframe }),
    terraceWood: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.55, wireframe }),
    concretePodium: new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.8, wireframe }),
    crownGlow: new THREE.MeshStandardMaterial({ color: "#00F0FF", emissive: "#00F0FF", emissiveIntensity: 0.8, roughness: 0.1 }),
    paving: new THREE.MeshStandardMaterial({ color: "#0F172A", roughness: 0.9, wireframe }),
  }), [wireframe]);

  // Tower Tier Configuration (Height ~ 16 units)
  const floorLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Arrival Plaza & Podium */}
      <mesh position={[0, 0.15, 0]} material={mats.paving} receiveShadow>
        <boxGeometry args={[18, 0.3, 18]} />
      </mesh>
      {/* Podium Tier (Floors 1-3) */}
      <group position={[0, 1.2 * explodeFactor, 0]}>
        <mesh material={mats.concretePodium} castShadow receiveShadow>
          <boxGeometry args={[11, 2.2, 11]} />
        </mesh>
        <mesh position={[0, 0, 0]} material={mats.towerGlass}>
          <boxGeometry args={[11.2, 2.1, 11.2]} />
        </mesh>
        {/* Entrance Double-Height Canopy */}
        <mesh position={[0, 0.4, 6.2]} material={mats.titaniumSpandrel} castShadow>
          <boxGeometry args={[6.5, 0.2, 2.2]} />
        </mesh>
      </group>

      {/* Main Soaring Tower Shaft (Floors 4-15) */}
      {floorLevels.map((lvl) => {
        if (lvl < 2) return null;
        const yPos = (lvl * 0.95 + 1.2) * explodeFactor;
        const width = 8.5 - lvl * 0.18; // Tapering profile
        const hasSkyGarden = lvl % 3 === 0;
        const gardenSide = lvl % 6 === 0 ? 1 : -1;

        return (
          <group key={`tower-fl-${lvl}`} position={[0, yPos, 0]}>
            {/* Floor Slab Plate with Metallic Spandrel */}
            <mesh material={mats.titaniumSpandrel} castShadow>
              <boxGeometry args={[width + 0.3, 0.18, width + 0.3]} />
            </mesh>

            {/* Facade Glass Curtain */}
            <mesh position={[0, 0.45 * explodeFactor, 0]} material={mats.towerGlass}>
              <boxGeometry args={[width, 0.88 * explodeFactor, width]} />
            </mesh>

            {/* Corner Structural Mega-Columns */}
            {[-1, 1].map((sx) =>
              [-1, 1].map((sz) => (
                <mesh
                  key={`col-${lvl}-${sx}-${sz}`}
                  position={[(width / 2) * sx, 0.45 * explodeFactor, (width / 2) * sz]}
                  material={mats.exoSteel}
                  castShadow
                >
                  <boxGeometry args={[0.28, 0.95 * explodeFactor, 0.28]} />
                </mesh>
              ))
            )}

            {/* Spiraling Biophilic Sky Gardens (Cutouts on alternating floors) */}
            {hasSkyGarden && (
              <group position={[(width / 2 + 0.8) * gardenSide, 0.05, 0]}>
                <mesh material={mats.terraceWood} castShadow>
                  <boxGeometry args={[1.8, 0.1, width * 0.6]} />
                </mesh>
                <mesh position={[0, 0.08, 0]} material={mats.skyGardenLawn}>
                  <boxGeometry args={[1.5, 0.06, width * 0.5]} />
                </mesh>
                {/* Terrace Safety Glass Railing */}
                <mesh position={[0.95, 0.5, 0]} material={mats.towerGlass}>
                  <boxGeometry args={[0.04, 0.9, width * 0.6]} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* Soaring Aerodynamic Sky Crown & Antenna Spire */}
      <group position={[0, (15 * 0.95 + 2.5) * explodeFactor, 0]}>
        <mesh material={mats.exoSteel} castShadow>
          <cylinderGeometry args={[1.8, 3.2, 2.4 * explodeFactor, 8]} />
        </mesh>
        <mesh position={[0, 1.8 * explodeFactor, 0]} material={mats.crownGlow}>
          <cylinderGeometry args={[0.08, 0.12, 3.5, 12]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 3. MODEL: HELIX PARAMETRIC BOTANICAL PAVILION (Sustainable Pavilion)
// Double-curved reciprocal timber shell, biophilic spiral dome & reflecting pond
// -------------------------------------------------------------
function HelixParametricPavilion({ wireframe, exploded }: { wireframe: boolean; exploded: boolean }) {
  const explodeFactor = exploded ? 1.5 : 1.0;

  const mats = useMemo(() => ({
    glulamRibs: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.45, metalness: 0.1, wireframe }),
    darkTimber: new THREE.MeshStandardMaterial({ color: "#92400E", roughness: 0.6, wireframe }),
    skylightGlass: new THREE.MeshPhysicalMaterial({ color: "#A7F3D0", transparent: true, opacity: wireframe ? 0.9 : 0.35, roughness: 0.05, transmission: 0.9, thickness: 0.5, wireframe }),
    waterPool: new THREE.MeshStandardMaterial({ color: "#0284C7", roughness: 0.05, metalness: 0.9 }),
    stonePodium: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.8, wireframe }),
    greenLandscape: new THREE.MeshStandardMaterial({ color: "#15803D", roughness: 0.9, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Circular Landscaped Basin & Reflecting Pool */}
      <mesh position={[0, 0.1, 0]} material={mats.stonePodium} receiveShadow>
        <cylinderGeometry args={[9.5, 10.0, 0.2, 48]} />
      </mesh>
      <mesh position={[0, 0.22, 0]} material={mats.waterPool}>
        <cylinderGeometry args={[8.4, 8.4, 0.05, 48]} />
      </mesh>

      {/* Central Island Boardwalk */}
      <mesh position={[0, 0.3, 0]} material={mats.darkTimber} castShadow receiveShadow>
        <cylinderGeometry args={[4.2, 4.2, 0.12, 32]} />
      </mesh>

      {/* Parametric Reciprocal Timber Shell Structure (Spiraling Glulam Ribs) */}
      <group position={[0, 1.8 * explodeFactor, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const angle = (i * Math.PI) / 6;
          const radius = 5.8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <group key={`rib-${i}`} position={[x, 0, z]} rotation={[0.4, angle, 0]}>
              {/* Primary Glulam Arch Rib */}
              <mesh material={mats.glulamRibs} castShadow>
                <boxGeometry args={[0.22, 5.2 * explodeFactor, 0.4]} />
              </mesh>
              {/* Interlocking Transverse Ties */}
              <mesh position={[0, 1.2 * explodeFactor, 0.4]} rotation={[0, 0, 0.7]} material={mats.glulamRibs} castShadow>
                <boxGeometry args={[0.15, 2.8, 0.25]} />
              </mesh>
            </group>
          );
        })}

        {/* Outer Infill Glazing Pillows */}
        <mesh position={[0, 2.2 * explodeFactor, 0]} material={mats.skylightGlass}>
          <sphereGeometry args={[6.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
        </mesh>

        {/* Central Crown Eye / Oculum Skylight Ring */}
        <mesh position={[0, 4.6 * explodeFactor, 0]} material={mats.glulamRibs} castShadow>
          <torusGeometry args={[2.0, 0.18, 16, 32]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 4. MODEL: KYOTO TIMBER RESIDENCE (Residential Complex)
// Contemporary Sukiya-Zukuri architecture: low-slung pavilions,
// deep Hinoki cypress eaves, Engawa verandas & Shoji screens
// -------------------------------------------------------------
function KyotoTimberResidence({ wireframe, exploded }: { wireframe: boolean; exploded: boolean }) {
  const explodeFactor = exploded ? 1.5 : 1.0;

  const mats = useMemo(() => ({
    slateRoof: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.4, wireframe }),
    hinokiWood: new THREE.MeshStandardMaterial({ color: "#CA8A04", roughness: 0.5, wireframe }),
    darkCedar: new THREE.MeshStandardMaterial({ color: "#78350F", roughness: 0.6, wireframe }),
    shojiScreen: new THREE.MeshPhysicalMaterial({ color: "#FFFBEB", transparent: true, opacity: wireframe ? 0.9 : 0.65, roughness: 0.3, transmission: 0.4, wireframe }),
    zenGravel: new THREE.MeshStandardMaterial({ color: "#94A3B8", roughness: 0.9, wireframe }),
    steppingStone: new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.8, wireframe }),
    engawaDeck: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.4, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Zen Gravel Courtyard & Stepping Stones */}
      <mesh position={[0, 0.1, 0]} material={mats.zenGravel} receiveShadow>
        <boxGeometry args={[18, 0.2, 14]} />
      </mesh>
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <mesh key={`zen-stone-${i}`} position={[x, 0.22, 5.0]} material={mats.steppingStone} receiveShadow>
          <cylinderGeometry args={[0.45, 0.5, 0.08, 16]} />
        </mesh>
      ))}

      {/* Main Living Pavilion (West Wing) */}
      <group position={[-2.8, 0.3 * explodeFactor, 0]}>
        {/* Engawa Perimeter Veranda */}
        <mesh position={[0, 0.15, 0]} material={mats.engawaDeck} castShadow receiveShadow>
          <boxGeometry args={[8.5, 0.2, 7.5]} />
        </mesh>
        {/* Hinoki Cypress Structural Frame & Posts */}
        {[-3.6, -1.8, 0, 1.8, 3.6].map((x) =>
          [-3.2, 3.2].map((z) => (
            <mesh key={`post-${x}-${z}`} position={[x, 1.3, z]} material={mats.hinokiWood} castShadow>
              <boxGeometry args={[0.18, 2.3, 0.18]} />
            </mesh>
          ))
        )}
        {/* Translucent Shoji Sliding Screens */}
        <mesh position={[0, 1.3, 0]} material={mats.shojiScreen}>
          <boxGeometry args={[7.2, 2.2, 6.2]} />
        </mesh>
        {/* Deep Low-Pitched Slate Hipped Roof with Overhanging Eaves */}
        <group position={[0, 2.8 * explodeFactor, 0]}>
          <mesh material={mats.slateRoof} castShadow receiveShadow>
            <coneGeometry args={[6.4, 1.6, 4]} />
          </mesh>
          {/* Exposed Hinoki Eaves Fascia */}
          <mesh position={[0, -0.7, 0]} material={mats.darkCedar}>
            <boxGeometry args={[9.4, 0.12, 8.4]} />
          </mesh>
        </group>
      </group>

      {/* Secondary Tea House & Research Wing (East Wing) */}
      <group position={[4.2, 0.3 * explodeFactor, -1.5]}>
        <mesh position={[0, 0.15, 0]} material={mats.engawaDeck} castShadow receiveShadow>
          <boxGeometry args={[5.5, 0.2, 5.5]} />
        </mesh>
        <mesh position={[0, 1.2, 0]} material={mats.shojiScreen}>
          <boxGeometry args={[4.8, 2.0, 4.8]} />
        </mesh>
        <mesh position={[0, 2.5 * explodeFactor, 0]} material={mats.slateRoof} castShadow receiveShadow>
          <coneGeometry args={[4.4, 1.3, 4]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 5. MODEL: AALTO INSTITUTE OF ADVANCED SCIENCES (Educational Campus)
// Interconnected academic laboratory wings, cantilevered lecture hall & skybridge
// -------------------------------------------------------------
function AaltoScienceCampus({ wireframe, exploded }: { wireframe: boolean; exploded: boolean }) {
  const explodeFactor = exploded ? 1.5 : 1.0;

  const mats = useMemo(() => ({
    whiteLimestone: new THREE.MeshStandardMaterial({ color: "#F1F5F9", roughness: 0.7, wireframe }),
    darkBrick: new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.8, wireframe }),
    lectureCopper: new THREE.MeshStandardMaterial({ color: "#B45309", roughness: 0.45, metalness: 0.4, wireframe }),
    labGlass: new THREE.MeshPhysicalMaterial({ color: "#E0F2FE", transparent: true, opacity: wireframe ? 0.9 : 0.3, roughness: 0.05, transmission: 0.9, thickness: 0.5, wireframe }),
    campusPlaza: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.85, wireframe }),
    skybridgeSteel: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.9, roughness: 0.2, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Campus Plaza Ground */}
      <mesh position={[0, 0.1, 0]} material={mats.campusPlaza} receiveShadow>
        <boxGeometry args={[18, 0.2, 16]} />
      </mesh>

      {/* Main Science Wing A (West) */}
      <group position={[-4.5, 2.2 * explodeFactor, 0]}>
        <mesh material={mats.whiteLimestone} castShadow receiveShadow>
          <boxGeometry args={[5.5, 4.2 * explodeFactor, 10.5]} />
        </mesh>
        {/* Ribbon Laboratory Windows */}
        {[-1.0, 0.8].map((y, i) => (
          <mesh key={`ribbon-w-${i}`} position={[0, y * explodeFactor, 0]} material={mats.labGlass}>
            <boxGeometry args={[5.6, 0.65, 10.6]} />
          </mesh>
        ))}
      </group>

      {/* Interconnecting Elevated Glass Skybridge */}
      <group position={[0, 3.2 * explodeFactor, 0]}>
        <mesh material={mats.skybridgeSteel} castShadow>
          <boxGeometry args={[4.2, 0.25, 2.4]} />
        </mesh>
        <mesh position={[0, 0.8 * explodeFactor, 0]} material={mats.labGlass}>
          <boxGeometry args={[4.0, 1.4 * explodeFactor, 2.2]} />
        </mesh>
      </group>

      {/* Research Wing B & Fan-Shaped Cantilevered Lecture Auditorium */}
      <group position={[4.5, 1.8 * explodeFactor, -1.0]}>
        <mesh material={mats.darkBrick} castShadow receiveShadow>
          <boxGeometry args={[5.0, 3.4 * explodeFactor, 8.5]} />
        </mesh>
      </group>

      {/* Bold Cantilevered Lecture Auditorium (Copper / Bronze Clad) */}
      <group position={[3.8, 3.6 * explodeFactor, 3.2]}>
        <mesh material={mats.lectureCopper} castShadow receiveShadow>
          <boxGeometry args={[5.2, 2.2, 4.8]} />
        </mesh>
        {/* Colonnade Columns Below Auditorium */}
        {[-1.8, 1.8].map((x) => (
          <mesh key={`aud-col-${x}`} position={[x, -2.4 * explodeFactor, 0]} material={mats.skybridgeSteel} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 2.6, 16]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 6. MODEL: MARINA BAY WATERFRONT TRANSIT CONCOURSE (Civic & Infrastructure)
// Sweeping kinetic tensile roof canopy, steel parabolic arches & sunken concourse
// -------------------------------------------------------------
function MarinaTransitConcourse({ wireframe, exploded }: { wireframe: boolean; exploded: boolean }) {
  const explodeFactor = exploded ? 1.5 : 1.0;

  const mats = useMemo(() => ({
    whiteCanopy: new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", transparent: true, opacity: wireframe ? 0.9 : 0.7, roughness: 0.1, transmission: 0.3, thickness: 0.4, wireframe }),
    archSteel: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.95, roughness: 0.15, wireframe }),
    subwayConcourse: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.7, wireframe }),
    waterPool: new THREE.MeshStandardMaterial({ color: "#0284C7", roughness: 0.05, metalness: 0.9 }),
    glazing: new THREE.MeshPhysicalMaterial({ color: "#99EEFF", transparent: true, opacity: wireframe ? 0.9 : 0.35, roughness: 0.04, transmission: 0.92, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Sunken Multimodal Concourse Ground & Water Basins */}
      <mesh position={[0, 0.08, 0]} material={mats.subwayConcourse} receiveShadow>
        <boxGeometry args={[18, 0.16, 15]} />
      </mesh>
      {/* Water Cooling Moat */}
      <mesh position={[0, 0.18, 5.2]} material={mats.waterPool}>
        <boxGeometry args={[14, 0.06, 2.4]} />
      </mesh>

      {/* Grand Parabolic White Steel Arches */}
      {[-4.5, 0, 4.5].map((x) => (
        <group key={`arch-${x}`} position={[x, 2.5 * explodeFactor, 0]}>
          <mesh material={mats.archSteel} castShadow>
            <torusGeometry args={[5.2, 0.18, 16, 48, Math.PI]} />
          </mesh>
        </group>
      ))}

      {/* Sweeping Kinetic Tensile Roof Canopy (Fluid Double-Curved Membrane) */}
      <group position={[0, 4.5 * explodeFactor, 0]}>
        <mesh material={mats.whiteCanopy} castShadow receiveShadow>
          <cylinderGeometry args={[5.4, 7.8, 1.2 * explodeFactor, 32, 1, true, 0, Math.PI]} />
        </mesh>
      </group>

      {/* Subterranean Concourse Entrances & Escalators */}
      <group position={[0, 1.0 * explodeFactor, -1.5]}>
        <mesh material={mats.glazing}>
          <boxGeometry args={[8.5, 1.8, 4.5]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// DYNAMIC MODEL DISPATCHER: Renders unique design based on Project ID / Category!
// -------------------------------------------------------------
function DynamicProjectBuildingModel({
  projectId,
  projectCategory,
  wireframe,
  exploded,
}: {
  projectId?: string;
  projectCategory?: ProjectCategory;
  wireframe: boolean;
  exploded: boolean;
}) {
  // 1. Direct Project ID mapping
  if (projectId === "prj-vertex-tower") {
    return <VertexBiophilicTower wireframe={wireframe} exploded={exploded} />;
  }
  if (projectId === "prj-helix-pavilion") {
    return <HelixParametricPavilion wireframe={wireframe} exploded={exploded} />;
  }
  if (projectId === "prj-kyoto-residence") {
    return <KyotoTimberResidence wireframe={wireframe} exploded={exploded} />;
  }
  if (projectId === "prj-aalto-sciences") {
    return <AaltoScienceCampus wireframe={wireframe} exploded={exploded} />;
  }
  if (projectId === "prj-marina-transit") {
    return <MarinaTransitConcourse wireframe={wireframe} exploded={exploded} />;
  }

  // 2. Category Fallback for custom user created projects
  if (projectCategory === "Commercial High-Rise") {
    return <VertexBiophilicTower wireframe={wireframe} exploded={exploded} />;
  }
  if (projectCategory === "Sustainable Pavilion") {
    return <HelixParametricPavilion wireframe={wireframe} exploded={exploded} />;
  }
  if (projectCategory === "Residential Complex") {
    return <KyotoTimberResidence wireframe={wireframe} exploded={exploded} />;
  }
  if (projectCategory === "Educational Campus") {
    return <AaltoScienceCampus wireframe={wireframe} exploded={exploded} />;
  }
  if (projectCategory === "Civic & Infrastructure") {
    return <MarinaTransitConcourse wireframe={wireframe} exploded={exploded} />;
  }

  // Default: Nordic Cultural Forum
  return <NordicCulturalForum wireframe={wireframe} exploded={exploded} />;
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

        const box = new THREE.Box3().setFromObject(root);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 12 / maxDim : 1;

        root.position.x = -center.x * scale;
        root.position.y = -box.min.y * scale;
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
// Camera Director
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

  useEffect(() => {
    if (!focusPosition || !controlsRef.current) return;
    const [x, y, z] = focusPosition;

    controlsRef.current.target.set(x, y, z);
    camera.position.set(x + 5.5, y + 4.0, z + 5.5);
    camera.lookAt(x, y, z);
    controlsRef.current.update();
  }, [focusPosition, camera, controlsRef]);

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

  useEffect(() => {
    if (resetTrigger === undefined || resetTrigger === 0 || !controlsRef.current) return;
    controlsRef.current.target.set(0, 3.5, 0);
    camera.position.set(14, 11, 14);
    camera.lookAt(0, 3.5, 0);
    controlsRef.current.update();
  }, [resetTrigger, camera, controlsRef]);

  useEffect(() => {
    if (fitToViewTrigger === undefined || fitToViewTrigger === 0 || !controlsRef.current) return;
    controlsRef.current.target.set(0, 3.5, 0);
    camera.position.set(15, 12, 15);
    camera.lookAt(0, 3.5, 0);
    controlsRef.current.update();
  }, [fitToViewTrigger, camera, controlsRef]);

  useEffect(() => {
    if (zoomInTrigger === undefined || zoomInTrigger === 0 || !controlsRef.current) return;
    const dir = new THREE.Vector3().subVectors(controlsRef.current.target, camera.position).normalize();
    camera.position.addScaledVector(dir, 2.5);
    controlsRef.current.update();
  }, [zoomInTrigger, camera, controlsRef]);

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
  projectId,
  projectCategory,
  projectName,
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
        <Environment preset={lightingMode === "dusk" ? "sunset" : "city"} />
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

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.65}
          scale={38}
          blur={2.4}
          far={12}
          resolution={1024}
          color="#000000"
        />

        <CameraDirector
          controlsRef={controlsRef}
          presetView={presetView}
          resetTrigger={resetCameraTrigger}
          fitToViewTrigger={fitToViewTrigger}
          zoomInTrigger={zoomInTrigger}
          zoomOutTrigger={zoomOutTrigger}
          focusPosition={focusPosition}
        />

        <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
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

          {/* Model Display: Custom Uploaded GLB/GLTF or Dynamic Project Architecture Model */}
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
              <DynamicProjectBuildingModel
                projectId={projectId}
                projectCategory={projectCategory}
                wireframe={wireframeMode}
                exploded={explodedView}
              />
            </Center>
          )}

          {isAddingAnnotation && hoverPosition && (
            <mesh position={hoverPosition}>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#EF4444" wireframe />
            </mesh>
          )}

          {annotations.map((ann) => (
            <AnnotationPin
              key={ann.id}
              annotation={ann}
              isSelected={ann.id === activeAnnotationId}
              onClick={() => onSelectAnnotation(ann.id)}
            />
          ))}
        </group>

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
