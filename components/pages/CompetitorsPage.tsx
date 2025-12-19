
import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import CompetitorTable from '../CompetitorTable';
import { Plus, Search, Trash2, TrendingUp, Users } from 'lucide-react';

const CompetitorsPage: React.FC = () => {
  const [queries, setQueries] = useState<string[]>([]);
  const [newQuery, setNewQuery] = useState('');

  // Empty data for radar chart to show "No Data" state
  const radarData: any[] = []; 

  const handleAddQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim() && queries.length < 3) {
        setQueries([...queries, newQuery.trim()]);
        setNewQuery('');
    }
  };

  const removeQuery = (index: number) => {
    const newQueries = [...queries];
    newQueries.splice(index, 1);
    setQueries(newQueries);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Chart & Queries Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Radar Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyse Comparative</h3>
                <p className="text-sm text-gray-500 mb-6">Vos performances face à la concurrence.</p>
                
                <div className="flex-1 min-h-[250px] flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 text-center px-4">
                        Configurez vos concurrents dans la liste pour voir l'analyse radar.
                    </p>
                </div>
            </div>

            {/* Queries Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Mes Requêtes</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{queries.length}/3</span>
                </div>
                
                <form onSubmit={handleAddQuery} className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input 
                            type="text" 
                            value={newQuery}
                            onChange={(e) => setNewQuery(e.target.value)}
                            disabled={queries.length >= 3}
                            placeholder="Ex: Coiffeur Lyon..." 
                            className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!newQuery.trim() || queries.length >= 3}
                        className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </form>

                <div className="space-y-2">
                    {queries.map((query, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group border border-transparent hover:border-gray-200 transition-all">
                            <div className="flex items-center">
                                <TrendingUp className="w-3 h-3 text-green-500 mr-2" />
                                <span className="text-sm text-gray-700 font-medium">{query}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-xs font-bold text-gray-900 mr-3">--</span>
                                <button onClick={() => removeQuery(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {queries.length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-4">Aucune requête suivie. Ajoutez des mots-clés pour suivre votre positionnement.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2 h-full">
             <CompetitorTable />
        </div>
    </div>
  );
};

export default CompetitorsPage;
