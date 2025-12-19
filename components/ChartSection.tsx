import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartDataPoint } from '../types';

const data: ChartDataPoint[] = [
  { name: 'Lun', maps: 400, search: 240 },
  { name: 'Mar', maps: 300, search: 139 },
  { name: 'Mer', maps: 200, search: 580 },
  { name: 'Jeu', maps: 278, search: 390 },
  { name: 'Ven', maps: 189, search: 480 },
  { name: 'Sam', maps: 239, search: 380 },
  { name: 'Dim', maps: 349, search: 430 },
];

const ChartSection: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 bg-white shadow-sm rounded-xl border border-gray-100 h-80 sm:h-96 flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Performance Visibilité</h3>
        <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-primary-500 focus:border-primary-500 p-1 border bg-transparent">
            <option>7 jours</option>
            <option>30 jours</option>
        </select>
      </div>
      
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMaps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
            />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
            />
            <Area 
                type="monotone" 
                dataKey="maps" 
                stroke="#2563EB" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorMaps)" 
                name="Vues Maps"
                animationDuration={1500}
            />
            <Area 
                type="monotone" 
                dataKey="search" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSearch)" 
                name="Vues Recherche"
                animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center justify-center mt-4 space-x-6 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center">
            <span className="w-3 h-3 bg-primary-600 rounded-full mr-2"></span>
            Vues Maps
        </div>
        <div className="flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Recherche
        </div>
      </div>
    </div>
  );
};

export default ChartSection;