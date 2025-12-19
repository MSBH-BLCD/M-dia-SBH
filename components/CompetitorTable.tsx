import React, { useState, useEffect } from 'react';
import { Trophy, Star, Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const CompetitorTable: React.FC = () => {
  const { user } = useAuth();
  const [competitors, setCompetitors] = useState<any[]>([]);

  useEffect(() => {
      if(!user) return;
      const fetchComp = async () => {
          const { data } = await supabase.from('competitors').select('*');
          if(data) setCompetitors(data);
      };
      fetchComp();
  }, [user]);

  if (competitors.length === 0) return (
      <div className="p-6 bg-white rounded-xl border border-gray-200 h-full flex items-center justify-center text-gray-500 text-sm">
          Aucun concurrent ajouté. Configurez votre zone.
      </div>
  );

  return (
    <div className="p-5 sm:p-6 bg-white shadow-sm rounded-xl border border-gray-100 h-full flex flex-col">
       <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Radar Concurrentiel</h3>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
            <Users className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto flex-1 no-scrollbar">
        <table className="w-full min-w-[300px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom</th>
              <th className="pb-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">Note</th>
              <th className="pb-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Avis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {competitors.map((comp, idx) => (
              <tr key={comp.id} className="group">
                <td className="py-4 pl-2">
                  <div className="flex items-center">
                    <span className={`text-sm font-medium truncate max-w-[100px] sm:max-w-none text-gray-700`}>
                        {comp.name}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-100">
                    <span className="text-sm font-bold mr-1">{comp.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                </td>
                <td className="py-4 text-right pr-2">
                  <span className="text-sm text-gray-600">{comp.review_count}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompetitorTable;