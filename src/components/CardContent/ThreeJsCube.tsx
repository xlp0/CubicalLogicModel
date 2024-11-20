'use client';

import { useState, useRef, useMemo } from 'react';
import type { CSSProperties, RefObject } from 'react';
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

function Scene({ isRotating, controlsRef, orientation }: { isRotating: boolean; controlsRef: RefObject<any>; orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' }) {
  const { camera } = useThree();

  // Set initial camera position based on orientation
  useMemo(() => {
    switch (orientation) {
      case 'front':
        camera.position.set(0, 0, 4);
        break;
      case 'back':
        camera.position.set(0, 0, -4);
        break;
      case 'left':
        camera.position.set(-4, 0, 0);
        break;
      case 'right':
        camera.position.set(4, 0, 0);
        break;
      case 'top':
        camera.position.set(0, 4, 0);
        break;
      case 'bottom':
        camera.position.set(0, -4, 0);
        break;
      default:
        camera.position.set(4, 4, 4);
    }
    camera.lookAt(0, 0, 0);
  }, [camera, orientation]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CoordinateSystem />
      <RotatingCube isRotating={isRotating} />
      <OrbitControls ref={controlsRef} />
    </>
  );
}

interface ThreeJsCubeProps {
  title?: string;
  orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  style?: CSSProperties;
  isRotating?: boolean;
}

export default function ThreeJsCube({ 
  title = "3D Coordinate System",
  orientation = 'front',
  style,
  isRotating = true
}: ThreeJsCubeProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(isRotating);
  const controlsRef = useRef();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-none">
        <ThreeJsControls 
          title={title}
          isRotating={isAutoRotating}
          onRotationToggle={(rotating) => setIsAutoRotating(rotating)}
        />
      </div>
      <div className="flex-1 relative">
        <Canvas
          style={{ background: '#1a1a1a' }}
          camera={{ position: [4, 4, 4], fov: 50 }}
        >
          <Scene 
            isRotating={isAutoRotating} 
            controlsRef={controlsRef}
            orientation={orientation}
          />
        </Canvas>
      </div>
    </div>
  );
}
