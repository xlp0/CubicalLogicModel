import React from 'react';

interface CubeFaceProps {
  position: [number, number, number] | 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
  rotation?: [number, number, number];
  children: React.ReactNode;
}

export default function CubeFace({ position, rotation = [0, 0, 0], children }: CubeFaceProps) {
  const getPosition = (): [number, number, number] => {
    if (Array.isArray(position)) return position;
    
    switch (position) {
      case 'front': return [0, 0, 200];
      case 'back': return [0, 0, -200];
      case 'right': return [200, 0, 0];
      case 'left': return [-200, 0, 0];
      case 'top': return [0, -200, 0];
      case 'bottom': return [0, 200, 0];
      default: return [0, 0, 0];
    }
  };

  const getRotation = (): [number, number, number] => {
    if (Array.isArray(position)) return rotation;
    
    switch (position) {
      case 'front': return [0, 0, 0];
      case 'back': return [0, 180, 0];
      case 'right': return [0, 90, 0];
      case 'left': return [0, -90, 0];
      case 'top': return [90, 0, 0];
      case 'bottom': return [-90, 0, 0];
      default: return rotation;
    }
  };

  const pos = getPosition();
  const rot = getRotation();

  return (
    <div
      className="absolute w-[400px] h-[400px] bg-white shadow-2xl"
      style={{
        transform: `translate3d(${pos[0] - 200}px, ${pos[1] - 200}px, ${pos[2] - 200}px) 
                   rotateX(${rot[0]}deg) rotateY(${rot[1]}deg) rotateZ(${rot[2]}deg)
                   `,
      }}
    >
      {children}
    </div>
  );
}