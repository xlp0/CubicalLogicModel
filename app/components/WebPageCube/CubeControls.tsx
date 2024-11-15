"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CubeControlsProps {
  onToggleRotation: () => void;
  isRotating: boolean;
  onSpeedChange: (value: number[]) => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onZoom: (direction: 'in' | 'out') => void;
  onResetRotation: () => void;
}

export default function CubeControls({
  onToggleRotation,
  isRotating,
  onSpeedChange,
  onMove,
  onZoom,
  onResetRotation,
}: CubeControlsProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 p-4 rounded-lg flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <Button
          onClick={onToggleRotation}
          variant={isRotating ? "destructive" : "default"}
        >
          {isRotating ? "Stop Rotation" : "Start Rotation"}
        </Button>
        <Button
          onClick={onResetRotation}
          variant="outline"
          size="icon"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white">Rotation Angle</label>
        <div className="w-48">
          <Slider
            defaultValue={[1]}
            min={0}
            max={10}
            step={0.1}
            onChange={onSpeedChange}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={() => onZoom('out')}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onZoom('in')}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}