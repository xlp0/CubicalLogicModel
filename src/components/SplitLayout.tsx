'use client';

import { useEffect, useRef, Suspense, lazy, useState, FC, Fragment } from 'react';
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

const SplitLayout: FC<SplitLayoutProps> = ({ panes: initialPanes }) => {
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
      
      if (children.length < 2) {
        console.warn('Split container has less than 2 children:', element);
        return;
      }

      const instance = Split(children as HTMLElement[], {
        direction,
        gutterSize: 4,
        minSize: 100,
        cursor: direction === 'vertical' ? 'row-resize' : 'col-resize',
        gutter: (index, direction) => {
          const gutter = document.createElement('div');
          gutter.className = `gutter gutter-${direction}`;
          return gutter;
        }
      });
      
      splitRef.current.push(instance);
    });

    // Add event listener for component selection
    const handleComponentSelected = (event: Event) => {
      const { importPath, componentProps } = (event as ComponentSelectedEvent).detail;
      setPanes(currentPanes => {
        const newPanes = [...currentPanes];
        // Update the first pane in the middle split section
        const middlePane = newPanes[1];
        if (middlePane && middlePane.split) {
          middlePane.split.panes[0] = {
            ...middlePane.split.panes[0],
            importPath,
            componentProps
          };
        }
        return newPanes;
      });
    };

    window.addEventListener('component-selected', handleComponentSelected as EventListener);

    return () => {
      // Clean up Split instances and event listener
      splitRef.current.forEach(instance => instance.destroy());
      window.removeEventListener('component-selected', handleComponentSelected as EventListener);
    };
  }, []);

  const renderPane = (pane: PaneConfig) => {
    if (pane.split) {
      return (
        <div className={`split ${pane.split.direction}`} style={{ flex: pane.flex || 1 }}>
          {renderPane(pane.split.panes[0])}
          {renderPane(pane.split.panes[1])}
        </div>
      );
    }

    return (
      <div style={{ 
        flex: pane.flex || 1,
        width: pane.width || 'auto',
        minWidth: pane.minWidth || '0',
        height: '100%',
        position: 'relative'
      }}>
        <Suspense fallback={<div>Loading...</div>}>
          <MCard 
            importPath={pane.importPath} 
            componentProps={pane.componentProps}
          />
        </Suspense>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex">
      {panes.map((pane, index) => (
        <Fragment key={index}>
          {renderPane(pane)}
        </Fragment>
      ))}
    </div>
  );
};

export default SplitLayout;
