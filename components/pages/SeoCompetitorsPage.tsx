
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Globe, Users, Search } from 'lucide-react';

const SeoCompetitorsPage: React.FC = () => {
  // Empty data
  const data: any[] = [];
  const trafficData: any[] = [];

  return (
    <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Bataille de Mots-clés</h3>
                <p className="text-gray-500 text-sm">Nombre de mots-clés positionnés dans le Top 10 Google.</p>
            </div>
            
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Analyse SEO concurrentielle en attente.</p>
                    <p className="text-xs">Ajoutez des concurrents pour voir les écarts de mots-clés.</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sources de Trafic Comparées */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center min-h-[200px]">
                <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-indigo-600 mr-2" />
                    <h3 className="font-bold text-gray-800">Sources de Trafic</h3>
                </div>
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
                    Pas de données suffisantes.
                </div>
            </div>

            {/* Chevauchement de Contenu */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center min-h-[200px]">
                <Globe className="w-12 h-12 text-gray-200 mb-4 bg-gray-50 p-2 rounded-full" />
                <h3 className="font-bold text-gray-800 mb-2">Chevauchement de Contenu</h3>
                <p className="text-sm text-gray-500">
                    Analyse sémantique non disponible.
                </p>
            </div>
        </div>
    </div>
  );
};

export default SeoCompetitorsPage;
