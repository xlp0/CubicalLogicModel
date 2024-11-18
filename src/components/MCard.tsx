'use client';

import React, { Suspense, lazy, useMemo, useEffect, useState, useRef } from 'react';
import type { FC, ComponentProps } from 'react';

interface MCardProps {
  importPath?: string;
  defaultContent?: FC<any>;
  componentProps?: ComponentProps<any>;
}

const MCard: FC<MCardProps> = ({ importPath: initialImportPath, defaultContent, componentProps = {} }) => {
  const [importPath, setImportPath] = useState(initialImportPath);
  const [props, setProps] = useState(componentProps);
  const cardRef = useRef<HTMLDivElement>(null);

  // Listen for component selection events
  useEffect(() => {
    const handleComponentSelected = (e: CustomEvent) => {
      if (!cardRef.current) return;

      // Check if this MCard is in the top pane
      const splitPane = document.querySelector('.split-pane');
      if (!splitPane) return;

      const topPane = splitPane.querySelector('.split-pane-child:first-child');
      if (!topPane) return;

      // Only update if this MCard is in the top pane
      if (topPane.contains(cardRef.current)) {
        const componentName = e.detail;
        console.log('Updating top pane component to:', componentName);
        setImportPath(componentName);
        setProps({ title: componentName });
      }
    };

    document.addEventListener('componentSelected', handleComponentSelected as EventListener);
    return () => {
      document.removeEventListener('componentSelected', handleComponentSelected as EventListener);
    };
  }, []);

  const LoadingFallback = () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>
  );

  // If defaultContent is provided, use it directly
  if (defaultContent) {
    const DefaultComponent = defaultContent;
    return (
      <div ref={cardRef} className="h-full w-full" data-component={importPath}>
        <Suspense fallback={<LoadingFallback />}>
          <DefaultComponent {...props} />
        </Suspense>
      </div>
    );
  }

  // Otherwise, use dynamic import
  const Component = useMemo(() => 
    lazy(async () => {
      if (!importPath) {
        return {
          default: () => (
            <div className="p-4 bg-yellow-500/10 rounded-lg text-yellow-500">
              No component specified
            </div>
          )
        };
      }

      try {
        console.log('Attempting to import:', importPath);
        // Use dynamic import with full path
        const module = await import(/* @vite-ignore */ `./CardContent/${importPath}`);
        console.log('Module loaded successfully:', module);
        return module;
      } catch (error) {
        console.error('Error loading component:', error);
        return {
          default: () => (
            <div className="p-4 bg-red-500/10 rounded-lg text-red-500">
              Error loading component: {importPath}
              <pre className="mt-2 text-sm opacity-75">{error.message}</pre>
            </div>
          )
        };
      }
    }),
    [importPath]
  );

  return (
    <div ref={cardRef} className="h-full w-full" data-component={importPath}>
      <Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </Suspense>
    </div>
  );
};

export default React.memo(MCard);
