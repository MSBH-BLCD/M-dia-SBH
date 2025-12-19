import React from 'react';
import { KpiData } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  data: KpiData;
}

const StatCard: React.FC<StatCardProps> = ({ data }) => {
  return (
    <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${data.colorClass}`}>
          <data.icon className="w-6 h-6" />
        </div>
        {data.trend !== 'neutral' && (
          <div className={`flex items-center text-sm font-medium ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {data.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {data.change}%
          </div>
        )}
        {data.trend === 'neutral' && (
             <div className="flex items-center text-sm font-medium text-gray-400">
                <Minus className="w-4 h-4 mr-1" />
                0%
             </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{data.title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.value}</h3>
      </div>
    </div>
  );
};

export default StatCard;