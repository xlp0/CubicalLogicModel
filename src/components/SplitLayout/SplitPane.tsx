'use client';

import React from 'react';
import Split from 'react-split';
import MCard from '../MCard';

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
          <MCard
            importPath="WebPageCube/WebPageCube"
            componentProps={{
              title: "Interactive Web Cube",
              frontComponent: "Dashboard",
              backComponent: "RealisticExpectations",
              rightComponent: "Calculator",
              leftComponent: "SpotifyPlayer",
              topComponent: "YouTubePlayer",
              bottomComponent: "Counter"
            }}
          />
        </div>
        <div className="h-full overflow-hidden">
          <MCard
            importPath="Dashboard"
            componentProps={{
              title: "A 3D View"
            }}
          />
        </div>
      </Split>
    </div>
  );
}
