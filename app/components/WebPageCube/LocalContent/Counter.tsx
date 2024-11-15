"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white p-8">
      <h2 className="text-4xl font-bold mb-8">Counter</h2>
      <div className="text-6xl font-bold mb-8">{count}</div>
      <div className="flex gap-4">
        <Button 
          onClick={() => setCount(prev => prev - 1)}
          variant="secondary"
          size="lg"
        >
          -1
        </Button>
        <Button 
          onClick={() => setCount(0)}
          variant="secondary"
          size="lg"
        >
          Reset
        </Button>
        <Button 
          onClick={() => setCount(prev => prev + 1)}
          variant="secondary"
          size="lg"
        >
          +1
        </Button>
      </div>
    </div>
  );
}