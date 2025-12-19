
import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface Post {
  id: string;
  content: string;
  image: string;
  date: string;
  views: number;
  clicks: number;
  status: 'published' | 'scheduled' | 'draft';
  platform?: 'gmb' | 'facebook' | 'instagram' | 'pinterest' | 'linkedin';
}

const PostsPage: React.FC<{ showToast: any, type: 'gmb' | 'social' }> = ({ showToast, type }) => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchPosts();
    }, [user, type]);

    const fetchPosts = async () => {
        const platformFilter = type === 'gmb' ? ['gmb'] : ['facebook', 'instagram', 'pinterest', 'linkedin'];
        const { data } = await supabase
            .from('social_posts')
            .select('*')
            .in('platform', platformFilter)
            .order('scheduled_at', { ascending: false });
        
        if (data) {
            setPosts(data.map(p => ({
                id: p.id,
                content: p.content,
                image: p.image_url || 'https://via.placeholder.com/150',
                date: new Date(p.scheduled_at || p.created_at).toLocaleDateString(),
                views: p.stats_views || 0,
                clicks: p.stats_clicks || 0,
                status: p.status as any,
                platform: p.platform as any
            })));
        }
        setLoading(false);
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-gray-400"/></div>;

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* HEADER */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-bold text-gray-800">{type === 'gmb' ? 'Google Business Posts' : 'Calendrier Social'}</h2>
                </div>
            </div>

            {/* LIST CONTENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-100 relative group">
                            <img src={post.image} className="w-full h-full object-cover" alt="Post content" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                <button className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100"><Eye className="w-4 h-4"/></button>
                            </div>
                            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-white/90 text-[10px] font-bold uppercase text-gray-700 shadow-sm">
                                {post.platform}
                            </div>
                            <span className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {post.status === 'published' ? 'Publié' : 'Programmé'}
                            </span>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-800 line-clamp-3 mb-4 min-h-[60px]">{post.content}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
                                <div className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {post.date}</div>
                                <div className="flex space-x-3">
                                    <span>{post.views} vues</span>
                                    <span>{post.clicks} clics</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                        <p>Aucun post trouvé. Les contenus générés par l'assistant apparaîtront ici.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostsPage;
