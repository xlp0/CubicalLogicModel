'use client';

import React, { useEffect, useRef, Suspense, lazy, useState } from 'react';
import Split from 'split.js';

interface PaneConfig {
  importPath: string;
  componentProps?: Record<string, any>;
  width?: string;
  minWidth?: string;
  flex?: number;
  split?: {
    direction: 'vertical' | 'horizontal';
    sizes: [number, number];
    panes: [PaneConfig, PaneConfig];
  };
}

interface SplitLayoutProps {
  panes: PaneConfig[];
}

interface ComponentSelectedEvent extends CustomEvent {
  detail: {
    importPath: string;
    componentProps: Record<string, any>;
  };
}

// Lazy load MCard
const MCard = lazy(() => import('./MCard'));

const SplitLayout: React.FC<SplitLayoutProps> = ({ panes: initialPanes }) => {
  const [panes, setPanes] = useState<PaneConfig[]>(initialPanes);
  const splitRef = useRef<Split.Instance[]>([]);

  useEffect(() => {
    // Clean up previous Split instances
    splitRef.current.forEach(instance => instance.destroy());
    splitRef.current = [];

    // Initialize Split.js on all split containers
    const splitElements = document.querySelectorAll('.split');
    splitElements.forEach((element) => {
      const direction = element.classList.contains('vertical') ? 'vertical' : 'horizontal';
      const children = Array.from(element.children).filter(child => !child.classList.contains('gutter'));
      
      const instance = Split(children as HTMLElement[], {
        direction,
        gutterSize: 4,
        minSize: 100,
        snapOffset: 0,
        gutter: (index, direction) => {
          const gutter = document.createElement('div');
          gutter.className = `gutter gutter-${direction}`;
          return gutter;
        },
      });
      
      splitRef.current.push(instance);
    });

    return () => {
      // Cleanup on unmount
      splitRef.current.forEach(instance => instance.destroy());
    };
  }, []);

  useEffect(() => {
    const handleComponentSelected = (event: Event) => {
      const { importPath, componentProps } = (event as ComponentSelectedEvent).detail;
      
      setPanes(currentPanes => {
        const newPanes = [...currentPanes];
        // Update the first pane in the middle vertical split
        if (newPanes[1]?.split?.panes) {
          newPanes[1].split.panes[0] = {
            ...newPanes[1].split.panes[0],
            importPath,
            componentProps: {
              ...newPanes[1].split.panes[0].componentProps,
              ...componentProps
            }
          };
        }
        return newPanes;
      });
    };

    document.addEventListener('componentSelected', handleComponentSelected);
    return () => document.removeEventListener('componentSelected', handleComponentSelected);
  }, []);

  const renderPane = (pane: PaneConfig, index: number) => {
    if (pane.split) {
      return (
        <div 
          className={`split ${pane.split.direction}`}
          style={{ 
            width: pane.width, 
            minWidth: pane.minWidth,
            height: '100%',
          }}
        >
          {pane.split.panes.map((splitPane, splitIndex) => (
            <div 
              key={`split-pane-${index}-${splitIndex}`}
              className="split-pane"
              style={{ 
                minWidth: splitPane.minWidth,
                height: '100%',
              }}
            >
              {renderComponent(splitPane)}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        key={`pane-${index}`}
        className="pane"
        style={{ 
          width: pane.width,
          minWidth: pane.minWidth,
          flex: pane.flex,
          height: '100%',
        }}
      >
        {renderComponent(pane)}
      </div>
    );
  };

  const renderComponent = (pane: PaneConfig) => {
    return (
      <Suspense fallback={<div className="w-full h-full bg-gray-800 animate-pulse" />}>
        <MCard
          importPath={pane.importPath}
          componentProps={pane.componentProps}
        />
      </Suspense>
    );
  };

  return (
    <div className="h-full flex">
      {panes.map((pane, index) => renderPane(pane, index))}
    </div>
  );
};

export default SplitLayout;
