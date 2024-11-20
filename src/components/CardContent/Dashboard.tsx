"use client";

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const missionData = [
  { name: 'Jan', missions: 4, success: 3, resources: 85 },
  { name: 'Feb', missions: 6, success: 5, resources: 78 },
  { name: 'Mar', missions: 8, success: 7, resources: 92 },
  { name: 'Apr', missions: 5, success: 4, resources: 68 },
  { name: 'May', missions: 9, success: 8, resources: 95 },
  { name: 'Jun', missions: 7, success: 6, resources: 88 },
];

const resourceAllocation = [
  { subject: 'Fuel', A: 120, fullMark: 150 },
  { subject: 'Crew', A: 98, fullMark: 150 },
  { subject: 'Equipment', A: 86, fullMark: 150 },
  { subject: 'Research', A: 99, fullMark: 150 },
  { subject: 'Supplies', A: 85, fullMark: 150 },
  { subject: 'Maintenance', A: 65, fullMark: 150 },
];

const systemStatus = [
  { name: 'Life Support', value: 400 },
  { name: 'Navigation', value: 300 },
  { name: 'Communication', value: 300 },
  { name: 'Power', value: 200 },
];

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col gap-4 bg-gradient-to-br from-gray-900 to-blue-900 p-6 overflow-y-auto">
      <div className="text-white text-2xl font-bold text-center mb-4">
        Space Station Dashboard
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Mission Success Rate */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white text-lg mb-2">Mission Success Rate</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={missionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="missions" stroke="#8884d8" />
              <Line type="monotone" dataKey="success" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Usage */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white text-lg mb-2">Resource Usage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={missionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Area type="monotone" dataKey="resources" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Resource Allocation */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white text-lg mb-2">Resource Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={resourceAllocation}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" stroke="#fff" />
              <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#fff" />
              <Radar name="Resources" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* System Status */}
        <div className="bg-gray-800 p-4 rounded-xl">
          <h3 className="text-white text-lg mb-2">System Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={systemStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
