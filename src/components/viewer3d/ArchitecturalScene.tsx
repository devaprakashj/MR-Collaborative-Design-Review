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
  Line,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Annotation, ProjectCategory, BimElementData } from "@/types";

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
  // Unity-Grade Upgrades
  autoRotate?: boolean;
  isSectionCut?: boolean;
  sectionCutHeight?: number; // 10 to 100
  isMeasuring?: boolean;
  onMeasuredDistance?: (distance: number | null) => void;
  onSelectBimElement?: (element: BimElementData) => void;
  selectedElementId?: string | null;
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

  useFrame((_, delta) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 1.5;
    }
  });

  const colorMap = {
    critical: "#EF4444",
    high: "#F59E0B",
    medium: "#00F0FF",
    low: "#10B981",
  };
  const color = colorMap[annotation.priority] || "#00F0FF";

  return (
    <group position={annotation.position}>
      {/* Anchor Point Sphere */}
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.9 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Pulsing Beacon Ring */}
      <mesh ref={beaconRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 24]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={isSelected ? 0.85 : 0.4}
        />
      </mesh>

      {/* Floating CAD Tag */}
      <Html distanceFactor={14} position={[0, 0.55, 0]} center zIndexRange={[100, 0]}>
        <div
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className={`cursor-pointer transition-all duration-200 select-none flex items-center gap-1.5 px-2 py-1 rounded-md border font-mono text-[11px] whitespace-nowrap shadow-xl backdrop-blur-md ${
            isSelected
              ? "bg-cad-900/95 border-cyan text-cyan font-bold scale-110 ring-2 ring-cyan/40"
              : hovered
              ? "bg-cad-900/90 border-cad-600 text-cad-100 scale-105"
              : "bg-cad-950/75 border-cad-800 text-cad-300"
          }`}
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: color }}
          />
          <span className="truncate max-w-[170px]">{annotation.title}</span>
          <span className="text-[9px] uppercase px-1 py-0.2 bg-cad-800/80 rounded border border-cad-700/60 font-semibold opacity-75">
            {annotation.priority.slice(0, 4)}
          </span>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// Interactive 3D Laser Measurement Line Component
