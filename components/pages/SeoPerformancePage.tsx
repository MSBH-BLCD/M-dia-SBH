
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MousePointer, Search, ArrowUpRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface ChartData {
  date: string;
  impressions: number;
}

interface KeywordData {
  keyword: string;
  position: number;
  volume: number;
  change: number;
}

const SeoPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [summary, setSummary] = useState({
    impressions: 0,
    ctr: 0,
  });

  useEffect(() => {
    if (!user) return;

    const fetchSeoData = async () => {
      try {
        const { data, error } = await supabase
          .from('search_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (data && data.length > 0) {
          // 1. Process Chart Data (Aggregate impressions by date)
          const dateMap = new Map<string, number>();
          let totalImpressions = 0;
          let totalCtr = 0;
          let ctrCount = 0;

          // Pour les mots-clés, on prend ceux qui ont une valeur 'keyword' non nulle
          const rawKeywords: KeywordData[] = [];

          data.forEach(row => {
            const dateStr = new Date(row.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
            
            // Chart aggregation
            const currentImp = dateMap.get(dateStr) || 0;
            dateMap.set(dateStr, currentImp + (row.impressions || 0));

            // Summary totals
            totalImpressions += row.impressions || 0;
            if (row.ctr) {
              totalCtr += Number(row.ctr);
              ctrCount++;
            }

            // Keyword collection (filtering rows that represent specific queries)
            if (row.keyword) {
              rawKeywords.push({
                keyword: row.keyword,
                position: row.position || 0,
                volume: row.volume || 0,
                change: row.change || 0
              });
            }
          });

          // Finalize Chart Data
          const finalChartData = Array.from(dateMap.entries()).map(([date, imp]) => ({
            date: date,
            impressions: imp
          }));
          setChartData(finalChartData);

          // Finalize Summary
          setSummary({
            impressions: totalImpressions,
            ctr: ctrCount > 0 ? parseFloat((totalCtr / ctrCount).toFixed(2)) : 0
          });

          // Finalize Keywords (Sort by volume or position, take top 10 unique most recent if logic allowed, here simpler filter)
          // On trie par volume décroissant pour l'affichage
          setKeywords(rawKeywords.sort((a, b) => b.volume - a.volume).slice(0, 10));

        } else {
          // No data state
          setChartData([]);
          setKeywords([]);
          setSummary({ impressions: 0, ctr: 0 });
        }
      } catch (err) {
        console.error("Erreur chargement SEO:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoData();
  }, [user]);

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></div>;

  return (
    <div className="space-y-6">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800">Trafic Organique (Site Web)</h3>
                </div>
                <div className="h-72 flex items-center justify-center">
                     {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorOrganic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius:'8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="impressions" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorOrganic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     ) : (
                        <p className="text-gray-400 text-sm">En attente de connexion à Google Search Console pour afficher les performances SEO.</p>
                     )}
                </div>
            </div>

            {/* Top Stats */}
            <div className="flex flex-col gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-2 text-gray-500">
                        <MousePointer className="w-5 h-5" />
                        <span className="font-medium">Taux de Clic (CTR)</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{chartData.length > 0 ? `${summary.ctr}%` : '--'}</p>
                    <p className="text-sm text-gray-400 mt-1">Moyenne</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-2 text-gray-500">
                        <Search className="w-5 h-5" />
                        <span className="font-medium">Impressions</span>
                    </div>
                    <p className="text-4xl font-bold text-gray-900">{chartData.length > 0 ? summary.impressions : '0'}</p>
                    <p className="text-sm text-green-600 mt-1 flex items-center">Total période</p>
                </div>
            </div>
         </div>

         {/* Keywords Table */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Top Mots-Clés</h3>
            </div>
            <div className="overflow-x-auto">
                {keywords.length > 0 ? (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Requête</th>
                                <th className="px-6 py-3 font-semibold text-center">Position</th>
                                <th className="px-6 py-3 font-semibold text-center">Volume</th>
                                <th className="px-6 py-3 font-semibold text-center">Changement</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {keywords.map((kw, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{kw.keyword}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded font-bold ${kw.position <= 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{kw.position}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600">{kw.volume}</td>
                                    <td className={`px-6 py-4 text-center font-bold ${kw.change > 0 ? 'text-green-600' : kw.change < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                        {kw.change > 0 ? `+${kw.change}` : kw.change}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        Aucun mot-clé disponible pour le moment.
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};

export default SeoPerformancePage;
