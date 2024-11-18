import React, { useEffect, useState } from 'react';

interface LogoDisplayProps {
  title?: string;
  iconPath: string;
  width?: number;
  height?: number;
  className?: string;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  title,
  iconPath = '/icons/cubical-logic.svg', // Default fallback path
  width = 40,
  height = 40,
  className = ''
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadSvg = async () => {
      try {
        if (!iconPath) {
          throw new Error('No icon path provided');
        }

        // Normalize the path to always use /icons/ directory
        let normalizedPath = iconPath;
        
        // Strip any leading paths and ensure it starts with /icons/
        const filename = iconPath.split('/').pop();
        normalizedPath = `/icons/${filename}`;

        // Use the import.meta.env.BASE_URL if available (for production builds)
        const baseUrl = import.meta.env.BASE_URL || '';
        const fullPath = `${baseUrl}${normalizedPath}`.replace('//', '/');

        console.log('Attempting to load SVG from:', fullPath);
        
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`Failed to load SVG from path: ${fullPath} (${response.status} ${response.statusText})`);
        }

        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);

        const svgText = await response.text();
        console.log('SVG Content (first 100 chars):', svgText.substring(0, 100));
        
        // More lenient SVG validation
        if (!svgText.includes('<svg') || !svgText.includes('</svg>')) {
          throw new Error('Invalid SVG content - missing SVG tags');
        }
        
        setSvgContent(svgText);
        setError('');
      } catch (error) {
        console.error('Error loading SVG:', error);
        setError(`Error loading icon: ${error.message}`);
      }
    };

    loadSvg();
  }, [iconPath]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-red-500">
        <div className="text-sm">{error}</div>
        <div className="text-xs mt-1">Path: {iconPath || 'No path provided'}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {svgContent && (
        <div
          className={`w-${width} h-${height} ${className}`}
          dangerouslySetInnerHTML={{
            __html: svgContent
              .replace(/width="[^"]*"/, `width="${width}"`)
              .replace(/height="[^"]*"/, `height="${height}"`)
          }}
        />
      )}
      {title && <h3 className="mt-2 text-lg font-semibold">{title}</h3>}
    </div>
  );
};

export default LogoDisplay;
