import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ThreeJsControlsProps {
  isRotating: boolean;
  onToggleRotation: () => void;
  onResetView: () => void;
  onZoom: (direction: 'in' | 'out') => void;
}

export default function ThreeJsControls({
  isRotating,
  onToggleRotation,
  onResetView,
  onZoom
}: ThreeJsControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-gray-800/80 p-2 rounded-lg backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleRotation}
        className="bg-gray-700 hover:bg-gray-600 text-white"
      >
        {isRotating ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onResetView}
        className="bg-gray-700 hover:bg-gray-600 text-white"
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      <div className="w-px h-6 bg-gray-600 mx-1 self-center" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoom('in')}
        className="bg-gray-700 hover:bg-gray-600 text-white"
      >
        <ZoomIn className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onZoom('out')}
        className="bg-gray-700 hover:bg-gray-600 text-white"
      >
        <ZoomOut className="h-5 w-5" />
      </Button>
    </div>
  );
}
