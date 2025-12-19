
import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Eye, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const SocialPerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ likes: 0, comments: 0, shares: 0, reach: 0 });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchMetrics = async () => {
      try {
        // Récupération de la dernière période disponible pour l'utilisateur
        const { data, error } = await supabase
          .from('social_metrics')
          .select('likes_total, comments_total, shares_total, reach_total')
          .eq('user_id', user.id)
          .order('period_end', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 est l'erreur "row not found" si la table est vide, ce qui est normal au début
            console.error('Erreur Supabase Social Metrics:', error);
        }

        if (data) {
          setMetrics({
            likes: data.likes_total || 0,
            comments: data.comments_total || 0,
            shares: data.shares_total || 0,
            reach: data.reach_total || 0,
          });
          setHasData(true);
        } else {
          setHasData(false);
        }
      } catch (err) {
        console.error('Erreur inattendue stats social:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400"/></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Likes Totaux</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.likes}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Commentaires</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.comments}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Partages</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.shares}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 text-gray-500 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Portée (Reach)</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.reach}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 text-center text-gray-500">
          {hasData 
            ? "Données synchronisées avec vos réseaux sociaux." 
            : "En attente de données réelles."}
      </div>
    </div>
  );
};

export default SocialPerformancePage;
