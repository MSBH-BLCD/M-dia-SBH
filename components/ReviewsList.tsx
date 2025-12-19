
import React, { useState, useEffect } from 'react';
import { Star, Send, X, Loader2, MessageSquarePlus } from 'lucide-react';
import { apiService } from '../services/apiService';
import { WEBHOOK_URLS } from '../config/webhooks';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatar?: string;
  reply?: string;
  status: string;
}

interface ReviewsListProps {
    onReplySent: (message: string) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ onReplySent }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [instructions, setInstructions] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, we shouldn't attempt to fetch, but we also shouldn't be stuck in loading.
    if (!user) {
        setLoading(false);
        return;
    }

    const fetchReviews = async () => {
        try {
            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error("Error fetching reviews:", error);
                setReviews([]);
            } else if (data) {
                // Safe mapping to ensure no crashes
                const safeReviews = data.map((r: any) => ({
                    id: r.id,
                    author: r.author || 'Client Inconnu',
                    rating: typeof r.rating === 'number' ? r.rating : 5,
                    date: r.created_at ? new Date(r.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
                    content: r.content || '',
                    avatar: r.avatar_url,
                    reply: r.reply,
                    status: r.status || 'pending'
                }));
                setReviews(safeReviews);
            } else {
                setReviews([]);
            }
        } catch (err) {
            console.error("Unexpected error fetching reviews:", err);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };
    
    fetchReviews();
  }, [user]);

  const handleOpenReply = (review: Review) => {
    setReplyingTo(review.id);
    setInstructions(''); 
  };

  const handleSendInstructions = async (review: Review) => {
    setIsSending(true);

    const payload = {
        reviewId: review.id,
        reviewContent: review.content,
        reviewAuthor: review.author,
        rating: review.rating,
        replyInstructions: instructions || "Réponse standard polie.",
        timestamp: new Date().toISOString()
    };

    const result = await apiService.sendCommand(WEBHOOK_URLS.GMB_REVIEW_REPLY, payload);

    if (result.success) {
        // Optimistic update
        await supabase.from('reviews').update({ status: 'replied', reply: 'Instructions envoyées...' }).eq('id', review.id);
        setReviews(reviews.map(r => r.id === review.id ? { ...r, status: 'replied' } : r));
        
        onReplySent("Instructions envoyées !");
        setReplyingTo(null);
    } else {
        alert("Erreur: " + result.error);
    }

    setIsSending(false);
  };

  if (loading) return <div className="p-8 text-center flex justify-center items-center h-48"><Loader2 className="w-6 h-6 animate-spin text-gray-400"/></div>;

  return (
    <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-100 flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Derniers Avis</h3>
        <button className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors">Voir tout</button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-gray-300" />
                </div>
                <p>Aucun avis client pour le moment.</p>
                <p className="text-xs mt-2">Connectez votre fiche Google pour synchroniser.</p>
            </div>
        ) : (
            reviews.map((review) => (
            <div key={review.id} className="group">
                <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 text-xs shrink-0">
                    {review.author ? review.author.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{review.author}</h4>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{review.date}</span>
                    </div>
                    <div className="flex items-center my-1">
                    {[...Array(5)].map((_, i) => (
                        <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                    ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-2 break-words">{review.content}</p>
                    
                    {/* Actions Zone */}
                    <div className="mt-2">
                        {review.status !== 'replied' && replyingTo !== review.id && (
                            <button 
                                onClick={() => handleOpenReply(review)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                                <MessageSquarePlus className="w-3 h-3 mr-1.5" />
                                Répondre
                            </button>
                        )}

                        {replyingTo === review.id && (
                            <div className="mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100 animate-fade-in-up">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-blue-800">Consignes</span>
                                    <button onClick={() => setReplyingTo(null)} className="text-blue-400 hover:text-blue-600"><X className="w-3 h-3" /></button>
                                </div>
                                <textarea 
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    className="w-full text-sm p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-700 mb-2"
                                    rows={2}
                                    placeholder="Instructions pour l'assistant..."
                                />
                                <div className="flex justify-end space-x-2">
                                    <button 
                                        onClick={() => handleSendInstructions(review)}
                                        disabled={isSending}
                                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm disabled:opacity-70"
                                    >
                                        {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 mr-1.5" />}
                                        Envoyer
                                    </button>
                                </div>
                            </div>
                        )}

                        {review.status === 'replied' && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-lg inline-block">
                                <span className="inline-flex items-center text-xs text-green-700 font-medium">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                                    Répondu
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                </div>
                <div className="mt-4 border-b border-gray-50"></div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
