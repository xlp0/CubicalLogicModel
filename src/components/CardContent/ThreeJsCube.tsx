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

  React.useEffect(() => {
    camera.position.set(2, 2, 2);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CoordinateSystem />
      <MiniCube isRotating={isRotating} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={1}
        maxDistance={10}
      />
    </>
  );
}

interface ThreeJsCubeProps {
  title?: string;
  orientation?: 'back' | 'bottom';
}

const ThreeJsCube: React.FC<ThreeJsCubeProps> = ({ 
  title = "3D Coordinate System",
  orientation
}) => {
  const [isRotating, setIsRotating] = useState(true);
  const controlsRef = useRef<any>(null);

  // Adjust camera position based on orientation
  const initialCameraPosition = useMemo(() => {
    switch (orientation) {
      case 'back':
        return [2, 2, -2];
      case 'bottom':
        return [2, -2, 2];
      default:
        return [2, 2, 2];
    }
  }, [orientation]);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.setAzimuthalAngle(orientation === 'back' ? Math.PI : 0);
      controlsRef.current.setPolarAngle(orientation === 'bottom' ? Math.PI * 3/4 : Math.PI / 4);
      controlsRef.current.object.position.set(...initialCameraPosition);
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
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="flex-1 flex flex-col bg-gray-700/50 rounded-xl">
        <div className="text-white text-center text-xl font-semibold py-2 bg-gray-800/50">
          {title}
        </div>
        
        <div className="relative flex-1">
          <Canvas 
            shadows
            camera={{ 
              fov: 50,
              near: 0.1,
              far: 1000,
              position: [2, 2, 2]
            }}
            style={{ position: 'absolute', inset: 0 }}
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
    </div>
  );
};

export default ThreeJsCube;
