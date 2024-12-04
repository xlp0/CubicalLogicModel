'use client';

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import type { FC } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MermaidCardProps {
  title?: string;
  contentString?: string;
  style?: CSSProperties;
}

const defaultContent = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Not End]
    D --> E`;

const MermaidCard: FC<MermaidCardProps> = ({ 
  title = "Mermaid Diagram",
  contentString = defaultContent, 
  style = {} 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(contentString);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing && containerRef.current) {
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
        mermaid.render(id, content).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            setError(null);
          }
        }).catch((error) => {
          console.error('Error rendering Mermaid diagram:', error);
          setError('Error rendering diagram. Please check your syntax.');
        });
      } catch (error) {
        console.error('Error rendering Mermaid diagram:', error);
        setError('Error rendering diagram. Please check your syntax.');
      }
    }
  }, [content, isEditing]);

  return (
    <div 
      className="h-full flex flex-col bg-gray-50 dark:bg-gray-900" 
      style={style}
    >
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="text-sm"
        >
          {isEditing ? 'Preview' : 'Edit'}
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={cn(
              "w-full h-full p-4",
              "font-mono text-sm",
              "text-white bg-[#1E1E1E]",
              "resize-none",
              "focus:outline-none focus:ring-0",
              "selection:bg-blue-500/30"
            )}
            placeholder="Enter your Mermaid diagram code here..."
            spellCheck={false}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center">
            {error && (
              <div className="w-full p-4 text-red-500 bg-red-100 dark:bg-red-900/20">
                {error}
              </div>
            )}
            <div 
              ref={containerRef} 
              className="flex-1 w-full flex items-center justify-center p-4 bg-white dark:bg-gray-800" 
            />
          </div>
        )}
      </div>
    </div>
  );
};

MermaidCard.displayName = 'MermaidCard';
export default MermaidCard;
