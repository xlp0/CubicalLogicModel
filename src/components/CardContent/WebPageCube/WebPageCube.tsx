import { useEffect, useRef, useState, useCallback } from "react";
import CubeControls from "./CubeControls";
import MCard from "../../MCard";
import ThreeJsCube from "../ThreeJsCube";
import CubeFace from "./CubeFace";

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
  backComponent = "ConcreteImpl",
  rightComponent = "ThreeJsCube",
  leftComponent = "Notes",
  topComponent = "Calculator",
  bottomComponent = "ThreeJsCube"
}: WebPageCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isRotating, setIsRotating] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [key, setKey] = useState(0);

  // Ref to store animation frame ID
  const animationFrameRef = useRef<number>();
  // Ref to store last animation timestamp
  const lastTimeRef = useRef<number>(performance.now());
  // Ref to track component mounted state
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const animate = useCallback((currentTime: number) => {
    if (!isMountedRef.current) return;

    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    if (isRotating && !isDragging) {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 45 * deltaTime // 45 degrees per second
      }));
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isRotating, isDragging]);

  useEffect(() => {
    if (isRotating && !isDragging) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isRotating, isDragging, animate]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;

    setRotation(prev => ({
      x: prev.x + deltaY * 0.5,
      y: prev.y + deltaX * 0.5
    }));

    setLastMousePos({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastMousePos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    // Cancel any ongoing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    // Reset all state
    setRotation({ x: 0, y: 0 });
    setScale(1);
    setIsRotating(true);
    setIsDragging(false);
    setLastMousePos({ x: 0, y: 0 });
    
    // Force ThreeJsCube components to reset
    setKey(prev => prev + 1);

    // Apply smooth transition
    if (containerRef.current) {
      containerRef.current.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => {
        if (containerRef.current && isMountedRef.current) {
          containerRef.current.style.transition = 'transform 0.2s ease-out';
        }
      }, 500);
    }

    // Restart animation after reset if needed
    lastTimeRef.current = performance.now();
    if (isRotating) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [animate, isRotating]);

  const handleToggleRotation = useCallback(() => {
    setIsRotating(prev => {
      if (!prev) {
        // If starting rotation, reset the last time to now
        lastTimeRef.current = performance.now();
      }
      return !prev;
    });
  }, []);

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.1 : prev * 0.9;
      return Math.max(0.5, Math.min(2, newScale));
    });
  }, []);

  const FACE_SIZE = 400; // Base size for cube faces
  const TRANSLATE_DISTANCE = FACE_SIZE / 2; // Half the face size for proper cube formation

  const renderFace = (
    componentName: string, 
    transform: string, 
    props: { title?: string; orientation?: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' }
  ) => {
    return (
      <div 
        key={`${props.orientation}-${key}`}
        className="absolute w-full h-full bg-gray-800/90 rounded-xl overflow-hidden"
        style={{
          transform: `${transform}`,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          backfaceVisibility: 'hidden',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        <MCard 
          key={`mcard-${props.orientation}-${key}`}
          importPath={componentName}
          componentProps={{
            title: props.title,
            orientation: props.orientation,
            style: {
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }
          }}
        />
      </div>
    );
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center bg-gray-900/50"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '2400px',
        perspectiveOrigin: '50% 50%'
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
        className="relative"
        style={{
          width: `${FACE_SIZE}px`,
          height: `${FACE_SIZE}px`,
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
        onToggleRotation={handleToggleRotation}
        onZoom={handleZoom}
        onResetRotation={handleReset}
      />
    </div>
  );
}