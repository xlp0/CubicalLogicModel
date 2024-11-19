'use client';

import React, { Suspense, lazy, useMemo, useEffect, useState, useRef } from 'react';
import type { FC, ComponentProps } from 'react';

interface MCardProps {
  importPath?: string;
  defaultContent?: FC<any>;
  componentProps?: ComponentProps<any> & {
    style?: React.CSSProperties;
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

    return lazy(() => {
      console.log('Loading component:', initialImportPath);
      
      // Special case for SearchableCardSelector, ComponentSelector and SearchableCardsFromDB
      if (initialImportPath === 'SearchableCardSelector' || initialImportPath === 'ComponentSelector' || initialImportPath === 'SearchableCardsFromDB') {
        return import(`./CardContent/${initialImportPath}`);
      }

      // Handle WebPageCube components
      if (initialImportPath.startsWith('WebPageCube/')) {
        const componentName = initialImportPath.split('/')[1];
        return import(`./CardContent/WebPageCube/${componentName}`);
      }

      // Default import path
      return import(`./CardContent/${initialImportPath}`);
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
