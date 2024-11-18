'use client';

import React, { useEffect, useRef } from 'react';
import Split from 'split.js';
import MCard from './MCard';

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

const SplitLayout: React.FC<SplitLayoutProps> = ({ panes }) => {
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
              <MCard 
                importPath={splitPane.importPath}
                componentProps={splitPane.componentProps}
              />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div 
        className="split-pane"
        style={{ 
          width: pane.width, 
          minWidth: pane.minWidth,
          height: '100%',
        }}
      >
        <MCard 
          importPath={pane.importPath}
          componentProps={pane.componentProps}
        />
      </div>
    );
  };

  return (
    <div className="split horizontal" style={{ height: '100%' }}>
      {panes.map((pane, index) => (
        <React.Fragment key={`pane-${index}`}>
          {renderPane(pane, index)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SplitLayout;
