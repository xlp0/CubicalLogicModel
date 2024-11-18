import React from 'react';
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
  return (
    <div className="split-container">
      {panes.map((pane, index) => (
        <React.Fragment key={`pane-wrapper-${index}`}>
          <div 
            className="pane"
            data-index={index}
            data-component={pane.importPath}
            data-min-width={pane.minWidth?.replace('px', '')}
            style={{
              width: pane.width
            }}
          >
            <div className="pane-content">
              {pane.split ? (
                <div className={`split-pane ${pane.split.direction}`}>
                  {pane.split.panes.map((splitPane, splitIndex) => (
                    <React.Fragment key={`split-pane-wrapper-${splitIndex}`}>
                      <div 
                        className="split-pane-child"
                        style={{
                          flex: `${pane.split.sizes[splitIndex]} ${pane.split.sizes[splitIndex]} 0%`
                        }}
                      >
                        <div className="pane-content">
                          <MCard 
                            importPath={splitPane.importPath}
                            componentProps={splitPane.componentProps}
                          />
                        </div>
                      </div>
                      {splitIndex < pane.split.panes.length - 1 && (
                        <div 
                          className={`resizer ${pane.split.direction}`}
                          data-parent-index={index}
                          data-split-index={splitIndex}
                          data-direction={pane.split.direction}
                        >
                          <div className="resizer-handle" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <MCard 
                  importPath={pane.importPath}
                  componentProps={pane.componentProps}
                />
              )}
            </div>
          </div>
          {index < panes.length - 1 && (
            <div 
              className="resizer vertical" 
              data-index={index} 
              data-direction="vertical"
            >
              <div className="resizer-handle" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SplitLayout;