// -------------------------------------------------------------
function MeasurementLaserLine({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const distance = useMemo(() => {
    const v1 = new THREE.Vector3(...start);
    const v2 = new THREE.Vector3(...end);
    return v1.distanceTo(v2);
  }, [start, end]);

  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2 + 0.35,
    (start[2] + end[2]) / 2,
  ];

  return (
    <group>
      <Line points={[start, end]} color="#10B981" lineWidth={3.5} />
      {/* End Point Pulsing Markers */}
      <mesh position={start}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshBasicMaterial color="#10B981" />
      </mesh>
      {/* Dynamic 3D Tag */}
      <Html position={midpoint} center distanceFactor={16} zIndexRange={[120, 0]}>
        <div className="bg-emerald-950/95 text-emerald-200 border border-emerald-400 font-mono text-xs px-2.5 py-1 rounded-lg shadow-2xl flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md pointer-events-none select-none font-bold ring-2 ring-emerald-500/20">
          <span className="text-emerald-400">⟷</span>
          <span>{distance.toFixed(2)} m</span>
          <span className="text-[10px] text-emerald-400/80">({Math.round(distance * 1000)} mm)</span>
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// 1. MODEL: NORDIC HORIZON CULTURAL FORUM (Cultural & Museum)
// -------------------------------------------------------------
function NordicCulturalForum({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.5 : 1.0;
  const isCut = sectionHeight < 95;

  const mats = useMemo(() => ({
    slabs: new THREE.MeshStandardMaterial({ color: "#E2E8F0", roughness: 0.85, metalness: 0.05, wireframe }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#E0F2FE", transparent: true, opacity: wireframe ? 0.9 : 0.35, roughness: 0.05, transmission: 0.9, thickness: 0.6, ior: 1.52, wireframe }),
    timber: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.5, metalness: 0.1, wireframe }),
    darkTimber: new THREE.MeshStandardMaterial({ color: "#78350F", roughness: 0.6, metalness: 0.1, wireframe }),
    limestone: new THREE.MeshStandardMaterial({ color: "#CBD5E1", roughness: 0.9, wireframe }),
    galvDuct: new THREE.MeshStandardMaterial({ color: "#94A3B8", metalness: 0.85, roughness: 0.25, wireframe }),
    lawn: new THREE.MeshStandardMaterial({ color: "#15803D", roughness: 0.9, wireframe }),
    balustrade: new THREE.MeshPhysicalMaterial({ color: "#BAE6FD", transparent: true, opacity: 0.45, roughness: 0.05, transmission: 0.9, thickness: 0.2, wireframe }),
    blackSteel: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.9, roughness: 0.2, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Podium & Granite Steps */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0, 0]} material={mats.slabs} receiveShadow>
          <boxGeometry args={[16.5, 0.2, 13.5]} />
        </mesh>
        <mesh position={[0, -0.05, 7.2]} material={mats.limestone} receiveShadow>
          <boxGeometry args={[7.2, 0.1, 1.2]} />
        </mesh>
      </group>

      {/* L1 Level Glass Atrium */}
      <group
        position={[0, 1.45 * explodeFactor, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelectElement?.({
            id: "CW-L1-01",
            name: "L1 Double-Skin Atrium Glazing CW-L1-01",
            ifcType: "IfcCurtainWall",
            material: "Low-E Argon Insulated Glass Unit (12+16+12mm)",
            dimensions: "14.2m × 2.6m × 0.14m",
            fireRating: "REI 60 (60 Mins)",
            thermalTransmittance: "U = 0.82 W/m²K",
            structuralLoad: "2.8 kN/m² Wind Pressure Resistance",
            clashStatus: "clear",
            manufacturer: "Saint-Gobain Glass Solutions",
          });
        }}
      >
        <mesh position={[0, 0, 0]} material={mats.glass}>
          <boxGeometry args={[14.2, 2.6 * explodeFactor, 11.2]} />
        </mesh>
        {/* Entrance Revolving Door */}
        <mesh position={[0, -0.2, 5.65]} material={mats.blackSteel} castShadow>
          <cylinderGeometry args={[1.0, 1.0, 2.2, 24]} />
        </mesh>
      </group>

      {/* L2 Mezzanine Slab */}
      <group position={[0, 2.85 * explodeFactor, 0]}>
        <mesh material={mats.slabs} castShadow receiveShadow>
          <boxGeometry args={[14.8, 0.28, 11.8]} />
        </mesh>
      </group>

      {/* L3 Cantilevered Observation Gallery & Terrace */}
      {(!isCut || sectionHeight > 35) && (
        <group
          position={[0, 4.3 * explodeFactor, 0]}
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelectElement?.({
              id: "TR-L3-04",
              name: "Level 3 Cantilevered Glulam Observation Gallery",
              ifcType: "IfcBeam",
              material: "European Spruce Glued Laminated Timber GL28c",
              dimensions: "4.4m Overhang × 5.2m Width",
              fireRating: "R 90 Fire Resisting Timber",
              structuralLoad: "5.0 kN/m² Live Commercial Terrace Load",
              clashStatus: "clear",
              manufacturer: "Rubner Holzbau Engineering",
            });
          }}
        >
          <mesh position={[2.2, 0, 0]} material={mats.slabs} castShadow receiveShadow>
            <boxGeometry args={[12.6, 0.28, 11.2]} />
          </mesh>
          <mesh position={[-1.2, 1.25, 0]} material={mats.glass}>
            <boxGeometry args={[10.2, 2.3, 9.4]} />
          </mesh>
        </group>
      )}

      {/* L4 Green Roof Lawn & Timber Pergola */}
      {(!isCut || sectionHeight > 70) && (
        <group position={[0, 7.6 * explodeFactor, 0]}>
          <mesh position={[0, 0, 0]} material={mats.slabs} castShadow receiveShadow>
            <boxGeometry args={[13.4, 0.32, 10.4]} />
          </mesh>
          <mesh position={[-1.5, 0.18, 0]} material={mats.lawn} receiveShadow>
            <boxGeometry args={[8.8, 0.06, 9.4]} />
          </mesh>
          <group position={[3.6, 1.4, 0]}>
            {[-1.6, -0.8, 0, 0.8, 1.6].map((x) => (
              <mesh key={`rafter-${x}`} position={[x, 0.1, 0]} material={mats.timber} castShadow>
                <boxGeometry args={[0.08, 0.22, 4.0]} />
              </mesh>
            ))}
          </group>
        </group>
      )}

      {/* Visible MEP Duct Collision at Grid E-4 */}
      <group
        position={[1.8, 3.4 * explodeFactor, -0.6]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelectElement?.({
            id: "MEP-CLASH-E4",
            name: "MEP Atrium Fresh Air Duct & Glulam Cross-Truss Conflict",
            ifcType: "IfcDuctSegment",
            material: "650mm Spiral Galvanized Steel vs Glulam Timber",
            dimensions: "650mm ⌀ Duct intersecting 350×650mm Timber Beam",
            fireRating: "Class 0 Non-Combustible",
            clashStatus: "conflict",
            structuralLoad: "Collision: 300mm Clearance Required",
            manufacturer: "Lindab Ventilation & Atelier Nord",
          });
        }}
      >
        <mesh material={mats.galvDuct} castShadow>
          <boxGeometry args={[4.6, 0.65, 0.8]} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0.32, 0.2, 0.62]} material={mats.timber} castShadow>
          <boxGeometry args={[0.26, 1.9, 0.26]} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.9, 1.1]} />
          <meshBasicMaterial color="#EF4444" wireframe opacity={0.75} transparent />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 2. MODEL: VERTEX BIOPHILIC MIXED-USE TOWER (Commercial High-Rise)
