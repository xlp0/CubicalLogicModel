"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RealisticExpectations() {
  const [practicalBoundaries, setPracticalBoundaries] = useState("Define system limitations and constraints.");
  const [evaluationData, setEvaluationData] = useState("Collect data to assess performance.");
  const [validatedCases, setValidatedCases] = useState("Identify successful case studies.");

  const clearFields = () => {
    setPracticalBoundaries("Define system limitations and constraints.");
    setEvaluationData("Collect data to assess performance.");
    setValidatedCases("Identify successful case studies.");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 transform-gpu">
      <div className="w-full h-full max-w-none bg-gray-700 rounded-lg p-3 flex flex-col">
        <div className="text-white text-center text-lg font-semibold mb-2">
          Realistic Expectations
        </div>
        <table className="w-full text-left text-white text-sm flex-grow">
          <tbody className="space-y-1">
            <tr>
              <th className="p-1.5 bg-gray-800 rounded-lg text-xs font-medium">Boundaries</th>
              <td className="p-1.5 bg-gray-900 rounded-lg text-xs">{practicalBoundaries}</td>
            </tr>
            <tr>
              <th className="p-1.5 bg-gray-800 rounded-lg text-xs font-medium">Evaluation</th>
              <td className="p-1.5 bg-gray-900 rounded-lg text-xs">{evaluationData}</td>
            </tr>
            <tr>
              <th className="p-1.5 bg-gray-800 rounded-lg text-xs font-medium">Validation</th>
              <td className="p-1.5 bg-gray-900 rounded-lg text-xs">{validatedCases}</td>
            </tr>
          </tbody>
        </table>
        <Button
          onClick={clearFields}
          className="w-full mt-2 text-xs py-1 bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
