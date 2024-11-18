'use client';

import React, { Suspense, lazy, useMemo, useEffect, useState, useRef } from 'react';
import type { FC, ComponentProps } from 'react';

interface MCardProps {
  importPath?: string;
  defaultContent?: FC<any>;
  componentProps?: ComponentProps<any>;
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

      // Check if this MCard is in the top pane
      const splitPane = document.querySelector('.split-pane');
      if (!splitPane) return;

      const topPane = splitPane.querySelector('.split-pane-child:first-child');
      if (!topPane) return;

      // Only update if this MCard is in the top pane
      if (topPane.contains(cardRef.current)) {
        const { importPath: newImportPath, componentProps: newProps } = e.detail;
        console.log('Updating top pane component to:', newImportPath, 'with props:', newProps);
        setImportPath(newImportPath);
        setProps(newProps);
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
      <div ref={cardRef} className="h-full w-full p-2" data-component={importPath}>
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
      
      // Special case for SearchableCardSelector and ComponentSelector
      if (importPath === 'SearchableCardSelector' || importPath === 'ComponentSelector') {
        return import(`./CardContent/${importPath}`).catch(error => {
          console.error(`Error loading selector component ${importPath}:`, error);
          return {
            default: () => (
              <div className="p-4 bg-red-500/10 rounded-lg text-red-500">
                Error loading component: {importPath}
              </div>
            )
          };
        });
      }

      // For other components, try with .tsx extension
      return import(`./CardContent/${importPath}.tsx`)
        .catch(() => import(`./CardContent/WebPageCube/${importPath}.tsx`))
        .catch(error => {
          console.error(`Error loading component ${importPath}:`, error);
          return {
            default: () => (
              <div className="p-4 bg-red-500/10 rounded-lg text-red-500">
                Error loading component: {importPath}
              </div>
            )
          };
        });
    });
  }, [importPath]);

  if (!DynamicComponent) {
    return (
      <div ref={cardRef} className="h-full w-full p-2" data-component={importPath}>
        <div className="p-4 bg-yellow-500/10 rounded-lg text-yellow-500">
          No component specified
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="h-full w-full p-2" data-component={importPath}>
      <Suspense fallback={<LoadingFallback />}>
        <DynamicComponent {...props} />
      </Suspense>
    </div>
  );
};

export default MCard;
