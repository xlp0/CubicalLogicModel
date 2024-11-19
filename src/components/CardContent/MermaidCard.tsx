'use client';

import React, { useEffect, useRef } from 'react';
import type { FC } from 'react';
import mermaid from 'mermaid';

interface MermaidCardProps {
  contentString?: string;
  style?: React.CSSProperties;
}

const defaultContent = `
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Not End]
    D --> E
`;

const MermaidCard: FC<MermaidCardProps> = ({ contentString = defaultContent, style = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      });

      // Clear previous content
      containerRef.current.innerHTML = '';

      // Create a unique ID for this diagram
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        mermaid.render(id, contentString).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = 'Error rendering diagram';
        }
      }
    }
  }, [contentString]);

  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center bg-white p-4" 
      style={style}
    >
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center" 
      />
    </div>
  );
};

MermaidCard.displayName = 'MermaidCard';
export default MermaidCard;
