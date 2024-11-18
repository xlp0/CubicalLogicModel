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
  frontComponent = "AbstractSpec",
  backComponent = "ThreeJsCube",
  rightComponent = "ConcreteImpl",
  leftComponent = "SpotifyPlayer",
  topComponent = "YouTubePlayer",
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

  const renderFace = (importPath: string, transform: string, componentProps?: Record<string, any>) => (
    <div
      className="absolute inset-0 w-[400px] h-[400px]"
      style={{
        transform: `translate(-50%, -50%) ${transform}`,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
      }}
    >
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          transformStyle: 'preserve-3d'
        }}
      >
        <MCard importPath={importPath} componentProps={componentProps} />
      </div>
    </div>
  );

  return (
    <div 
      className="relative overflow-hidden"
      style={{ 
        height: `${containerHeight}px`,
        perspective: '2000px',
        transformStyle: 'preserve-3d'
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
        className="absolute inset-0"
        style={{
          transform: `rotateX(${rotation.x}deg) 
                     rotateY(${rotation.y}deg)`,
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div 
          className="absolute left-1/2 top-1/2 w-full h-full" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          {renderFace(frontComponent, 'translateZ(200px)')}
          
          {/* Back */}
          {renderFace(backComponent, 'translateZ(-200px) rotateY(180deg)', {
            title: "A 3D View",
            orientation: 'back'
          })}
          
          {/* Right */}
          {renderFace(rightComponent, 'translateX(200px) rotateY(90deg)')}
          
          {/* Left */}
          {renderFace(leftComponent, 'translateX(-200px) rotateY(-90deg)')}
          
          {/* Top */}
          {renderFace(topComponent, 'translateY(-200px) rotateX(90deg)', {
            videoId: "HszHill46_M",
            title: "Featured Video"
          })}
          
          {/* Bottom */}
          {renderFace(bottomComponent, 'translateY(200px) rotateX(-90deg)', {
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