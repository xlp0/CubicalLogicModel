'use client';

import React from 'react';
import Split from 'react-split';
import HCard from '../HCard';

export default function SplitPane() {
  return (
    <div className="h-screen">
      <Split
        className="split"
        sizes={[50, 50]}
        minSize={300}
        gutterSize={4}
        snapOffset={30}
        dragInterval={1}
      >
        <div className="h-full overflow-hidden">
          <HCard
            importPath="WebPageCube/WebPageCube"
            componentProps={{
              title: "Interactive Web Cube",
              frontComponent: "AbstractSpec",
              backComponent: "RealisticExpectations",
              rightComponent: "ConcreteImpl",
              leftComponent: "SpotifyPlayer",
              topComponent: "YouTubePlayer",
              bottomComponent: "Counter"
            }}
          />
        </div>
        <div className="h-full overflow-hidden">
          <HCard
            importPath="ThreeJsCube"
            componentProps={{
              title: "A 3D View"
            }}
          />
        </div>
      </Split>
    </div>
  );
}
