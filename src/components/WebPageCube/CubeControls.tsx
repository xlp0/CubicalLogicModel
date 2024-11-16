import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CubeControlsProps {
  onToggleRotation: () => void;
  isRotating: boolean;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onZoom: (direction: 'in' | 'out') => void;
  onResetRotation: () => void;
}

export default function CubeControls({
  onToggleRotation,
  isRotating,
  onMove,
  onZoom,
  onResetRotation,
}: CubeControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 bg-black/70 p-4 rounded-lg flex flex-col items-center gap-4 backdrop-blur-sm">
      <div className="flex gap-2">
        <Button
          onClick={onToggleRotation}
          variant={isRotating ? "destructive" : "default"}
          className={`text-white hover:text-white ${isRotating ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isRotating ? "Stop Rotation" : "Start Rotation"}
        </Button>
        <Button
          onClick={onResetRotation}
          variant="outline"
          size="icon"
          className="border-white hover:border-white border-2 bg-black/50"
        >
          <RotateCcw className="h-4 w-4 text-white" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="border-white hover:border-white border-2 bg-black/50"
          onClick={() => onZoom('out')}
        >
          <ZoomOut className="h-4 w-4 text-white" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-white hover:border-white border-2 bg-black/50"
          onClick={() => onZoom('in')}
        >
          <ZoomIn className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
}