'use client';

import React, { Suspense, lazy, useMemo } from 'react';
import type { FC, ComponentProps } from 'react';

interface MCardProps {
  importPath?: string;
  defaultContent?: FC<any>;
  componentProps?: ComponentProps<any>;
}

const MCard: FC<MCardProps> = ({ importPath, defaultContent, componentProps = {} }) => {
  console.log('MCard rendering with props:', { importPath, hasDefaultContent: !!defaultContent, componentProps });

  const LoadingFallback = () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>
  );

  // If defaultContent is provided, use it directly
  if (defaultContent) {
    const DefaultComponent = defaultContent;
    return (
      <div className="h-full w-full">
        <Suspense fallback={<LoadingFallback />}>
          <DefaultComponent {...componentProps} />
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
        console.error(`Failed to load component from path: ${importPath}`, error);
        return {
          default: () => (
            <div className="p-4 bg-red-500/10 rounded-lg text-red-500">
              Failed to load component: {importPath}
              <pre className="mt-2 text-sm opacity-75">{error.message}</pre>
            </div>
          )
        };
      }
    }), 
    [importPath]
  );

  return (
    <div className="h-full w-full">
      <Suspense fallback={<LoadingFallback />}>
        <Component {...componentProps} />
      </Suspense>
    </div>
  );
};

export default React.memo(MCard);
