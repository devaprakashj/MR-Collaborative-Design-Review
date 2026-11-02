const fs = require('fs');
const path = require('path');

// Polyfill FileReader and Blob for Node.js environment
if (typeof global.FileReader === 'undefined') {
  global.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      if (Buffer.isBuffer(blob)) {
        this.result = blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength);
      } else if (blob instanceof ArrayBuffer) {
        this.result = blob;
      } else if (blob && blob.arrayBuffer) {
        blob.arrayBuffer().then((buf) => {
          this.result = buf;
          if (this.onloadend) this.onloadend();
          if (this.onload) this.onload();
        });
        return;
      } else {
        this.result = new ArrayBuffer(0);
      }
      setTimeout(() => {
        if (this.onloadend) this.onloadend();
        if (this.onload) this.onload();
      }, 0);
    }
    readAsDataURL(blob) {
      const buf = Buffer.from(blob);
      this.result = 'data:application/octet-stream;base64,' + buf.toString('base64');
      setTimeout(() => {
        if (this.onloadend) this.onloadend();
        if (this.onload) this.onload();
      }, 0);
    }
  };
}

const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

const scene = new THREE.Scene();
scene.name = "Nordic_Horizon_BIM_Assembly";

// Materials
const concreteMat = new THREE.MeshStandardMaterial({ color: 0x182236, roughness: 0.75 });
const slabMat = new THREE.MeshStandardMaterial({ color: 0x273754, roughness: 0.5 });
const glulamMat = new THREE.MeshStandardMaterial({ color: 0xc27a38, roughness: 0.55 });
const steelMat = new THREE.MeshStandardMaterial({ color: 0x1e2738, metalness: 0.85, roughness: 0.25 });
const connectionMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, metalness: 0.9, roughness: 0.2 });
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x99eeff,
  transparent: true,
  opacity: 0.38,
  roughness: 0.08,
  transmission: 0.8,
  thickness: 0.8,
});
const mepMat = new THREE.MeshStandardMaterial({ color: 0xa0b2c6, metalness: 0.85, roughness: 0.25 });
const deckMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.65 });
const plantMat = new THREE.MeshStandardMaterial({ color: 0x115e59, roughness: 0.9 });

// 1. Foundation & Entrance Plinth
const plinth = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.4, 8.5), concreteMat);
plinth.position.y = 0.2;
plinth.name = "Foundation_Plinth";
scene.add(plinth);

// Planters
[-5.2, 5.2].forEach((x) => {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 7.5), concreteMat);
  p.position.set(x, 0.35, 0);
  scene.add(p);
  const veg = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 7.3), plantMat);
  veg.position.set(x, 0.63, 0);
  scene.add(veg);
});

// 2. Concrete Elevator & Shear Core
const core = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.4, 2.0), concreteMat);
core.position.set(-1.8, 3.2, -0.8);
core.name = "Elevator_Shear_Core";
scene.add(core);

// 3. Grid Columns (Glulam Timber)
const columns = [];
[-4.2, -1.4, 1.4, 4.2].forEach((x) => {
  [-2.6, 0, 2.6].forEach((z) => {
    columns.push([x, z]);
  });
});

columns.forEach(([x, z], i) => {
  const col = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16), glulamMat);
  col.position.set(x, 1.4, z);
  col.name = `GlulamColumn_Grid_${i}`;
  scene.add(col);

  const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.3), connectionMat);
  shoe.position.set(x, 0.45, z);
  scene.add(shoe);
});

// 4. Level 1 Glass Facade Enclosure
const glassL1 = new THREE.Mesh(new THREE.BoxGeometry(10.6, 2.1, 7.6), glassMat);
glassL1.position.set(0, 1.45, 0);
glassL1.name = "CurtainWall_GroundAtrium";
scene.add(glassL1);

// Mullions
[-5.3, -3.2, -1.1, 1.1, 3.2, 5.3].forEach((x) => {
  const m1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 0.06), steelMat);
  m1.position.set(x, 1.45, 3.81);
  scene.add(m1);
  const m2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 0.06), steelMat);
  m2.position.set(x, 1.45, -3.81);
  scene.add(m2);
});

// 5. Level 2 Mass-Timber Slab
const slabL2 = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.28, 7.2), slabMat);
slabL2.position.set(0.4, 2.5, 0);
slabL2.name = "TimberSlab_Level2";
scene.add(slabL2);

// 6. Level 3 Cantilevered Observation Terrace
const slabL3 = new THREE.Mesh(new THREE.BoxGeometry(8.0, 0.3, 6.8), slabMat);
slabL3.position.set(-0.8, 4.3, 0);
slabL3.name = "Gallery_Slab_L3";
scene.add(slabL3);

// Cantilever Deck
const deck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.12, 3.8), deckMat);
deck.position.set(3.6, 4.38, 0.6);
deck.name = "Cantilever_Observation_Deck";
scene.add(deck);

// Steel outriggers
[-1.4, 0, 1.4].forEach((z) => {
  const beam = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 0.12), steelMat);
  beam.position.set(3.2, 4.1, z + 0.6);
  scene.add(beam);
});

// Glass Railing
const rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.9, 3.8), glassMat);
rail.position.set(5.35, 4.85, 0.6);
scene.add(rail);

// 7. Roof Primary Timber Girders
[-2.2, 0, 2.2].forEach((z) => {
  const girder = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.4, 0.18), glulamMat);
  girder.position.set(0, 6.0, z);
  scene.add(girder);
});

// Roof Diagrid Ring
const canopy = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.09, 16, 48), steelMat);
canopy.position.set(0, 6.6, 0);
canopy.name = "Photovoltaic_CanopyRing";
scene.add(canopy);

// 8. MEP HVAC Duct Conflict (Clash with Atrium Truss)
const mepDuct = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.55, 0.7), mepMat);
mepDuct.position.set(1.8, 3.4, -0.6);
mepDuct.name = "HVAC_Ventilation_Trunk_Clash";
scene.add(mepDuct);

// Glulam diagonal collision strut
const clashStrut = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.6, 0.22), glulamMat);
clashStrut.position.set(1.8, 3.4, -0.6);
clashStrut.rotation.set(0.3, 0.2, 0.6);
clashStrut.name = "Glulam_Atrium_Strut_Collision";
scene.add(clashStrut);

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (gltf) => {
    const dir = path.join(__dirname, '..', 'public', 'models');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const outputPath = path.join(dir, 'sample-architecture.glb');
    fs.writeFileSync(outputPath, Buffer.from(gltf));
    console.log("Exported Authentic BIM Model:", outputPath, "Size:", fs.statSync(outputPath).size, "bytes");
  },
  (err) => {
    console.error("Export error:", err);
  },
  { binary: true }
);
