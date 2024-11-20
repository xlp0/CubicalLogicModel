'use client';

import { useEffect, useRef, Suspense, lazy, useState, FC, Fragment, useCallback } from 'react';
import Split from 'split.js';

interface PaneConfig {
  importPath?: string;
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

const SplitLayout: FC<SplitLayoutProps> = ({ panes: initialPanes }) => {
  const [panes, setPanes] = useState<PaneConfig[]>(initialPanes);
  const splitRef = useRef<Split.Instance[]>([]);

  useEffect(() => {
    // Clean up previous Split instances
    splitRef.current.forEach(instance => instance.destroy());
    splitRef.current = [];

    // Initialize Split.js
    const initializeSplits = () => {
      // First initialize the main horizontal split
      const mainContainer = document.querySelector('.main-split');
      if (mainContainer) {
        const mainChildren = Array.from(mainContainer.children) as HTMLElement[];
        if (mainChildren.length >= 2) {
          const mainInstance = Split(mainChildren, {
            gutterSize: 8,
            minSize: panes.map(p => parseInt(p.minWidth || '100')),
            dragInterval: 1,
            elementStyle: (dimension, size, gutterSize) => ({
              'flex-basis': `calc(${size}% - ${gutterSize}px)`,
            }),
            gutterStyle: (dimension, gutterSize) => ({
              'flex-basis': `${gutterSize}px`,
            })
          });
          splitRef.current.push(mainInstance);
        }
      }

      // Then initialize any vertical splits
      const verticalSplits = document.querySelectorAll('.vertical-split');
      verticalSplits.forEach((container) => {
        const children = Array.from(container.children) as HTMLElement[];
        if (children.length >= 2) {
          const verticalInstance = Split(children, {
            direction: 'vertical',
            gutterSize: 8,
            minSize: 100,
            sizes: [50, 50],
            dragInterval: 1,
            elementStyle: (dimension, size, gutterSize) => ({
              'flex-basis': `calc(${size}% - ${gutterSize}px)`,
              'height': `calc(${size}% - ${gutterSize}px)`,
            }),
            gutterStyle: (dimension, gutterSize) => ({
              'flex-basis': `${gutterSize}px`,
              'height': `${gutterSize}px`,
            })
          });
          splitRef.current.push(verticalInstance);
        }
      });
    };

    // Wait for React to finish rendering
    setTimeout(initializeSplits, 0);

    // Add event listener for component selection
    const handleComponentSelected = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { importPath, componentProps } = customEvent.detail;
      
      setPanes(currentPanes => {
        const newPanes = [...currentPanes];
        if (newPanes[1]?.split?.panes) {
          newPanes[1].split.panes[0] = {
            ...newPanes[1].split.panes[0],
            importPath,
            componentProps
          };
        }
        return newPanes;
      });
    };

    document.addEventListener('component-selected', handleComponentSelected);
    
    return () => {
      splitRef.current.forEach(instance => instance.destroy());
      document.removeEventListener('component-selected', handleComponentSelected);
    };
  }, []);

  return (
    <div className="main-split h-full w-full">
      {panes.map((pane, index) => (
        <div key={index} className={pane.split ? 'vertical-split h-full' : 'h-full'}>
          {pane.split ? (
            pane.split.panes.map((nestedPane, nestedIndex) => (
              <div key={nestedIndex} className="h-full">
                <Suspense fallback={<Fragment />}>
                  <MCard
                    importPath={nestedPane.importPath}
                    componentProps={nestedPane.componentProps}
                  />
                </Suspense>
              </div>
            ))
          ) : (
            <Suspense fallback={<Fragment />}>
              <MCard
                importPath={pane.importPath}
                componentProps={pane.componentProps}
              />
            </Suspense>
          )}
        </div>
      ))}
    </div>
  );
};

export default SplitLayout;
