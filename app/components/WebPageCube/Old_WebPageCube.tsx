"use client";

import { useEffect, useRef, useState } from "react";
import CubeFace from "./CubeFace";
import CubeControls from "./CubeControls";
import Clock from "./LocalContent/Clock";
import Calculator from "./LocalContent/Calculator";
import AbstractSpec from "./LocalContent/AbstractSpec";
import ColorPicker from "./LocalContent/ColorPicker";
import RealisticExpectations from "./LocalContent/RealisticExpectations";
import Notes from "./LocalContent/Notes";
import ConcreteImpl from "./LocalContent/ConcreteImpl";

export default function WebPageCube() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.2);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (isRotating && !isDragging) {
        setRotation(prev => ({
          x: prev.x + rotationSpeed * 50,
          y: prev.y + rotationSpeed * 50
        }));
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, rotationSpeed, isDragging]);

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

  const handleSpeedChange = (value: number[]) => {
    setRotationSpeed(value[0] / 1000);
  };

  const resetRotation = () => {
    setRotationSpeed(0.001);
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    const moveAmount = 50;
    setPosition(prev => ({
      x: prev.x + (direction === 'left' ? -moveAmount : direction === 'right' ? moveAmount : 0),
      y: prev.y + (direction === 'up' ? -moveAmount : direction === 'down' ? moveAmount : 0)
    }));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = 0.1;
    setScale(prev => Math.max(0.5, Math.min(2, prev + (direction === 'in' ? zoomFactor : -zoomFactor))));
  };

  return (
    <div 
      className="relative h-screen overflow-hidden perspective-1000"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 preserve-3d"
        style={{
          // transform: `translate(${position.x}px, ${position.y}px) 
          transform: //`translate(${position.x}px, ${position.y}px) 
                     `scale(${scale}) 
                     rotateX(${rotation.x}deg) 
                     rotateY(${rotation.y}deg)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Front */}
        <CubeFace position={[0, 0, 200]} rotation={[0, 0, 0]}>
          <AbstractSpec />
        </CubeFace>
        {/* Back */}
        <CubeFace position={[0, 0, -200]} rotation={[0, 180, 0]}>
          <AbstractSpec />
        </CubeFace>
        {/* Right */}
        <CubeFace position={[200, 0, 0]} rotation={[0, 90, 0]}>
          <RealisticExpectations />
        </CubeFace>
        {/* Left */}
        <CubeFace position={[-200, 0, 0]} rotation={[0, -90, 0]}>
          <ConcreteImpl />
        </CubeFace>
        {/* Top */}
        <CubeFace position={[0, -200, 0]} rotation={[90, 0, 0]}>
          <Clock />
        </CubeFace>
        {/* Bottom */}
        <CubeFace position={[0, 200, 0]} rotation={[-90, 0, 0]}>
          <ConcreteImpl />
        </CubeFace>
      </div>

      <CubeControls
        isRotating={isRotating}
        onToggleRotation={() => setIsRotating(!isRotating)}
        onResetRotation={resetRotation}
        onSpeedChange={handleSpeedChange}
        onMove={handleMove}
        onZoom={handleZoom}
      />
    </div>
  );
}