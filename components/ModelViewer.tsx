"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function BinModel() {
  // Load the GLB model from the public directory
  const { scene } = useGLTF("/bin.glb");
  return <primitive object={scene} />;
}

export default function ModelViewer() {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <BinModel />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}

// Required for GLTF loader
// @ts-expect-error ignore: drei types may not include preload signature
useGLTF.preload("/bin.glb");
