"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AbstractSpec() {
  const [context, setContext] = useState("There is great demand in Knowledge Management.");
  const [goal, setGoal] = useState("Facilitate CI/CD for content updates.");
  const [successCriteria, setSuccessCriteria] = useState("Provide real-time tracking and automated updates.");

  const clearFields = () => {
    setContext("EuMuse-pkc is a backend platform for creating and managing digital museums.");
    setGoal("Facilitate continuous integration and deployment for content updates.");
    setSuccessCriteria("Provide real-time tracking and automated updates for exhibits.");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <div className="w-full max-w-md bg-gray-700 rounded-xl p-4">
        <div className="text-white text-center text-2xl mb-4">
          Abstract Specification
        </div>
        <table className="w-full text-left text-white">
          <tbody>
            <tr>
              <th className="p-2 bg-gray-800 rounded-lg">Context</th>
              <td className="p-2 bg-gray-900 rounded-lg">{context}</td>
            </tr>
            <tr>
              <th className="p-2 bg-gray-800 rounded-lg">Goal</th>
              <td className="p-2 bg-gray-900 rounded-lg">{goal}</td>
            </tr>
            <tr>
              <th className="p-2 bg-gray-800 rounded-lg">Success Criteria</th>
              <td className="p-2 bg-gray-900 rounded-lg">{successCriteria}</td>
            </tr>
          </tbody>
        </table>
        <Button
          onClick={clearFields}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Reset to Default
        </Button>
      </div>
    </div>
  );
}
