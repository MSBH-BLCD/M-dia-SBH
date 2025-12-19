
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Link as LinkIcon, AlertTriangle, Globe, Search, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const SeoNetlinkingPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ da: 0, backlinks: 0, spam: 0 });
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');

  useEffect(() => {
      if(!user) return;
      const fetchMetrics = async () => {
          const { data } = await supabase.from('seo_metrics').select('*').eq('user_id', user.id).single();
          if(data) setMetrics({ da: data.domain_authority, backlinks: data.backlinks, spam: data.spam_score });
          const { data: profile } = await supabase.from('profiles').select('website').eq('id', user.id).single();
          if (profile?.website) setDomain(profile.website);
          setLoading(false);
      };
      fetchMetrics();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-2">Analyse de Netlinking</label>
          <div className="flex gap-3">
              <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={domain} onChange={e => setDomain(e.target.value)} type="text" placeholder="ex: mon-entreprise.com" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" />
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center shadow-lg shadow-blue-100"><Search className="w-4 h-4 mr-2" /> Analyser</button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Domain Authority</p><h3 className="text-3xl font-bold text-gray-900 mt-1">{metrics.da}<span className="text-sm text-gray-300 font-normal">/100</span></h3></div>
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100"><ShieldCheck className="w-7 h-7 text-blue-600" /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Backlinks</p><h3 className="text-3xl font-bold text-gray-900 mt-1">{metrics.backlinks}</h3></div>
                <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100"><LinkIcon className="w-7 h-7 text-indigo-600" /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Spam Score</p><h3 className="text-3xl font-bold text-gray-900 mt-1">{metrics.spam}<span className="text-sm text-gray-300 font-normal">%</span></h3></div>
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center border border-green-100"><AlertTriangle className="w-7 h-7 text-green-600" /></div>
            </div>
        </div>
        
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6"><LinkIcon className="w-10 h-10 text-blue-600" /></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Marketplace de Backlinks</h3>
            <p className="text-gray-500 max-w-md mx-auto">Propulsez votre référencement en achetant des liens sur des sites à fort trafic. Cette fonctionnalité sera disponible prochainement.</p>
        </div>
    </div>
  );
};

export default SeoNetlinkingPage;
