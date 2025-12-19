
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

const SocialCompetitorsPage: React.FC = () => {
  // Empty data for empty state
  const data: any[] = [];

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-2">Comparaison d'Audience</h3>
                 <p className="text-sm text-gray-500 mb-6">Volume d'abonnés par rapport à vos concurrents.</p>
                 <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="text-center text-gray-400">
                        <Users className="w-10 h-10 mx-auto mb-2 opacity-50"/>
                        <p>Aucune donnée concurrentielle.</p>
                        <p className="text-xs">Connectez vos réseaux pour comparer.</p>
                    </div>
                 </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Taux d'Engagement</h3>
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm">
                    <TrendingUp className="w-8 h-8 mb-2 opacity-50"/>
                    En attente de données.
                </div>
            </div>
        </div>
    </div>
  );
};

export default SocialCompetitorsPage;
