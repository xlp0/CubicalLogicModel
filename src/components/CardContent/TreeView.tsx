'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';

interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

interface TreeViewProps {
  data?: TreeNode[];
  onSelect?: (node: TreeNode) => void;
}

const sampleData: TreeNode[] = [
  {
    id: '1',
    name: 'Project Files',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'Components',
        type: 'folder',
        children: [
          { id: '3', name: 'ThreeJsCube.tsx', type: 'file' },
          { id: '4', name: 'YouTubePlayer.tsx', type: 'file' },
          { id: '5', name: 'Calculator.tsx', type: 'file' }
        ]
      },
      {
        id: '6',
        name: 'Layouts',
        type: 'folder',
        children: [
          { id: '7', name: 'SingleCardLayout.astro', type: 'file' },
          { id: '8', name: 'SplitViewLayout.astro', type: 'file' }
        ]
      }
    ]
  }
];

const TreeNode = React.memo(({ 
  node, 
  level = 0, 
  onSelect 
}: { 
  node: TreeNode; 
  level?: number; 
  onSelect?: (node: TreeNode) => void;
}) => {
  console.log('Rendering node:', node.name, 'type:', node.type);
  const [expanded, setExpanded] = useState(true);
  const indent = level * 20;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      console.log('Toggling folder:', node.name, 'from:', expanded, 'to:', !expanded);
      setExpanded(!expanded);
    } else if (onSelect) {
      onSelect(node);
    }
  };

  return (
    <div className="select-none">
      <div 
        className={`
          flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer
          ${node.type === 'file' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-200'}
        `}
        style={{ paddingLeft: `${indent}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          expanded ? (
            <ChevronDown className="w-4 h-4 mr-1 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-1 text-gray-400" />
          )
        )}
        {node.type === 'folder' ? (
          <Folder className="w-4 h-4 mr-2 text-yellow-400" />
        ) : (
          <FileText className="w-4 h-4 mr-2 text-blue-400" />
        )}
        <span>{node.name}</span>
      </div>

      {node.type === 'folder' && expanded && node.children && (
        <div className="ml-2 border-l border-gray-700">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';

const TreeView: React.FC<TreeViewProps> = ({ data = sampleData, onSelect }) => {
  console.log('Rendering TreeView with data:', data);
  return (
    <div className="h-full bg-gray-800 text-sm overflow-y-auto p-2">
      {data.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default TreeView;
