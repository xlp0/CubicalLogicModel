"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [firstNumber, setFirstNumber] = useState<number | null>(null);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperation = (op: string) => {
    setOperation(op);
    setFirstNumber(parseFloat(display));
    setDisplay('0');
  };

  const calculate = () => {
    if (firstNumber === null || !operation) return;
    const secondNumber = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+': result = firstNumber + secondNumber; break;
      case '-': result = firstNumber - secondNumber; break;
      case '×': result = firstNumber * secondNumber; break;
      case '÷': result = firstNumber / secondNumber; break;
    }

    setDisplay(result.toString());
    setOperation(null);
    setFirstNumber(null);
  };

  const clear = () => {
    setDisplay('0');
    setOperation(null);
    setFirstNumber(null);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <div className="w-full max-w-xs bg-gray-700 rounded-xl p-4">
        <div className="bg-gray-900 text-white text-right text-2xl p-4 rounded-lg mb-4">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
            <Button
              key={btn}
              onClick={() => {
                if (btn === '=') calculate();
                else if (['+', '-', '×', '÷'].includes(btn)) handleOperation(btn);
                else handleNumber(btn);
              }}
              variant={['÷', '×', '-', '+'].includes(btn) ? "secondary" : "default"}
              className="h-12"
            >
              {btn}
            </Button>
          ))}
          <Button
            onClick={clear}
            variant="destructive"
            className="col-span-4 mt-2"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}