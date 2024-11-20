'use client';

import { useEffect, useState, useRef } from 'react';

interface ImageDisplayProps {
  title?: string;
  iconPath: string;
  width?: number;
  height?: number;
  className?: string;
}

const ImageDisplay = ({
  title,
  iconPath = '/icons/windsurf.svg',
  width = 40,
  height = 40,
  className = ''
}) => {
  const [imageContent, setImageContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to get file extension
  const getFileExtension = (path: string): string => {
    return path.split('.').pop()?.toLowerCase() || '';
  };

  // Helper function to check if path is a URL
  const isUrl = (path: string): boolean => {
    return path.startsWith('http://') || path.startsWith('https://');
  };

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (!iconPath) {
          throw new Error('No image path provided');
        }

        setIsLoading(true);
        setError('');

        // Normalize the path if it's not a URL
        let normalizedPath = iconPath;
        if (!isUrl(iconPath)) {
          // Strip any leading paths and ensure it starts with /icons/
          const filename = iconPath.split('/').pop();
          normalizedPath = `/icons/${filename}`;

          // Use the import.meta.env.BASE_URL if available (for production builds)
          const baseUrl = import.meta.env.BASE_URL || '';
          normalizedPath = `${baseUrl}${normalizedPath}`.replace('//', '/');
        }

        console.log('Attempting to load image from:', normalizedPath);
        
        const extension = getFileExtension(normalizedPath);
        
        if (extension === 'svg') {
          // Handle SVG files
          const response = await fetch(normalizedPath);
          if (!response.ok) {
            throw new Error(`Failed to load image from path: ${normalizedPath} (${response.status} ${response.statusText})`);
          }

          const svgText = await response.text();
          if (!svgText.includes('<svg')) {
            throw new Error('Invalid SVG content');
          }
          
          setImageContent(svgText);
        } else {
          // For other image formats, we'll use the path directly in an img tag
          // but we still want to verify the image loads
          const img = new Image();
          img.src = normalizedPath;
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Failed to load image'));
          });
          
          setImageContent(normalizedPath);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading image:', error);
        setError(`Error loading image: ${error.message}`);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [iconPath]);

  const getContainerClasses = () => {
    return "flex flex-col items-center justify-center p-4 rounded-lg bg-gray-100 shadow-sm hover:bg-gray-200/80 transition-colors duration-200";
  };

  const getImageContainerClasses = () => {
    return "p-4 rounded-lg flex items-center justify-center bg-white shadow-sm border border-gray-200";
  };

  const getTextClasses = () => {
    return "text-gray-700 font-medium";
  };

  if (isLoading) {
    return (
      <div ref={containerRef} className={getContainerClasses()}>
        <div className={getImageContainerClasses()}>
          <div className="animate-pulse bg-gray-200 rounded-lg" 
               style={{ width: width, height: height }}>
          </div>
        </div>
        {title && (
          <div className={`mt-3 text-lg ${getTextClasses()}`}>
            <div className="animate-pulse bg-gray-200 rounded h-6 w-24"></div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef} className={`${getContainerClasses()} bg-red-50`}>
        <div className="text-sm font-medium text-red-600">{error}</div>
        <div className="text-xs mt-1 text-red-500">
          Path: {iconPath || 'No path provided'}
        </div>
      </div>
    );
  }

  const extension = getFileExtension(iconPath);
  
  return (
    <div ref={containerRef} className={getContainerClasses()}>
      <div className={getImageContainerClasses()}>
        {imageContent && (
          extension === 'svg' ? (
            <div
              className={`w-${width} h-${height} ${className} hover:scale-105 transition-transform duration-200`}
              dangerouslySetInnerHTML={{
                __html: imageContent
                  .replace(/width="[^"]*"/, `width="${width}"`)
                  .replace(/height="[^"]*"/, `height="${height}"`)
              }}
            />
          ) : (
            <img
              src={imageContent}
              alt={title || 'Image'}
              width={width}
              height={height}
              className={`object-contain hover:scale-105 transition-transform duration-200 ${className}`}
              style={{ width, height }}
            />
          )
        )}
      </div>
      {title && (
        <div className={`mt-3 text-lg ${getTextClasses()}`}>
          {title}
        </div>
      )}
    </div>
  );
};

// For backward compatibility, we'll export both names
export const LogoDisplay = ImageDisplay;
export default ImageDisplay;
