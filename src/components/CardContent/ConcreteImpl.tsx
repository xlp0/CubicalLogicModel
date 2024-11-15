"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ConcreteImpl() {
  const [inputs, setInputs] = useState("Templates, multimedia content, automation tools, and more.");
  const [activities, setActivities] = useState("Content presentation automation, real-time feedback collection, and content organization.");
  const [outputs, setOutputs] = useState("Interactive digital exhibits, insights dashboard, and automated updates.");

  const clearFields = () => {
    setInputs("Templates, multimedia content, automation tools, and more.");
    setActivities("Content presentation automation, real-time feedback collection, and content organization.");
    setOutputs("Interactive digital exhibits, insights dashboard, and automated updates.");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-8">
      <div className="w-full max-w-md bg-gray-700 rounded-xl p-4">
        <div className="text-white text-center text-2xl mb-4">
          Concrete Implementation
        </div>
        <table className="w-full text-center text-white">
          <thead>
            <tr>
              <th className="p-2 bg-gray-800 rounded-t-lg">Inputs</th>
              <th className="p-2 bg-gray-800 rounded-t-lg">Activities</th>
              <th className="p-2 bg-gray-800 rounded-t-lg">Outputs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 bg-gray-900 rounded-b-lg">{inputs}</td>
              <td className="p-2 bg-gray-900 rounded-b-lg">{activities}</td>
              <td className="p-2 bg-gray-900 rounded-b-lg">{outputs}</td>
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
