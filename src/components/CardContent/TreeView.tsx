import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
}

interface TreeViewProps {
  title?: string;
  onComponentSelect?: (componentName: string) => void;
}

const cardComponents: TreeNode[] = [
  {
    id: 'components',
    name: 'Components',
    type: 'folder',
    children: [
      { id: 'abstractspec', name: 'AbstractSpec', type: 'file' },
      { id: 'calculator', name: 'Calculator', type: 'file' },
      { id: 'clock', name: 'Clock', type: 'file' },
      { id: 'colorpicker', name: 'ColorPicker', type: 'file' },
      { id: 'componentselector', name: 'ComponentSelector', type: 'file' },
      { id: 'concreteimpl', name: 'ConcreteImpl', type: 'file' },
      { id: 'counter', name: 'Counter', type: 'file' },
      { id: 'dashboard', name: 'Dashboard', type: 'file' },
      { id: 'notes', name: 'Notes', type: 'file' },
      { id: 'realisticexpectations', name: 'RealisticExpectations', type: 'file' },
      { id: 'spotifyplayer', name: 'SpotifyPlayer', type: 'file' },
      { id: 'threejscontrols', name: 'ThreeJsControls', type: 'file' },
      { id: 'threejscube', name: 'ThreeJsCube', type: 'file' },
      { id: 'todolist', name: 'TodoList', type: 'file' },
      { id: 'treeview', name: 'TreeView', type: 'file' },
      { id: 'youtubeplayer', name: 'YouTubePlayer', type: 'file' },
      {
        id: 'webpagecube',
        name: 'WebPageCube',
        type: 'folder',
        children: [
          { id: 'webpagecube-main', name: 'WebPageCube', type: 'file' },
          { id: 'cubecontrols', name: 'CubeControls', type: 'file' },
          { id: 'cubeface', name: 'CubeFace', type: 'file' }
        ]
      }
    ]
  }
];

interface TreeNodeComponentProps {
  node: TreeNode;
  onFileClick: (node: TreeNode) => void;
}

const TreeNodeComponent: React.FC<TreeNodeComponentProps> = ({ node, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node);
    }
  };

  return (
    <div className="pl-4">
      <div 
        className="flex items-center py-1 hover:bg-gray-700 rounded cursor-pointer" 
        onClick={handleClick}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
        ) : (
          <span className="w-4" />
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 text-yellow-500 mr-2" />
        ) : (
          <FileText className="w-4 h-4 text-blue-500 mr-2" />
        )}
        <span className="text-sm text-gray-300">{node.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-2">
          {node.children?.map((child) => (
            <TreeNodeComponent key={child.id} node={child} onFileClick={onFileClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeView: React.FC<TreeViewProps> = ({ title = "Components", onComponentSelect }) => {
  const handleFileClick = (node: TreeNode) => {
    const event = new CustomEvent('componentSelected', { 
      detail: node.name,
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="h-full bg-gray-800 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {cardComponents.map((node) => (
        <TreeNodeComponent key={node.id} node={node} onFileClick={handleFileClick} />
      ))}
    </div>
  );
};

export default TreeView;
