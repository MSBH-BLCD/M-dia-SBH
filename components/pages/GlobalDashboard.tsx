import React, { useEffect, useState } from 'react';
import { Target, Users, MousePointer, MessageSquare, Calendar, ArrowRight, Store, Star } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface GlobalDashboardProps {
  onNavigate: (tab: string) => void;
}

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profileName, setProfileName] = useState('');
  
  // Data State
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial State (Zero/Empty)
  const [stats, setStats] = useState({
      views: 0,
      interactions: 0,
      score: 0,
  });

  const emptyData = [
    { name: 'Lun', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Mer', value: 0 },
    { name: 'Jeu', value: 0 },
    { name: 'Ven', value: 0 },
    { name: 'Sam', value: 0 },
    { name: 'Dim', value: 0 },
  ];

  useEffect(() => {
    if (user) {
        const fetchData = async () => {
            // Fetch Name
            const { data: profile } = await supabase.from('profiles').select('business_name').eq('id', user.id).single();
            if (profile?.business_name) setProfileName(profile.business_name);
            else setProfileName("Entrepreneur");
            
            // Fetch Recent Posts from consolidated table 'social_posts'
            const { data: posts } = await supabase
                .from('social_posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);
            if (posts) setRecentPosts(posts);

            // Fetch Recent Reviews
            const { data: reviews } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(2);
            if (reviews) setRecentReviews(reviews);

            setLoading(false);
        };
        fetchData();
    }
  }, [user]);

  return (
    <div className="space-y-8">
        {/* HERO ROI SECTION - FULL LIGHT MODE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-full bg-white rounded-2xl p-8 text-gray-900 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Bonjour, {profileName} 👋</h2>
                    <p className="text-gray-500 mb-8">Bienvenue sur votre tableau de bord. Pilotez toute votre visibilité d'ici.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="p-5 bg-white rounded-xl border border-blue-100 shadow-sm">
                            <p className="text-blue-600 text-sm font-bold mb-1 uppercase tracking-wider">Vues Totales</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.views}</p>
                        </div>
                        <div className="p-5 bg-white rounded-xl border border-pink-100 shadow-sm">
                            <p className="text-pink-600 text-sm font-bold mb-1 uppercase tracking-wider">Interactions</p>
                            <p className="text-3xl font-extrabold text-gray-900">{stats.interactions}</p>
                        </div>
                        <div className="p-5 bg-white rounded-xl border border-indigo-100 shadow-sm">
                            <p className="text-indigo-600 text-sm font-bold mb-1 uppercase tracking-wider">Score Global</p>
                            <div className="flex items-center">
                                <p className="text-3xl font-extrabold text-gray-900">{stats.score}<span className="text-gray-300 text-lg">/100</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Abstract Decoration */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-50 rounded-full opacity-30 blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>
        </div>

        {/* CONTENT OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Posts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center"><Calendar className="w-5 h-5 mr-2 text-pink-500"/> Prochaines Publications</h3>
                    <button onClick={() => onNavigate('meta-calendar')} className="text-sm text-blue-600 hover:underline">Voir calendrier</button>
                </div>
                
                {recentPosts.length > 0 ? (
                    <div className="space-y-4">
                        {recentPosts.map(post => (
                            <div key={post.id} className="flex items-center p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {post.image_url ? (
                                        <img src={post.image_url} className="w-full h-full object-cover" alt="Post"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"></div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-bold text-gray-800 line-clamp-1">{post.content || 'Sans titre'}</p>
                                    <p className="text-xs text-gray-500 flex items-center mt-1">
                                        <span className={`w-2 h-2 rounded-full mr-2 ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        {post.status === 'published' ? 'Publié' : 'Programmé'} • {new Date(post.scheduled_at || post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-[10px] font-bold uppercase text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">{post.platform}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">Aucune publication programmée.</p>
                    </div>
                )}
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center"><MessageSquare className="w-5 h-5 mr-2 text-yellow-500"/> Derniers Avis</h3>
                    <button onClick={() => onNavigate('gmb-reviews')} className="text-sm text-blue-600 hover:underline">Voir tout</button>
                </div>

                {recentReviews.length > 0 ? (
                    <div className="space-y-4">
                        {recentReviews.map(review => (
                            <div key={review.id} className="p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mr-3 border border-blue-100">
                                            {review.author?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{review.author}</p>
                                            <div className="flex text-yellow-400">
                                                {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}/>)}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{review.content}</p>
                                <button onClick={() => onNavigate('gmb-reviews')} className="text-xs font-bold text-blue-600 hover:underline flex items-center">
                                    Répondre <ArrowRight className="w-3 h-3 ml-1"/>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
                            <Store className="w-6 h-6 text-gray-400"/>
                        </div>
                        <p className="text-gray-500 text-sm mb-1">Aucun avis reçu pour le moment.</p>
                        <p className="text-xs text-gray-400">Connectez votre fiche Google pour synchroniser.</p>
                    </div>
                )}
            </div>
        </div>

        {/* MODULES PERFORMANCE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GMB */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Target className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-800">Google Business</h3>
                    </div>
                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-full">EN ATTENTE</span>
                </div>
                <div className="h-24 mb-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={emptyData}>
                            <defs>
                                <linearGradient id="colorGmb" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} fill="url(#colorGmb)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div>
                        <p className="text-xs text-gray-500">Appels générés</p>
                        <p className="text-lg font-bold text-gray-900">0</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Demandes d'iti.</p>
                        <p className="text-lg font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>

            {/* SOCIAL */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-800">Social</h3>
                    </div>
                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-full">EN ATTENTE</span>
                </div>
                <div className="relative z-10">
                    <p className="text-sm text-gray-600 mb-4">Aucune donnée récente.</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Abonnés: -</span>
                        <span className="text-gray-400 flex items-center">-</span>
                    </div>
                </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <MousePointer className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-800">SEO & Blog</h3>
                    </div>
                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs font-bold rounded-full">EN ATTENTE</span>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mots-clés Top 3</span>
                        <span className="font-bold text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Domain Authority</span>
                        <span className="font-bold text-gray-900">-</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GlobalDashboard;