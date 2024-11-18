import { useEffect, useRef, useState } from "react";
import CubeControls from "./CubeControls";
import MCard from "../../MCard";
import ThreeJsCube from "../ThreeJsCube";

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
  const [scale, setScale] = useState(1);
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isRotating && !isDragging) {
        setRotation(prev => ({
          x: prev.x + 0.5 * deltaTime * 60,
          y: prev.y + 0.5 * deltaTime * 60
        }));
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, isDragging]);

  const handleReset = () => {
    setRotation({ x: 0, y: 0 });
    setScale(1);
    setIsRotating(true);
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.5s ease-out';
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.transition = isDragging ? 'none' : 'transform 0.2s ease-out';
        }
      }, 500);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.1 : prev * 0.9;
      // Limit scale between 0.5 and 2
      return Math.max(0.5, Math.min(2, newScale));
    });
  };

  const renderFace = (
    componentName: string, 
    transform: string, 
    props: { title?: string; orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' }
  ) => {
    return (
      <div 
        key={props.orientation}
        className="absolute w-[400px] h-[400px] bg-gray-800/90 rounded-xl overflow-hidden"
        style={{
          transform,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out'
        }}
      >
        <ThreeJsCube 
          title={props.title} 
          orientation={props.orientation}
          isRotating={isRotating}
        />
      </div>
    );
  };

  const TRANSLATE_DISTANCE = 200;
  const initialRotation = { x: 0, y: 0 };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center bg-gray-900/50"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1200px'
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
        className="relative w-[400px] h-[400px]"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
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
      
      <CubeControls
        isRotating={isRotating}
        onToggleRotation={() => setIsRotating(!isRotating)}
        onResetView={handleReset}
        onZoom={handleZoom}
      />
    </div>
  );
}