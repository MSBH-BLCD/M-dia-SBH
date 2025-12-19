
import React, { useEffect, useState } from 'react';
import { Phone, Map as MapIcon, MousePointer, Loader2, Search, ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface SerpRow {
  keyword: string;
  position: number | null;
  volume: number | null;
  change: number | null;
}

const GmbPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ calls: 0, directions: 0, clicks: 0 });
  const [loading, setLoading] = useState(true);
  const [serpRows, setSerpRows] = useState<SerpRow[]>([]);
  const [hasKeywords, setHasKeywords] = useState(false);
  const [serpError, setSerpError] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: gmbData } = await supabase.from('seo_metrics').select('calls, direction_requests, website_clicks').eq('user_id', user.id).eq('source', 'gmb').order('date', { ascending: false }).limit(1).single();
        if (gmbData) setMetrics({ calls: gmbData.calls || 0, directions: gmbData.direction_requests || 0, clicks: gmbData.website_clicks || 0 });
        const { data: seoKeywords } = await supabase.from('seo_focus_keywords').select('keyword_1, keyword_2, keyword_3').eq('user_id', user.id).maybeSingle();
        const focusKeywords = [seoKeywords?.keyword_1, seoKeywords?.keyword_2, seoKeywords?.keyword_3].filter(k => k && k.trim() !== '') as string[];
        if (focusKeywords.length > 0) {
            setHasKeywords(true);
            const { data: serpMetrics } = await supabase.from('local_serp_metrics').select('keyword, position, search_volume, change').eq('user_id', user.id).in('keyword', focusKeywords).order('date', { ascending: false });
            const metricsMap = new Map();
            serpMetrics?.forEach(m => { if (!metricsMap.has(m.keyword)) metricsMap.set(m.keyword, m); });
            setSerpRows(focusKeywords.map(kw => { const m = metricsMap.get(kw); return { keyword: kw, position: m?.position ?? null, volume: m?.search_volume ?? null, change: m?.change ?? null }; }));
        } else setHasKeywords(false);
      } catch (e) { setSerpError(true); } finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-8 text-center flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4"><Phone className="w-6 h-6" /></div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.calls}</h3><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Appels générés</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4"><MapIcon className="w-6 h-6" /></div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.directions}</h3><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Demandes d'itinéraire</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4"><MousePointer className="w-6 h-6" /></div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{metrics.clicks}</h3><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Clics vers site</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center bg-white"><Search className="w-5 h-5 mr-3 text-indigo-500"/><h3 className="font-bold text-gray-800">Suivi des Requêtes (SERP Local)</h3></div>
          {!hasKeywords ? (
              <div className="p-12 text-center text-gray-500 bg-white"><TrendingUp className="w-10 h-10 mx-auto text-gray-200 mb-3" /><p className="font-bold text-gray-400">Aucun mot-clé suivi</p><p className="text-xs mt-1">Configurez-les dans Réglages > Stratégie.</p></div>
          ) : (
              <div className="overflow-x-auto"><table className="w-full text-left bg-white">
                  <thead className="bg-gray-50 text-gray-400 text-[10px] font-bold uppercase tracking-widest"><tr><th className="px-6 py-4">Mot-clé</th><th className="px-6 py-4 text-center">Position</th><th className="px-6 py-4 text-center">Volume</th><th className="px-6 py-4 text-center">Évolution</th></tr></thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                      {serpRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-bold text-gray-700">{row.keyword}</td>
                              <td className="px-6 py-4 text-center">{row.position !== null ? <span className={`px-3 py-1 rounded-full font-bold ${row.position <= 3 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{row.position}</span> : <span className="text-gray-300">--</span>}</td>
                              <td className="px-6 py-4 text-center text-gray-600">{row.volume || <span className="text-gray-300">--</span>}</td>
                              <td className="px-6 py-4 text-center">{row.change !== null ? <div className={`flex items-center justify-center font-bold ${row.change > 0 ? 'text-green-600' : row.change < 0 ? 'text-red-600' : 'text-gray-300'}`}>{row.change > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : row.change < 0 ? <ArrowDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1"/>}{Math.abs(row.change)}</div> : <span className="text-gray-300">--</span>}</td>
                          </tr>
                      ))}
                  </tbody>
              </table></div>
          )}
      </div>
    </div>
  );
};

export default GmbPerformancePage;
