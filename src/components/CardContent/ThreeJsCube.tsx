"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ThreeJsControls from './ThreeJsControls';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

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
  const [canvasHeight, setCanvasHeight] = useState(0);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    setCanvasHeight(window.innerHeight - 200); // Adjust for header and controls
    
    const handleResize = () => {
      setCanvasHeight(window.innerHeight - 200);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (controlsRef.current) {
      const delta = direction === 'in' ? -1 : 1;
      controlsRef.current.dollyTo(
        controlsRef.current.getDistance() * (1 + delta * 0.1),
        true
      );
    }
  };

  if (canvasHeight === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading 3D Scene...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-screen bg-gray-900">
      <div className="absolute top-4 w-full text-center z-10">
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      
      <div 
        className="flex-grow flex items-center justify-center w-full relative"
        style={{ height: `${canvasHeight}px` }}
      >
        <Canvas 
          shadows
          camera={{ 
            position: [2, 2, 2],
            fov: 50,
            near: 0.1,
            far: 1000
          }}
          className="w-full max-w-[800px] h-full"
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
            ref={controlsRef}
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
      
      <ThreeJsControls
        isRotating={isRotating}
        onToggleRotation={() => setIsRotating(!isRotating)}
        onResetView={handleResetView}
        onZoom={handleZoom}
      />
    </div>
  );
};

export default ThreeJsCube;
