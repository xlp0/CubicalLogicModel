'use client';

import { Suspense, lazy, useMemo, useEffect, useState, useRef } from 'react';
import type { FC, ComponentProps, CSSProperties } from 'react';

interface MCardProps {
  importPath?: string;
  defaultContent?: FC<any>;
  componentProps?: ComponentProps<any> & {
    style?: CSSProperties;
  };
}

const MCard: FC<MCardProps> = ({ importPath: initialImportPath, defaultContent, componentProps = {} }) => {
  const [props, setProps] = useState(componentProps);
  const cardRef = useRef<HTMLDivElement>(null);

  // Update props when componentProps changes
  useEffect(() => {
    setProps(componentProps);
  }, [componentProps]);

  const LoadingFallback = () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>
  );

  // If defaultContent is provided, use it directly
  if (defaultContent) {
    const DefaultComponent = defaultContent;
    return (
      <div 
        ref={cardRef} 
        className="h-full w-full" 
        style={{ 
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          ...props.style 
        }} 
        data-component={initialImportPath}
      >
        <Suspense fallback={<LoadingFallback />}>
          <DefaultComponent {...props} />
        </Suspense>
      </div>
    );
  }

  // Dynamic import for the component
  const DynamicComponent = useMemo(() => {
    if (!initialImportPath) return null;

    const importMap = {
      'SearchableCardSelector': () => import('./CardContent/SearchableCardSelector'),
      'ComponentSelector': () => import('./CardContent/ComponentSelector'),
      'SearchableCardsFromDB': () => import('./CardContent/SearchableCardsFromDB'),
    };

    return lazy(() => {
      console.log('Loading component:', initialImportPath);
      
      try {
        // Check if it's one of the predefined components
        if (importMap[initialImportPath]) {
          return importMap[initialImportPath]();
        }

        // Handle WebPageCube components
        if (initialImportPath.startsWith('WebPageCube/')) {
          const componentName = initialImportPath.split('/')[1];
          // Using a more specific import pattern that Vite can analyze
          return (/* @vite-ignore */ import('./CardContent/WebPageCube/' + componentName));
        }

        // Default import path with a more specific pattern
        return (/* @vite-ignore */ import('./CardContent/' + initialImportPath));
      } catch (error) {
        console.error('Error loading component:', error);
        return Promise.reject(error);
      }
    });
  }, [initialImportPath]);

  if (!DynamicComponent) {
    return (
      <div ref={cardRef} className="h-full w-full flex items-center justify-center">
        <div className="text-white/50">No component specified</div>
      </div>
    );
  }

  return (
    <div 
      ref={cardRef} 
      className="h-full w-full" 
      style={{ 
        transformStyle: 'preserve-3d',
        display: 'flex',
        flexDirection: 'column',
        ...props.style 
      }} 
      data-component={initialImportPath}
    >
      <Suspense fallback={<LoadingFallback />}>
        <DynamicComponent {...props} />
      </Suspense>
    </div>
  );
};

export default MCard;
