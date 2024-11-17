'use client';

import React, { useState, useRef } from 'react';
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

function MiniCube({ isRotating }: CubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.7;
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
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      {materials.map((material, index) => (
        <primitive object={material} attach={`material-${index}`} key={index} />
      ))}
    </mesh>
  );
}

function Scene({ isRotating, controlsRef }: { isRotating: boolean; controlsRef: React.RefObject<any> }) {
  const { camera } = useThree();
  const initialCameraPosition = new THREE.Vector3(2, 2, 2);

  // Reset camera position on mount
  React.useEffect(() => {
    camera.position.copy(initialCameraPosition);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} />
      
      {/* Scene Content */}
      <CoordinateSystem />
      <MiniCube isRotating={isRotating} />

      {/* Controls */}
      <OrbitControls 
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={10}
      />
    </>
  );
}

interface ThreeJsCubeProps {
  title?: string;
}

const ThreeJsCube: React.FC<ThreeJsCubeProps> = ({ 
  title = "3D Coordinate System"
}) => {
  const [isRotating, setIsRotating] = useState(true);
  const controlsRef = useRef<any>(null);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.setAzimuthalAngle(0);
      controlsRef.current.setPolarAngle(Math.PI / 4);
      controlsRef.current.object.position.set(2, 2, 2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (controlsRef.current) {
      const zoomSpeed = 0.5;
      const camera = controlsRef.current.object;
      const distance = camera.position.distanceTo(controlsRef.current.target);
      const factor = direction === 'in' ? (1 - zoomSpeed) : (1 + zoomSpeed);
      const newDistance = Math.min(Math.max(distance * factor, 1), 10);
      
      // Scale the camera position to maintain direction but change distance
      const dir = camera.position.clone().sub(controlsRef.current.target).normalize();
      camera.position.copy(dir.multiplyScalar(newDistance).add(controlsRef.current.target));
      controlsRef.current.update();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-900">
      <div className="text-center py-2">
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="flex-grow relative">
        <Canvas 
          shadows
          camera={{ 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          className="w-full h-full"
        >
          <Scene isRotating={isRotating} controlsRef={controlsRef} />
        </Canvas>

        <ThreeJsControls 
          isRotating={isRotating}
          onToggleRotation={() => setIsRotating(!isRotating)}
          onResetView={handleResetView}
          onZoom={handleZoom}
        />
      </div>
    </div>
  );
};

export default ThreeJsCube;
