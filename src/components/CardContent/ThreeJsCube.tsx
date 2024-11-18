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
        camera.up.set(0, 0, 1); // Set up vector to Z-axis for bottom view
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
      camera.up.set(0, 1, 0); // Reset to default up vector
    };
  }, [camera, orientation]);

  // Adjust OrbitControls target based on orientation
  const controlsProps = useMemo(() => {
    switch (orientation) {
      case 'back':
        return {
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          minDistance: 1,
          maxDistance: 10,
          initialRotation: { x: 0, y: Math.PI }
        };
      case 'bottom':
        return {
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          minDistance: 1,
          maxDistance: 10,
          initialRotation: { x: -Math.PI / 2, y: 0 },
          up: [0, 0, 1] // Set OrbitControls up vector to match camera
        };
      case 'right':
        return {
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          minDistance: 1,
          maxDistance: 10,
          initialRotation: { x: 0, y: -Math.PI / 2 }
        };
      case 'left':
        return {
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          minDistance: 1,
          maxDistance: 10,
          initialRotation: { x: 0, y: Math.PI / 2 }
        };
      case 'top':
        return {
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          minDistance: 1,
          maxDistance: 10,
          initialRotation: { x: -Math.PI / 2, y: 0 }
        };
      default:
        return {
          enableDamping: true,
          dampingFactor: 0.05,
          rotateSpeed: 0.5,
          minDistance: 1,
          maxDistance: 10
        };
    }
  }, [orientation]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <CoordinateSystem />
      <MiniCube isRotating={isRotating} />
      <OrbitControls
        ref={controlsRef}
        {...controlsProps}
      />
    </>
  );
}

interface ThreeJsCubeProps {
  title?: string;
  orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';
  style?: React.CSSProperties;
}

const ThreeJsCube: React.FC<ThreeJsCubeProps> = ({ 
  title = "3D Coordinate System",
  orientation = 'front',
  style
}) => {
  const [isRotating, setIsRotating] = useState(true);
  const controlsRef = useRef<any>(null);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      
      // Reset to orientation-specific view
      switch (orientation) {
        case 'back':
          controlsRef.current.object.position.set(2, 2, -2);
          controlsRef.current.up.set(0, 1, 0);
          controlsRef.current.setAzimuthalAngle(Math.PI);
          controlsRef.current.setPolarAngle(Math.PI / 4);
          break;
        case 'bottom':
          controlsRef.current.object.position.set(2, -2, 2);
          controlsRef.current.up.set(0, 0, 1);
          controlsRef.current.setAzimuthalAngle(0);
          controlsRef.current.setPolarAngle(3 * Math.PI / 4);
          break;
        case 'right':
          controlsRef.current.object.position.set(2, 2, 0);
          controlsRef.current.up.set(0, 1, 0);
          controlsRef.current.setAzimuthalAngle(-Math.PI / 2);
          controlsRef.current.setPolarAngle(Math.PI / 4);
          break;
        case 'left':
          controlsRef.current.object.position.set(-2, 2, 0);
          controlsRef.current.up.set(0, 1, 0);
          controlsRef.current.setAzimuthalAngle(Math.PI / 2);
          controlsRef.current.setPolarAngle(Math.PI / 4);
          break;
        case 'top':
          controlsRef.current.object.position.set(2, 2, 2);
          controlsRef.current.up.set(0, 0, 1);
          controlsRef.current.setAzimuthalAngle(0);
          controlsRef.current.setPolarAngle(Math.PI / 4);
          break;
        default: // front
          controlsRef.current.object.position.set(2, 2, 2);
          controlsRef.current.up.set(0, 1, 0);
          controlsRef.current.setAzimuthalAngle(0);
          controlsRef.current.setPolarAngle(Math.PI / 4);
      }
      
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = direction === 'in' ? 0.9 : 1.1;
    if (controlsRef.current) {
      controlsRef.current.dollyTo(
        controlsRef.current.getDistance() * zoomFactor,
        true
      );
    }
  };

  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden" 
      style={{ 
        transformStyle: 'preserve-3d',
        ...style
      }}
    >
      <div className="w-full h-full flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
        <div className="text-white text-center text-xl font-semibold py-2 bg-gray-800/50">
          {title}
        </div>
        
        <div className="flex-1 relative" style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            <Canvas 
              shadows
              camera={{ 
                fov: 50,
                near: 0.1,
                far: 1000,
                position: orientation === 'back' ? [2, 2, -2] : 
                         orientation === 'bottom' ? [2, -2, 2] :
                         orientation === 'right' ? [2, 2, 0] :
                         orientation === 'left' ? [-2, 2, 0] :
                         orientation === 'top' ? [2, 2, 2] :
                         [2, 2, 2]
              }}
              style={{ 
                width: '100%',
                height: '100%',
                display: 'block',
                transformStyle: 'preserve-3d'
              }}
            >
              <color attach="background" args={['#1a1a1a']} />
              <Scene isRotating={isRotating} controlsRef={controlsRef} orientation={orientation} />
            </Canvas>
          </div>

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
