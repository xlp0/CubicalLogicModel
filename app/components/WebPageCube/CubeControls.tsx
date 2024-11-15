"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RotateCw, Pause, Play, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut } from "lucide-react";

interface CubeControlsProps {
  isRotating: boolean;
  onToggleRotation: () => void;
  onResetRotation: () => void;
  onSpeedChange: (value: number[]) => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onZoom: (direction: 'in' | 'out') => void;
}

export default function CubeControls({
  isRotating,
  onToggleRotation,
  onResetRotation,
  onSpeedChange,
  onMove,
  onZoom,
}: CubeControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 bg-black/20 backdrop-blur-sm p-4 rounded-lg z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleRotation}
          className="bg-white/10 hover:bg-white/20"
        >
          {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onResetRotation}
          className="bg-white/10 hover:bg-white/20"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
        <div className="w-48">
          <Slider
            defaultValue={[10]}
            max={50}
            step={1}
            onValueChange={onSpeedChange}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMove('up')}
          className="bg-white/10 hover:bg-white/20"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <div />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMove('left')}
          className="bg-white/10 hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMove('down')}
          className="bg-white/10 hover:bg-white/20"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMove('right')}
          className="bg-white/10 hover:bg-white/20"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onZoom('out')}
          className="bg-white/10 hover:bg-white/20"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onZoom('in')}
          className="bg-white/10 hover:bg-white/20"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}