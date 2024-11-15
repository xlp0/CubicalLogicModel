"use client";

import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
      <h2 className="text-4xl font-bold mb-4">Current Time</h2>
      <div className="text-6xl font-mono">
        {time.toLocaleTimeString()}
      </div>
      <div className="mt-4 text-xl">
        {time.toLocaleDateString()}
      </div>
    </div>
  );
}