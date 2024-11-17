"use client";

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
  frontComponent = "../CardContent/AbstractSpec",
  backComponent = "../CardContent/ThreeJsCube",
  rightComponent = "../CardContent/ConcreteImpl",
  leftComponent = "../CardContent/SpotifyPlayer",
  topComponent = "../CardContent/YouTubePlayer",
  bottomComponent = "../CardContent/ThreeJsCube"
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

  return (
    <div 
      className="relative overflow-hidden"
      style={{ 
        height: `${containerHeight}px`,
        perspective: '500px'
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
        className="absolute inset-0 preserve-3d"
        style={{
          transform: `scale(${scale}) 
                     rotateX(${rotation.x}deg) 
                     rotateY(${rotation.y}deg)`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div className="preserve-3d" style={{ position: 'absolute', left: '50%', top: '50%' }}>
          {/* Front */}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateZ(100px)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <MCard importPath={frontComponent} />
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateZ(-100px) rotateY(180deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <MCard 
                importPath={backComponent}
                componentProps={{
                  title: "A 3D View"
                }}
              />
            </div>
          </div>

          {/* Right */}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateX(100px) rotateY(90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <MCard importPath={rightComponent} />
            </div>
          </div>

          {/* Left */}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateX(-100px) rotateY(-90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <MCard importPath={leftComponent} />
            </div>
          </div>

          {/* Top */}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateY(-100px) rotateX(90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <MCard 
                importPath={topComponent}
                componentProps={{
                  videoId: "HszHill46_M",
                  title: "Featured Video"
                }}
              />
            </div>
          </div>

          {/* Bottom */}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateY(100px) rotateX(-90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <MCard 
                importPath={bottomComponent}
                componentProps={{
                  title: "Bottom View"
                }}
              />
            </div>
          </div>
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