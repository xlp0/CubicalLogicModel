"use client";

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

export default function ColorPicker() {
  const [rgb, setRgb] = useState({ r: 100, g: 100, b: 100 });

  return (
    <div 
      className="h-full flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
    >
      <div className="bg-white/90 rounded-lg p-6 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6">XYZ</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Red: {rgb.r}</label>
            <Slider
              value={[rgb.r]}
              max={255}
              step={1}
              onValueChange={(value) => setRgb(prev => ({ ...prev, r: value[0] }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Green: {rgb.g}</label>
            <Slider
              value={[rgb.g]}
              max={255}
              step={1}
              onValueChange={(value) => setRgb(prev => ({ ...prev, g: value[0] }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Blue: {rgb.b}</label>
            <Slider
              value={[rgb.b]}
              max={255}
              step={1}
              onValueChange={(value) => setRgb(prev => ({ ...prev, b: value[0] }))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}