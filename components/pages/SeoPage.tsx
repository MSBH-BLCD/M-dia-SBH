
import React, { useState, useEffect } from 'react';
import { FileText, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const SeoPage: React.FC<{ showToast: any }> = ({ showToast }) => {
    const { user } = useAuth();
    const [articles, setArticles] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;
        const fetchArticles = async () => {
            const { data } = await supabase.from('seo_articles').select('*').order('created_at', { ascending: false });
            if(data) setArticles(data);
        };
        fetchArticles();
    }, [user]);

    return (
        <div className="flex flex-col h-full">
            {/* LIST: GENERATED ARTICLES */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600"/> Articles Générés
                    </h3>
                    <span className="text-xs font-normal text-gray-500">{articles.length} articles</span>
                </div>
                
                <div className="divide-y divide-gray-100 overflow-y-auto custom-scrollbar flex-1">
                    {articles.length === 0 ? (
                        <div className="p-20 text-center text-gray-400">
                            <p>Aucun article généré.</p>
                            <p className="text-sm mt-2">Vos articles apparaîtront ici une fois produits par l'assistant.</p>
                        </div>
                    ) : (
                        articles.map(art => (
                            <div key={art.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group flex items-center justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <h5 className="font-bold text-gray-900 text-base mr-3">{art.title || art.keyword}</h5>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                                            art.status === 'published' ? 'bg-green-100 text-green-700' : 
                                            art.status === 'draft' ? 'bg-gray-100 text-gray-700' : 
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {art.status === 'processing' ? 'En cours' : art.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <span className="mr-4">Mot-clé : {art.keyword}</span>
                                        <span>{new Date(art.created_at).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <div className="flex items-center text-sm text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <LinkIcon className="w-4 h-4 mr-1"/> Voir le contenu
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeoPage;
