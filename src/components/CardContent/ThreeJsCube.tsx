"use client";

import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import * as THREE from 'three';

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

interface ThreeJsCubeProps {
  title?: string;
}

const ThreeJsCube: React.FC<ThreeJsCubeProps> = ({ 
  title = "3D Coordinate System"
}) => {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="w-full h-full bg-gray-700 rounded-lg p-4 flex flex-col">
        <div className="text-white text-center text-lg font-semibold mb-3">
          {title}
        </div>
        <div className="flex-grow relative w-full bg-black rounded-lg overflow-hidden mb-4">
          <Canvas 
            shadows
            style={{ width: '100%', height: '100%' }}
            camera={{ 
              position: [2, 2, 2],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
          >
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
              enableZoom={true}
              minDistance={1}
              maxDistance={10}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI * 5 / 6}
              target={[0, 0, 0]}
              enableDamping
              dampingFactor={0.05}
            />
          </Canvas>
        </div>
        <div className="flex justify-center">
          <Button
            onClick={() => setIsRotating(!isRotating)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-colors px-6 py-2"
          >
            {isRotating ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThreeJsCube;
