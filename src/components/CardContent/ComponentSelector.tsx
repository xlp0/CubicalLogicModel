import { Button } from '@/components/ui/button';
import { Cube, StickyNote } from 'lucide-react';

interface ComponentOption {
  name: string;
  path: string;
  icon: React.ReactNode;
  title: string;
}

const components: ComponentOption[] = [
  {
    name: 'ThreeJsCube',
    path: '../CardContent/ThreeJsCube',
    icon: <Cube className="w-4 h-4" />,
    title: 'A 3D View'
  },
  {
    name: 'Notes',
    path: '../CardContent/Notes',
    icon: <StickyNote className="w-4 h-4" />,
    title: 'Notes'
  }
  // Add more components here as needed
];

interface ComponentSelectorProps {
  onSelect: (component: ComponentOption) => void;
  activeComponent: string;
}

export default function ComponentSelector({ onSelect, activeComponent }: ComponentSelectorProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 shadow-lg">
      <h3 className="text-white text-sm font-semibold mb-2 px-2">Components</h3>
      <div className="space-y-1">
        {components.map((component) => (
          <Button
            key={component.name}
            variant={activeComponent === component.path ? "secondary" : "ghost"}
            className={`w-full justify-start gap-2 ${
              activeComponent === component.path
                ? 'bg-gray-600'
                : 'hover:bg-gray-700'
            }`}
            onClick={() => onSelect(component)}
          >
            {component.icon}
            <span className="text-sm">{component.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
