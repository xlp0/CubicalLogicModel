import { useEffect, useRef, useState } from "react";
import CubeControls from "./CubeControls";
import HCard from "./HCard";


export default function WebPageCube() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.5);
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
      className="relative h-screen overflow-hidden"
      style={{ perspective: '500px' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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

        {/* 50% Position Marker */}
        <div
          className="absolute w-2 h-2 bg-purple-500"
          style={{
            left: '50%',
            top: '50%',
            zIndex: 2000,
          }}
        />

        {/* 50% Reference Lines */}
        <div className="absolute w-[10px] h-full bg-red-500/50" style={{ left: '50%' }} />
        <div className="absolute w-full h-[10px] bg-purple-500/50" style={{ top: '50%' }} />
        <div className="preserve-3d absolute bg-yellow-500/50" 
          style={{ 
            left: '50%', 
            top: '50%',
            width: '10px',
            height: '100vw',
            transform: 'translate(-50%, -50%) rotateX(-90deg)',
            transformOrigin: 'center center'
          }} 
        />

        {/* 50% Intersection Cube */}
        <div className="preserve-3d" style={{ position: 'absolute', left: '50%', top: '50%' }}>

          {/* Centered Square FRONT*/}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateZ(100px)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <HCard importPath="../CardContent/AbstractSpec" />
            </div>
          </div>

          {/* Centered Square BACK*/}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateZ(-100px) rotateY(180deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
            <HCard importPath="../CardContent/AbstractSpec" />
            </div>
          </div>

          {/* Centered Square RIGHT*/}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateX(100px) rotateY(90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
            <HCard importPath="../CardContent/ConcreteImpl" />
            </div>
          </div>

          {/* Centered Square LEFT*/}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateX(-100px) rotateY(-90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
            <HCard importPath="../CardContent/Counter" />
            </div>
          </div>

          {/* Centered Square TOP*/}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateY(-100px) rotateX(90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <HCard importPath="../CardContent/RealisticExpectations" />
            </div>
          </div>

          {/* Centered Square BOTTOM*/}
          <div
            className="absolute w-[200px] h-[200px] border-2 border-pink-500 bg-pink-200/20 overflow-hidden"
            style={{
              transform: 'translate(-50%, -50%) translateY(100px) rotateX(-90deg)',
            }}
          >
            <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '400px', height: '400px' }}>
              <HCard importPath="../CardContent/Notes" />
            </div>
          </div>
        </div>



        {/* Center Marker */}
        <div
          className="absolute w-20 h-20 rounded-full bg-red-500"
          style={{
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            zIndex: 1000,
          }}
        />
        
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