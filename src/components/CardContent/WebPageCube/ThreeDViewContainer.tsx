'use client';

import { type ReactNode } from 'react';

interface ThreeDViewContainerProps {
  orientation?: 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';
  children: ReactNode;
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
      case 'right': return 'rotateY(-90deg) rotateY(90deg) ';
      case 'left': return 'rotateY(90deg)';
      case 'top': return 'rotateX(-90deg)';
      case 'bottom': return 'rotateZ(0deg) ';
      default: return '';
    }
  };

  // Calculate additional transform for ThreeJsCube alignment
  const getAlignmentTransform = (orientation: string): string => {
    switch (orientation) {
      case 'front': return '';
      case 'back': return '';
      case 'right': return 'rotateZ(90deg)';
      case 'left': return 'rotateZ(-90deg)';
      case 'top': return '';
      case 'bottom': return '';
      default: return '';
    }
  };

  const inverseTransform = getInverseTransform(orientation);
  const alignmentTransform = getAlignmentTransform(orientation);
  const combinedTransform = `${inverseTransform} ${alignmentTransform}`.trim();

  return (
    <div 
      className="w-full h-full"
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: combinedTransform,
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        transformOrigin: '50% 50%',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
}