// -------------------------------------------------------------
function VertexBiophilicTower({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.4 : 1.0;
  const maxLevels = Math.max(2, Math.round((sectionHeight / 100) * 16));
  const floorLevels = Array.from({ length: maxLevels }, (_, i) => i);

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
      </group>

      {/* Main Soaring Tower Shaft */}
      {floorLevels.map((lvl) => {
        if (lvl < 2) return null;
        const yPos = (lvl * 0.95 + 1.2) * explodeFactor;
        const width = 8.5 - lvl * 0.18;
        const hasSkyGarden = lvl % 3 === 0;
        const gardenSide = lvl % 6 === 0 ? 1 : -1;

        return (
          <group
            key={`tower-fl-${lvl}`}
            position={[0, yPos, 0]}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelectElement?.({
                id: `CW-TOWER-FL${lvl}`,
                name: `Level ${lvl} Aerodynamic Curtain Wall & Mega-Column Axis`,
                ifcType: "IfcCurtainWall",
                material: "Triple-Glazed Solar Control Low-E + Anodized Titanium",
                dimensions: `${width.toFixed(1)}m × ${width.toFixed(1)}m × 3.6m Floor Height`,
                fireRating: "REI 120 (2 Hours)",
                thermalTransmittance: "U = 0.78 W/m²K",
                structuralLoad: "32.0 MN Axial Column Load",
                clashStatus: "clear",
                manufacturer: "Schüco International Facades",
              });
            }}
          >
            <mesh material={mats.titaniumSpandrel} castShadow>
              <boxGeometry args={[width + 0.3, 0.18, width + 0.3]} />
            </mesh>
            <mesh position={[0, 0.45 * explodeFactor, 0]} material={mats.towerGlass}>
              <boxGeometry args={[width, 0.88 * explodeFactor, width]} />
            </mesh>
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
            {hasSkyGarden && (
              <group position={[(width / 2 + 0.8) * gardenSide, 0.05, 0]}>
                <mesh material={mats.terraceWood} castShadow>
                  <boxGeometry args={[1.8, 0.1, width * 0.6]} />
                </mesh>
                <mesh position={[0, 0.08, 0]} material={mats.skyGardenLawn}>
                  <boxGeometry args={[1.5, 0.06, width * 0.5]} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* Aerodynamic Sky Crown Spire */}
      {sectionHeight >= 90 && (
        <group position={[0, (15 * 0.95 + 2.5) * explodeFactor, 0]}>
          <mesh material={mats.exoSteel} castShadow>
            <cylinderGeometry args={[1.8, 3.2, 2.4 * explodeFactor, 8]} />
          </mesh>
          <mesh position={[0, 1.8 * explodeFactor, 0]} material={mats.crownGlow}>
            <cylinderGeometry args={[0.08, 0.12, 3.5, 12]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 3. MODEL: HELIX PARAMETRIC BOTANICAL PAVILION (Sustainable Pavilion)
// -------------------------------------------------------------
function HelixParametricPavilion({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.5 : 1.0;
  const isCut = sectionHeight < 80;

  const mats = useMemo(() => ({
    glulamRibs: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.45, metalness: 0.1, wireframe }),
    darkTimber: new THREE.MeshStandardMaterial({ color: "#92400E", roughness: 0.6, wireframe }),
    skylightGlass: new THREE.MeshPhysicalMaterial({ color: "#A7F3D0", transparent: true, opacity: wireframe ? 0.9 : 0.35, roughness: 0.05, transmission: 0.9, thickness: 0.5, wireframe }),
    waterPool: new THREE.MeshStandardMaterial({ color: "#0284C7", roughness: 0.05, metalness: 0.9 }),
    stonePodium: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.8, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Reflecting Pool Basin */}
      <mesh position={[0, 0.1, 0]} material={mats.stonePodium} receiveShadow>
        <cylinderGeometry args={[9.5, 10.0, 0.2, 48]} />
      </mesh>
      <mesh position={[0, 0.22, 0]} material={mats.waterPool}>
        <cylinderGeometry args={[8.4, 8.4, 0.05, 48]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={mats.darkTimber} castShadow receiveShadow>
        <cylinderGeometry args={[4.2, 4.2, 0.12, 32]} />
      </mesh>

      {/* Reciprocal Timber Gridshell Ribs */}
      <group position={[0, 1.8 * explodeFactor, 0]}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const angle = (i * Math.PI) / 6;
          const radius = 5.8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;

          return (
            <group
              key={`rib-${i}`}
              position={[x, 0, z]}
              rotation={[0.4, angle, 0]}
              onPointerDown={(e) => {
                e.stopPropagation();
                onSelectElement?.({
                  id: `HELIX-RIB-${i + 1}`,
                  name: `Reciprocal Glulam Arch Rib Node R-${i + 1}`,
                  ifcType: "IfcMember",
                  material: "Double-Curved Glulam Larch Wood (Grade GL32h)",
                  dimensions: "220mm × 400mm × 5200mm",
                  fireRating: "BS EN 1995-1-2 Structural Timber Fire Standard",
                  structuralLoad: "38.5 kN Internal Node Shear Capacity",
                  clashStatus: "clear",
                  manufacturer: "Blumer Lehmann Timber Engineering",
                });
              }}
            >
              <mesh material={mats.glulamRibs} castShadow>
                <boxGeometry args={[0.22, 5.2 * explodeFactor, 0.4]} />
              </mesh>
            </group>
          );
        })}

        {(!isCut || sectionHeight > 60) && (
          <mesh position={[0, 2.2 * explodeFactor, 0]} material={mats.skylightGlass}>
            <sphereGeometry args={[6.2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.48]} />
          </mesh>
        )}

        <mesh position={[0, 4.6 * explodeFactor, 0]} material={mats.glulamRibs} castShadow>
          <torusGeometry args={[2.0, 0.18, 16, 32]} />
        </mesh>
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 4. MODEL: KYOTO TIMBER RESIDENCE (Residential Complex)
// -------------------------------------------------------------
function KyotoTimberResidence({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.5 : 1.0;
  const isCut = sectionHeight < 75;

  const mats = useMemo(() => ({
    slateRoof: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.4, wireframe }),
    hinokiWood: new THREE.MeshStandardMaterial({ color: "#CA8A04", roughness: 0.5, wireframe }),
    darkCedar: new THREE.MeshStandardMaterial({ color: "#78350F", roughness: 0.6, wireframe }),
    shojiScreen: new THREE.MeshPhysicalMaterial({ color: "#FFFBEB", transparent: true, opacity: wireframe ? 0.9 : 0.65, roughness: 0.3, transmission: 0.4, wireframe }),
    zenGravel: new THREE.MeshStandardMaterial({ color: "#94A3B8", roughness: 0.9, wireframe }),
    engawaDeck: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.4, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.08, 0]} material={mats.zenGravel} receiveShadow>
        <boxGeometry args={[18, 0.16, 16]} />
      </mesh>
      {/* Main Pavilion */}
      <group position={[-2.5, 0.4 * explodeFactor, 1.0]}>
        <mesh position={[0, 0.15, 0]} material={mats.engawaDeck} castShadow receiveShadow>
          <boxGeometry args={[9.5, 0.25, 7.5]} />
        </mesh>
        <mesh position={[0, 1.4, 0]} material={mats.shojiScreen}>
          <boxGeometry args={[8.4, 2.2, 6.4]} />
        </mesh>
        {(!isCut || sectionHeight > 50) && (
          <mesh position={[0, 2.9 * explodeFactor, 0]} material={mats.slateRoof} castShadow receiveShadow>
            <coneGeometry args={[6.8, 1.8, 4]} />
          </mesh>
        )}
      </group>
      {/* Tea House Wing */}
      <group position={[4.2, 0.3 * explodeFactor, -1.5]}>
        <mesh position={[0, 0.15, 0]} material={mats.engawaDeck} castShadow receiveShadow>
          <boxGeometry args={[5.5, 0.2, 5.5]} />
        </mesh>
        <mesh position={[0, 1.2, 0]} material={mats.shojiScreen}>
          <boxGeometry args={[4.8, 2.0, 4.8]} />
        </mesh>
        {(!isCut || sectionHeight > 60) && (
          <mesh position={[0, 2.5 * explodeFactor, 0]} material={mats.slateRoof} castShadow receiveShadow>
            <coneGeometry args={[4.4, 1.3, 4]} />
          </mesh>
        )}
      </group>
    </group>
  );
}

// -------------------------------------------------------------
// 5. MODEL: AALTO INSTITUTE OF ADVANCED SCIENCES (Educational Campus)
// -------------------------------------------------------------
function AaltoScienceCampus({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.5 : 1.0;
  const isCut = sectionHeight < 80;

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
      <mesh position={[0, 0.1, 0]} material={mats.campusPlaza} receiveShadow>
        <boxGeometry args={[18, 0.2, 16]} />
      </mesh>
      {/* Science Wing A */}
      <group position={[-4.5, 2.2 * explodeFactor, 0]}>
        <mesh material={mats.whiteLimestone} castShadow receiveShadow>
          <boxGeometry args={[5.5, 4.2 * explodeFactor, 10.5]} />
        </mesh>
      </group>
      {/* Elevated Skybridge */}
      <group position={[0, 3.2 * explodeFactor, 0]}>
        <mesh material={mats.skybridgeSteel} castShadow>
          <boxGeometry args={[4.2, 0.25, 2.4]} />
        </mesh>
        <mesh position={[0, 0.8 * explodeFactor, 0]} material={mats.labGlass}>
          <boxGeometry args={[4.0, 1.4 * explodeFactor, 2.2]} />
        </mesh>
      </group>
      {/* Cantilevered Copper Auditorium */}
      {(!isCut || sectionHeight > 45) && (
        <group position={[3.8, 3.6 * explodeFactor, 3.2]}>
          <mesh material={mats.lectureCopper} castShadow receiveShadow>
            <boxGeometry args={[5.2, 2.2, 4.8]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 6. MODEL: MARINA BAY WATERFRONT TRANSIT CONCOURSE (Civic & Infrastructure)
// -------------------------------------------------------------
function MarinaTransitConcourse({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.5 : 1.0;
  const isCut = sectionHeight < 80;

  const mats = useMemo(() => ({
    whiteCanopy: new THREE.MeshPhysicalMaterial({ color: "#FFFFFF", transparent: true, opacity: wireframe ? 0.9 : 0.7, roughness: 0.1, transmission: 0.3, thickness: 0.4, wireframe }),
    archSteel: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.95, roughness: 0.15, wireframe }),
    subwayConcourse: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.7, wireframe }),
    waterPool: new THREE.MeshStandardMaterial({ color: "#0284C7", roughness: 0.05, metalness: 0.9 }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.08, 0]} material={mats.subwayConcourse} receiveShadow>
        <boxGeometry args={[18, 0.16, 15]} />
      </mesh>
      <mesh position={[0, 0.18, 5.2]} material={mats.waterPool}>
        <boxGeometry args={[14, 0.06, 2.4]} />
      </mesh>
      {[-4.5, 0, 4.5].map((x) => (
        <group key={`arch-${x}`} position={[x, 2.5 * explodeFactor, 0]}>
          <mesh material={mats.archSteel} castShadow>
            <torusGeometry args={[5.2, 0.18, 16, 48, Math.PI]} />
          </mesh>
        </group>
      ))}
      {(!isCut || sectionHeight > 40) && (
        <group position={[0, 4.5 * explodeFactor, 0]}>
          <mesh material={mats.whiteCanopy} castShadow receiveShadow>
            <cylinderGeometry args={[5.4, 7.8, 1.2 * explodeFactor, 32, 1, true, 0, Math.PI]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 7. MODEL: HYPERLOOP REGIONAL KINETIC CONCOURSE (High-Speed Transit Hub)
// -------------------------------------------------------------
function HyperloopKineticHub({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.5 : 1.0;
  const isCut = sectionHeight < 80;

  const mats = useMemo(() => ({
    titaniumShell: new THREE.MeshStandardMaterial({ color: "#E2E8F0", metalness: 0.88, roughness: 0.15, wireframe }),
    vacuumTube: new THREE.MeshStandardMaterial({ color: "#0F172A", metalness: 0.95, roughness: 0.1, wireframe }),
    maglevGlow: new THREE.MeshStandardMaterial({ color: "#00F0FF", emissive: "#00F0FF", emissiveIntensity: 1.2 }),
    concourseGlass: new THREE.MeshPhysicalMaterial({ color: "#E0F2FE", transparent: true, opacity: wireframe ? 0.9 : 0.35, roughness: 0.05, transmission: 0.9, thickness: 0.5, wireframe }),
    platformSlab: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.8, wireframe }),
    waterMirror: new THREE.MeshStandardMaterial({ color: "#0369A1", metalness: 0.95, roughness: 0.04 }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Platform & Reflecting Basin */}
      <mesh position={[0, 0.1, 0]} material={mats.platformSlab} receiveShadow>
        <boxGeometry args={[22, 0.2, 14]} />
      </mesh>
      <mesh position={[0, 0.18, 5]} material={mats.waterMirror}>
        <boxGeometry args={[18, 0.05, 3]} />
      </mesh>

      {/* Twin Hyperloop Vacuum Tubes (Axis A & Axis B) */}
      {[-2.8, 2.8].map((z, idx) => (
        <group
          key={`tube-${idx}`}
          position={[0, 1.6 * explodeFactor, z]}
          onPointerDown={(e) => {
            e.stopPropagation();
            onSelectElement?.({
              id: `HL-TUBE-0${idx + 1}`,
              name: `Hyperloop Vacuum Tube Pressure Vessel Axis 0${idx + 1}`,
              ifcType: "IfcDistributionChamberElement",
              material: "Cryogenic High-Tensile Steel EN 10025-6 (Wall 28mm)",
              dimensions: "3.2m Outer ⌀ × 22m Module × Wall 28mm",
              fireRating: "Class A1 Incombustible",
              structuralLoad: "100 kPa Internal Differential Vacuum Pressure",
              clashStatus: "conflict",
              manufacturer: "Virgin Hyperloop Engineering / Alstom",
            });
          }}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} material={mats.vacuumTube} castShadow>
            <cylinderGeometry args={[0.9, 0.9, 21, 32]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.65, 0]} material={mats.maglevGlow}>
            <boxGeometry args={[0.3, 21, 0.08]} />
          </mesh>
          {[-7, -3.5, 0, 3.5, 7].map((x) => (
            <mesh key={`pylon-${x}`} position={[x, -0.8 * explodeFactor, 0]} material={mats.platformSlab} castShadow>
              <cylinderGeometry args={[0.22, 0.28, 1.4, 16]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Central Glazed Boarding Passenger Concourse */}
      <group position={[0, 1.4 * explodeFactor, 0]}>
        <mesh material={mats.concourseGlass} castShadow>
          <boxGeometry args={[14, 2.2 * explodeFactor, 4.4]} />
        </mesh>
      </group>

      {/* Sweeping Kinetic Titanium Canopy */}
      {(!isCut || sectionHeight > 50) && (
        <group position={[0, 3.8 * explodeFactor, 0]}>
          <mesh material={mats.titaniumShell} castShadow receiveShadow>
            <cylinderGeometry args={[6.8, 10.2, 1.4 * explodeFactor, 32, 1, false, 0, Math.PI]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// -------------------------------------------------------------
// 8. MODEL: TERRA NOVA 28-STORY MASS-TIMBER SKYSCRAPER (Plyscraper)
// -------------------------------------------------------------
function TerraNovaTimberSkyscraper({
  wireframe,
  exploded,
  sectionHeight = 100,
  onSelectElement,
}: {
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  const explodeFactor = exploded ? 1.4 : 1.0;
  const maxLevels = Math.max(2, Math.round((sectionHeight / 100) * 18));
  const floorLevels = Array.from({ length: maxLevels }, (_, i) => i);

  const mats = useMemo(() => ({
    cltTimber: new THREE.MeshStandardMaterial({ color: "#D97706", roughness: 0.5, metalness: 0.05, wireframe }),
    darkGlulam: new THREE.MeshStandardMaterial({ color: "#78350F", roughness: 0.6, wireframe }),
    timberCurtainGlass: new THREE.MeshPhysicalMaterial({ color: "#BAE6FD", transparent: true, opacity: wireframe ? 0.9 : 0.28, roughness: 0.04, transmission: 0.92, thickness: 0.6, wireframe }),
    concretePodium: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.8, wireframe }),
    skyGardenGreen: new THREE.MeshStandardMaterial({ color: "#15803D", roughness: 0.9, wireframe }),
  }), [wireframe]);

  return (
    <group position={[0, 0, 0]}>
      {/* Ground Podium & Plaza */}
      <mesh position={[0, 0.15, 0]} material={mats.concretePodium} receiveShadow>
        <boxGeometry args={[16, 0.3, 16]} />
      </mesh>

      {/* CLT Tower Levels */}
      {floorLevels.map((lvl) => {
        const yPos = (lvl * 0.95 + 0.6) * explodeFactor;
        const width = 8.0 - lvl * 0.12;
        const hasTerrace = lvl % 4 === 0 && lvl > 2;

        return (
          <group
            key={`clt-fl-${lvl}`}
            position={[0, yPos, 0]}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelectElement?.({
                id: `CLT-DIAGRID-L${lvl}`,
                name: `Level ${lvl} Cross-Laminated Timber (CLT) Diagrid Core`,
                ifcType: "IfcMember",
                material: "7-Ply Douglas Fir Cross-Laminated Timber (CLT)",
                dimensions: `${width.toFixed(1)}m × ${width.toFixed(1)}m Floor Plate × 350mm Slab`,
                fireRating: "120-Minute Charring Rate (NBCC Mass Timber Standard)",
                thermalTransmittance: "U = 0.11 W/m²K",
                structuralLoad: "45.0 MN Total Tower Gravitational Load Transfer",
                clashStatus: "clear",
                manufacturer: "StructureCraft Tall Wood Engineering",
              });
            }}
          >
            {/* Mass-Timber Floor Slab */}
            <mesh material={mats.cltTimber} castShadow>
              <boxGeometry args={[width, 0.18, width]} />
            </mesh>

            {/* Facade Glass Curtain */}
            <mesh position={[0, 0.45 * explodeFactor, 0]} material={mats.timberCurtainGlass}>
              <boxGeometry args={[width - 0.2, 0.86 * explodeFactor, width - 0.2]} />
            </mesh>

            {/* Perimeter CLT Diagrid Columns */}
            {[-1, 1].map((sx) =>
              [-1, 1].map((sz) => (
                <mesh
                  key={`diagrid-${lvl}-${sx}-${sz}`}
                  position={[(width / 2 - 0.15) * sx, 0.45 * explodeFactor, (width / 2 - 0.15) * sz]}
                  material={mats.darkGlulam}
                  castShadow
                >
                  <boxGeometry args={[0.3, 0.95 * explodeFactor, 0.3]} />
                </mesh>
              ))
            )}

            {/* Cascading Biophilic Sky Terraces */}
            {hasTerrace && (
              <group position={[width / 2 + 0.6, 0.06, 0]}>
                <mesh material={mats.cltTimber} castShadow>
                  <boxGeometry args={[1.5, 0.1, width * 0.5]} />
                </mesh>
                <mesh position={[0, 0.08, 0]} material={mats.skyGardenGreen}>
                  <boxGeometry args={[1.3, 0.05, width * 0.45]} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}
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
  sectionHeight = 100,
  onSelectElement,
}: {
  projectId?: string;
  projectCategory?: ProjectCategory;
  wireframe: boolean;
  exploded: boolean;
  sectionHeight?: number;
  onSelectElement?: (el: BimElementData) => void;
}) {
  if (projectId === "prj-vertex-tower") {
    return <VertexBiophilicTower wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectId === "prj-helix-pavilion") {
    return <HelixParametricPavilion wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectId === "prj-kyoto-residence") {
    return <KyotoTimberResidence wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectId === "prj-aalto-sciences") {
    return <AaltoScienceCampus wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectId === "prj-marina-transit") {
    return <MarinaTransitConcourse wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectId === "prj-hyperloop-hub") {
    return <HyperloopKineticHub wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectId === "prj-timber-skyscraper") {
    return <TerraNovaTimberSkyscraper wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }

  // Category fallbacks
  if (projectCategory === "Commercial High-Rise") {
    return <VertexBiophilicTower wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectCategory === "Sustainable Pavilion") {
    return <HelixParametricPavilion wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectCategory === "Residential Complex") {
    return <KyotoTimberResidence wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectCategory === "Educational Campus") {
    return <AaltoScienceCampus wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }
  if (projectCategory === "Civic & Infrastructure") {
    return <HyperloopKineticHub wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
  }

  // Default: Nordic Cultural Forum
  return <NordicCulturalForum wireframe={wireframe} exploded={exploded} sectionHeight={sectionHeight} onSelectElement={onSelectElement} />;
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
            boundingBox: [parseFloat(size.x.toFixed(1)), parseFloat(size.y.toFixed(1)), parseFloat(size.z.toFixed(1))],
          });
        }
      },
      undefined,
      (err) => {
        if (!isCancelled && onError) {
          onError((err as any)?.message || "Failed to load 3D GLB/GLTF model");
        }
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (!sceneObj) return;
    sceneObj.traverse((node: any) => {
      if (node.isMesh && node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((m: any) => (m.wireframe = wireframe));
        } else {
          node.material.wireframe = wireframe;
        }
      }
    });
  }, [wireframe, sceneObj]);

  if (!sceneObj) {
    return (
      <Html center>
        <div className="flex items-center gap-2 bg-cad-900 border border-cyan/40 px-3 py-1.5 rounded-lg text-cyan text-xs font-mono shadow-2xl">
          <div className="w-3.5 h-3.5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
          <span>PARSING GLB GEOMETRY...</span>
        </div>
      </Html>
    );
  }

  return <primitive object={sceneObj} />;
}

// -------------------------------------------------------------
// Camera Director with Smooth Animations
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
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    switch (presetView) {
      case "perspective":
        camera.position.set(14, 11, 14);
        controls.target.set(0, 3, 0);
        break;
      case "top":
        camera.position.set(0, 24, 0.001);
        controls.target.set(0, 0, 0);
        break;
      case "front":
        camera.position.set(0, 5, 20);
        controls.target.set(0, 4, 0);
        break;
      case "side":
        camera.position.set(20, 5, 0);
        controls.target.set(0, 4, 0);
        break;
    }
    controls.update();
  }, [presetView, camera, controlsRef]);

  useEffect(() => {
    if (resetTrigger === 0 || !controlsRef.current) return;
    camera.position.set(14, 11, 14);
    controlsRef.current.target.set(0, 3, 0);
    controlsRef.current.update();
  }, [resetTrigger, camera, controlsRef]);

  useEffect(() => {
    if (fitToViewTrigger === 0 || !controlsRef.current) return;
    camera.position.set(15, 10, 15);
    controlsRef.current.target.set(0, 3, 0);
    controlsRef.current.update();
  }, [fitToViewTrigger, camera, controlsRef]);

  useEffect(() => {
    if (zoomInTrigger === 0) return;
    camera.position.multiplyScalar(0.85);
    controlsRef.current?.update();
  }, [zoomInTrigger, camera, controlsRef]);

  useEffect(() => {
    if (zoomOutTrigger === 0) return;
    camera.position.multiplyScalar(1.15);
    controlsRef.current?.update();
  }, [zoomOutTrigger, camera, controlsRef]);

  useEffect(() => {
    if (!focusPosition || !controlsRef.current) return;
    const [tx, ty, tz] = focusPosition;
    controlsRef.current.target.set(tx, ty, tz);
    camera.position.set(tx + 4, ty + 3, tz + 4);
    controlsRef.current.update();
  }, [focusPosition, camera, controlsRef]);

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
  autoRotate = false,
  isSectionCut = false,
  sectionCutHeight = 100,
  isMeasuring = false,
  onMeasuredDistance,
  onSelectBimElement,
}: ArchitecturalSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [hoverPosition, setHoverPosition] = useState<[number, number, number] | null>(null);

  // 3D Laser Measurement points
  const [measurePointA, setMeasurePointA] = useState<[number, number, number] | null>(null);
  const [measurePointB, setMeasurePointB] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    if (!isMeasuring) {
      setMeasurePointA(null);
      setMeasurePointB(null);
      onMeasuredDistance?.(null);
    }
  }, [isMeasuring]);

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
      return;
    }

    if (isMeasuring && e.point) {
      e.stopPropagation();
      const clickedPos: [number, number, number] = [
        parseFloat(e.point.x.toFixed(2)),
        parseFloat(e.point.y.toFixed(2)),
        parseFloat(e.point.z.toFixed(2)),
      ];

      if (!measurePointA || (measurePointA && measurePointB)) {
        setMeasurePointA(clickedPos);
        setMeasurePointB(null);
        onMeasuredDistance?.(null);
      } else {
        setMeasurePointB(clickedPos);
        const v1 = new THREE.Vector3(...measurePointA);
        const v2 = new THREE.Vector3(...clickedPos);
        const dist = v1.distanceTo(v2);
        onMeasuredDistance?.(dist);
      }
      return;
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
        isAddingAnnotation || isMeasuring ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"
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
          opacity={0.7}
          scale={40}
          blur={2.2}
          far={14}
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
              args={[34, 34]}
              cellSize={1.2}
              cellThickness={1}
              cellColor="#1E293B"
              sectionSize={6}
              sectionThickness={1.5}
              sectionColor="#00F0FF"
              fadeDistance={38}
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
                sectionHeight={isSectionCut ? sectionCutHeight : 100}
                onSelectElement={onSelectBimElement}
              />
            </Center>
          )}

          {/* Laser Measurement Line */}
          {measurePointA && measurePointB && (
            <MeasurementLaserLine start={measurePointA} end={measurePointB} />
          )}

          {/* Pending Single Point Measurement Marker */}
          {measurePointA && !measurePointB && (
            <mesh position={measurePointA}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color="#10B981" />
            </mesh>
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
          dampingFactor={0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
          minDistance={2}
          maxDistance={58}
          maxPolarAngle={Math.PI / 2 - 0.02}
        />
      </Canvas>
    </div>
  );
}
