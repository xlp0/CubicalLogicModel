import React, { Suspense, lazy, useMemo } from 'react';

interface HCardProps {
  importPath: string;
  title?: string;
  description?: string;
}

const HCard: React.FC<HCardProps> = ({ importPath, title, description }) => {
  // Memoize the lazy component to prevent re-creation
  const Component = useMemo(() => 
    lazy(() => import(`${importPath}`).catch(() => {
      console.error(`Failed to load component from path: ${importPath}`);
      return { default: () => <div>Failed to load component</div> };
    })), 
    [importPath]
  );

  return (
    <div className="h-full w-full">
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-600/20">
          <div className="animate-pulse text-white/50">Loading...</div>
        </div>
      }>
        <Component />
      </Suspense>
    </div>
  );
};

export default React.memo(HCard);
