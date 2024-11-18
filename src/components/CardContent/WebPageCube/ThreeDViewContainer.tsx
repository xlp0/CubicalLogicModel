import React from 'react';

interface ThreeDViewContainerProps {
  orientation?: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
  children: React.ReactNode;
}

export default function ThreeDViewContainer({ 
  orientation = 'front',
  children 
}: ThreeDViewContainerProps) {
  // Calculate inverse transform to counter parent cube rotation
  const getInverseTransform = (orientation: string): string => {
    switch (orientation) {
      case 'front': return '';
      case 'back': return 'rotateY(180deg)';
      case 'right': return 'rotateY(-90deg)';
      case 'left': return 'rotateY(90deg)';
      case 'top': return 'rotateX(-90deg)';
      case 'bottom': return 'rotateX(90deg)';
      default: return '';
    }
  };

  return (
    <div 
      className="w-full h-full"
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: getInverseTransform(orientation)
      }}
    >
      {children}
    </div>
  );
}
