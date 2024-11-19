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

interface ComponentSelectedEvent extends CustomEvent {
  detail: {
    importPath: string;
    componentProps: Record<string, any>;
  };
}

const MCard: FC<MCardProps> = ({ importPath: initialImportPath, defaultContent, componentProps = {} }) => {
  const [importPath, setImportPath] = useState(initialImportPath);
  const [props, setProps] = useState(componentProps);
  const cardRef = useRef<HTMLDivElement>(null);

  // Listen for component selection events
  useEffect(() => {
    const handleComponentSelected = (e: ComponentSelectedEvent) => {
      if (!cardRef.current) return;

      // Find the closest split container
      const splitContainer = cardRef.current.closest('.split.horizontal');
      if (!splitContainer) return;

      // Get all vertical splits that are direct children of the horizontal split
      const verticalSplits = Array.from(splitContainer.querySelectorAll(':scope > .split.vertical'));
      
      // Find the middle vertical split (in a three-pane layout)
      const middleVerticalSplit = verticalSplits[0];
      if (!middleVerticalSplit) return;

      // Get the top pane of the middle vertical split
      const verticalPanes = middleVerticalSplit.querySelectorAll(':scope > .split-pane');
      const topPane = verticalPanes[0];
      if (!topPane) return;

      // Check if this MCard is in the top pane
      if (topPane.contains(cardRef.current)) {
        const { importPath: newImportPath, componentProps: newProps } = e.detail;
        setImportPath(newImportPath);
        setProps(newProps);
      }
    };

    window.addEventListener('componentSelected', handleComponentSelected as EventListener);
    return () => {
      window.removeEventListener('componentSelected', handleComponentSelected as EventListener);
    };
  }, []);

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
        data-component={importPath}
      >
        <Suspense fallback={<LoadingFallback />}>
          <DefaultComponent {...props} />
        </Suspense>
      </div>
    );
  }

  // Dynamic import for the component
  const DynamicComponent = useMemo(() => {
    if (!importPath) return null;

    return lazy(() => {
      console.log('Loading component:', importPath);
      
      // Special case for SearchableCardSelector, ComponentSelector and SearchableCardsFromDB
      if (importPath === 'SearchableCardSelector' || importPath === 'ComponentSelector' || importPath === 'SearchableCardsFromDB') {
        return import(`./CardContent/${importPath}`);
      }

      // Handle WebPageCube components
      if (importPath.startsWith('WebPageCube/')) {
        const componentName = importPath.split('/')[1];
        return import(`./CardContent/WebPageCube/${componentName}`);
      }

      // Default import path
      return import(`./CardContent/${importPath}`);
    });
  }, [importPath]);

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
      data-component={importPath}
    >
      <Suspense fallback={<LoadingFallback />}>
        <DynamicComponent {...props} />
      </Suspense>
    </div>
  );
};

export default MCard;
