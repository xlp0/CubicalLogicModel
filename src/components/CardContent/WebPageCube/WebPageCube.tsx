'use client';

import { useEffect, useRef, useState } from "react";
import CubeControls from "./CubeControls";
import MCard from "../../MCard";
import * as THREE from 'three';

interface WebPageCubeProps {
  title?: string;
  frontComponent?: string;
  backComponent?: string;
  rightComponent?: string;
  leftComponent?: string;
  topComponent?: string;
  bottomComponent?: string;
}

export default function WebPageCube({
  title = "3D Web Cube",
  frontComponent = "ThreeJsCube",
  backComponent = "ThreeJsCube",
  rightComponent = "ThreeJsCube",
  leftComponent = "ThreeJsCube",
  topComponent = "ThreeJsCube",
  bottomComponent = "ThreeJsCube"
}: WebPageCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.5);
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [containerHeight, setContainerHeight] = useState(0);

  // Fixed rotation speed for smooth animation
  const ROTATION_SPEED = 0.5;
  const CONTROL_PANEL_HEIGHT = 120; // Estimated height of the control panel

  useEffect(() => {
    // Initialize height after component mounts
    setContainerHeight(window.innerHeight - CONTROL_PANEL_HEIGHT);

    const handleResize = () => {
      setContainerHeight(window.innerHeight - CONTROL_PANEL_HEIGHT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isRotating && !isDragging) {
        setRotation(prev => ({
          x: prev.x + ROTATION_SPEED * deltaTime * 60,
          y: prev.y + ROTATION_SPEED * deltaTime * 60
        }));
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    setIsRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = 0.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev + (direction === 'in' ? zoomFactor : -zoomFactor))));
  };

  if (containerHeight === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const FACE_SIZE = Math.min(containerHeight - 100, 600); // Responsive face size
  const TRANSLATE_DISTANCE = FACE_SIZE / 2; // Half of face size for proper spacing

  const renderFace = (importPath: string, transform: string, componentProps?: Record<string, any>) => {
    const transformValue = transform.replace(/200px/g, `${TRANSLATE_DISTANCE}px`);
    
    return (
      <div
        className="absolute bg-gray-800/90 rounded-xl overflow-hidden"
        style={{
          width: `${FACE_SIZE}px`,
          height: `${FACE_SIZE}px`,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) ${transformValue}`,
          transformStyle: 'preserve-3d'
        }}
      >
        <MCard 
          importPath={importPath} 
          componentProps={{
            ...componentProps,
            orientation: componentProps?.orientation || 'front',
            style: {
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgb(31 41 55 / 0.9)' // bg-gray-800/90
            }
          }} 
        />
      </div>
    );
  };

  return (
    <div 
      className="relative w-full bg-gray-900 overflow-hidden"
      style={{ 
        height: `${containerHeight}px`,
        perspective: `${FACE_SIZE * 4}px`
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 w-full text-center z-10">
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-gray-900/50"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale})`
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.2s ease-out'
          }}
        >
          {/* Front */}
          {renderFace(frontComponent, `translateZ(${TRANSLATE_DISTANCE}px)`, {
            title: "Front View",
            orientation: 'front'
          })}
          
          {/* Back */}
          {renderFace(backComponent, `translateZ(-${TRANSLATE_DISTANCE}px) rotateY(180deg)`, {
            title: "Back View",
            orientation: 'back'
          })}
          
          {/* Right */}
          {renderFace(rightComponent, `translateX(${TRANSLATE_DISTANCE}px) rotateY(90deg)`, {
            title: "Right View",
            orientation: 'right'
          })}
          
          {/* Left */}
          {renderFace(leftComponent, `translateX(-${TRANSLATE_DISTANCE}px) rotateY(-90deg)`, {
            title: "Left View",
            orientation: 'left'
          })}
          
          {/* Top */}
          {renderFace(topComponent, `translateY(-${TRANSLATE_DISTANCE}px) rotateX(90deg)`, {
            title: "Top View",
            orientation: 'top'
          })}
          
          {/* Bottom */}
          {renderFace(bottomComponent, `translateY(${TRANSLATE_DISTANCE}px) rotateX(-90deg)`, {
            title: "Bottom View",
            orientation: 'bottom'
          })}
        </div>
      </div>
      <CubeControls
        isRotating={isRotating}
        onToggleRotation={() => setIsRotating(!isRotating)}
        onResetView={resetRotation}
        onZoom={handleZoom}
      />
    </div>
  );
}