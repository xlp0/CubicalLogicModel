'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeJsControls from './ThreeJsControls';

interface CubeProps {
  isRotating: boolean;
}

function CoordinateSystem() {
  return (
    <group>
      <axesHelper args={[2]} />
      <gridHelper args={[4, 4, '#666666', '#444444']} />
    </group>
  );
}

function RotatingCube({ isRotating }: CubeProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.x += delta * 0.5;
      groupRef.current.rotation.y += delta * 0.7;
    }
  });

  const materials = [
    new THREE.MeshStandardMaterial({ color: '#FF6B6B', metalness: 0.5, roughness: 0.2 }), // Right - Red
    new THREE.MeshStandardMaterial({ color: '#4ECDC4', metalness: 0.5, roughness: 0.2 }), // Left - Cyan
    new THREE.MeshStandardMaterial({ color: '#45B7D1', metalness: 0.5, roughness: 0.2 }), // Top - Blue
    new THREE.MeshStandardMaterial({ color: '#96CEB4', metalness: 0.5, roughness: 0.2 }), // Bottom - Green
    new THREE.MeshStandardMaterial({ color: '#FFBE0B', metalness: 0.5, roughness: 0.2 }), // Front - Yellow
    new THREE.MeshStandardMaterial({ color: '#FF006E', metalness: 0.5, roughness: 0.2 })  // Back - Pink
  ];

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        {materials.map((material, index) => (
          <primitive object={material} attach={`material-${index}`} key={index} />
        ))}
      </mesh>
    </group>
  );
}

function Scene({ isRotating, controlsRef, orientation }: { isRotating: boolean; controlsRef: React.RefObject<any>; orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' }) {
  const { camera } = useThree();

  React.useEffect(() => {
    const distance = 4;
    
    // Always use front view position for consistency
    camera.position.set(0, 0, distance);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.update();
    }
  }, [camera, orientation]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <CoordinateSystem />
      <RotatingCube isRotating={isRotating} />
      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={2}
        maxDistance={10}
        enableZoom={true}
        zoomSpeed={0.5}
        enablePan={false}
      />
    </>
  );
}

interface ThreeJsCubeProps {
  title?: string;
  orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  style?: React.CSSProperties;
  isRotating?: boolean;
}

export default function ThreeJsCube({ 
  title = "3D Coordinate System",
  orientation = 'front',
  style,
  isRotating = true
}: ThreeJsCubeProps) {
  const [localIsRotating, setLocalIsRotating] = useState(isRotating);
  const controlsRef = useRef(null);

  React.useEffect(() => {
    setLocalIsRotating(isRotating);
  }, [isRotating]);

  return (
    <div className="w-full h-full" style={style}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene
          isRotating={localIsRotating}
          controlsRef={controlsRef}
          orientation={orientation}
        />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ThreeJsControls
          isRotating={localIsRotating}
          onToggleRotation={() => setLocalIsRotating(!localIsRotating)}
          onReset={() => {
            if (controlsRef.current) {
              controlsRef.current.reset();
            }
          }}
        />
      </div>
    </div>
  );
}
