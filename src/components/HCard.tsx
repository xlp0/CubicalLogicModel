'use client';

import React, { Suspense, lazy, useMemo } from 'react';

interface HCardProps {
  importPath: string;
  componentProps?: Record<string, any>;
}

const HCard: React.FC<HCardProps> = ({ importPath, componentProps = {} }) => {
  // Memoize the lazy component to prevent re-creation
  const Component = useMemo(() => 
    lazy(async () => {
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
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
          <div className="animate-pulse text-white/50">Loading...</div>
        </div>
      }>
        <Component {...componentProps} />
      </Suspense>
    </div>
  );
};

export default React.memo(HCard);
