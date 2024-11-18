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

function Scene({ isRotating, controlsRef, orientation }: { isRotating: boolean; controlsRef: React.RefObject<any>; orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' }) {
  const { camera } = useThree();

  React.useEffect(() => {
    // Set initial camera position based on orientation
    switch (orientation) {
      case 'back':
        camera.position.set(2, 2, -2);
        break;
      case 'bottom':
        camera.position.set(2, -2, 2);
        camera.up.set(0, 0, 1);
        break;
      case 'right':
        camera.position.set(2, 2, 0);
        break;
      case 'left':
        camera.position.set(-2, 2, 0);
        break;
      case 'top':
        camera.position.set(2, 2, 2);
        break;
      default:
        camera.position.set(2, 2, 2);
    }
    camera.lookAt(0, 0, 0);
  }, [camera, orientation]);

  // Reset camera up vector when component unmounts or orientation changes
  React.useEffect(() => {
    return () => {
      camera.up.set(0, 1, 0);
    };
  }, [camera, orientation]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <CoordinateSystem />
      <MiniCube isRotating={isRotating} />
      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={1}
        maxDistance={10}
        enableZoom={true}
        zoomSpeed={0.5}
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

  const handleReset = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;

      // Reset position based on orientation
      switch (orientation) {
        case 'back':
          camera.position.set(2, 2, -2);
          break;
        case 'bottom':
          camera.position.set(2, -2, 2);
          camera.up.set(0, 0, 1);
          break;
        case 'right':
          camera.position.set(2, 2, 0);
          break;
        case 'left':
          camera.position.set(-2, 2, 0);
          break;
        case 'top':
          camera.position.set(2, 2, 2);
          break;
        default:
          camera.position.set(2, 2, 2);
      }

      // Reset target and up vector
      controls.target.set(0, 0, 0);
      if (orientation !== 'bottom') {
        camera.up.set(0, 1, 0);
      }

      // Reset camera direction
      camera.lookAt(0, 0, 0);

      // Reset zoom
      camera.zoom = 1;
      camera.updateProjectionMatrix();

      // Reset controls rotation
      controls.reset();

      // Force updates
      controls.update();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      
      // Get current distance from target
      const distance = controls.getDistance();
      
      // Calculate new distance
      const factor = direction === 'in' ? 0.9 : 1.1;
      const newDistance = distance * factor;
      
      // Update camera position
      const dir = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target).add(dir.multiplyScalar(newDistance));
      
      // Force update
      camera.updateProjectionMatrix();
      controls.update();
    }
  };

  const handleToggleRotation = () => {
    setLocalIsRotating(!localIsRotating);
  };

  return (
    <div
      className="w-full h-full relative"
      style={{
        ...style,
        backgroundColor: '#1a1a1a'
      }}
    >
      <Canvas 
        shadows
        camera={{ 
          fov: 50,
          near: 0.1,
          far: 1000,
          position: [2, 2, 2]
        }}
        style={{ 
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <color attach="background" args={['#1a1a1a']} />
        <Scene isRotating={localIsRotating} controlsRef={controlsRef} orientation={orientation} />
      </Canvas>
      
      {title && (
        <div className="absolute bottom-2 left-2 text-white text-sm opacity-50 z-10">
          {title}
        </div>
      )}

      <ThreeJsControls
        isRotating={localIsRotating}
        onToggleRotation={handleToggleRotation}
        onResetView={handleReset}
        onZoom={handleZoom}
      />
    </div>
  );
}
