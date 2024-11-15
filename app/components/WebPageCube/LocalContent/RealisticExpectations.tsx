"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RealisticExpectations() {
  const [practicalBoundaries, setPracticalBoundaries] = useState("Define the system's limitations and realistic constraints for implementation.");
  const [evaluationData, setEvaluationData] = useState("Collect relevant data to assess the effectiveness and performance of each feature.");
  const [validatedCases, setValidatedCases] = useState("Identify successful case studies to validate functionality and use cases.");

  const clearFields = () => {
    setPracticalBoundaries("Define the system's limitations and realistic constraints.");
    setEvaluationData("Collect relevant data to assess the effectiveness.");
    setValidatedCases("Identify successful case studies to validate functionality.");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <div className="w-full max-w-md bg-gray-700 rounded-xl p-4">
        <div className="text-white text-center text-2xl mb-4">
          Realistic Expectations
        </div>
        <table className="w-full text-left text-white">
          <tbody>
            <tr>
              <th className="p-2 bg-gray-800 rounded-lg">Practical Boundaries</th>
              <td className="p-2 bg-gray-900 rounded-lg">{practicalBoundaries}</td>
            </tr>
            <tr>
              <th className="p-2 bg-gray-800 rounded-lg">Evaluation Data</th>
              <td className="p-2 bg-gray-900 rounded-lg">{evaluationData}</td>
            </tr>
            <tr>
              <th className="p-2 bg-gray-800 rounded-lg">Validated Cases</th>
              <td className="p-2 bg-gray-900 rounded-lg">{validatedCases}</td>
            </tr>
          </tbody>
        </table>
        <Button
          onClick={clearFields}
          variant="destructive"
          className="w-full mt-4"
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
