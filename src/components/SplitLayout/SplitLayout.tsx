'use client';

import React, { useState, useEffect } from 'react';
import WebPageCube from '../WebPageCube/WebPageCube';
import ComponentSelector from '../CardContent/ComponentSelector';

// Define the mapping of component paths to their dynamic imports
const componentMap: { [key: string]: () => Promise<any> } = {
  '../CardContent/ThreeJsCube': () => import('../CardContent/ThreeJsCube'),
  '../CardContent/Notes': () => import('../CardContent/Notes')
};

export default function SplitLayout() {
  const [selectedComponent, setSelectedComponent] = useState({
    name: 'ThreeJsCube',
    path: '../CardContent/ThreeJsCube',
    icon: null,
    title: 'A 3D View'
  });

  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  const handleComponentSelect = async (component: any) => {
    setSelectedComponent(component);
    try {
      const module = await componentMap[component.path]();
      setComponent(() => module.default);
    } catch (error) {
      console.error('Error loading component:', error);
    }
  };

  // Load initial component
  useEffect(() => {
    handleComponentSelect(selectedComponent);
  }, []);

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="h-full overflow-hidden relative border-r border-gray-600">
        <WebPageCube />
        <ComponentSelector
          onSelect={handleComponentSelect}
          activeComponent={selectedComponent.path}
        />
      </div>
      <div className="h-full overflow-hidden">
        {Component ? (
          <Component title={selectedComponent.title} />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900 text-white">
            Loading component...
          </div>
        )}
      </div>
    </div>
  );
}
