import React, { useState } from 'react';
import ReviewsList from '../ReviewsList';
import { Search } from 'lucide-react';

interface ReviewsPageProps {
    showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const ReviewsPage: React.FC<ReviewsPageProps> = ({ showToast }) => {
  const [filter, setFilter] = useState<'all' | 'unanswered'>('all');

  return (
    <div className="h-full flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex space-x-2">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === 'all' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    Tous les avis
                </button>
                <button 
                    onClick={() => setFilter('unanswered')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center ${filter === 'unanswered' ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    À répondre
                </button>
            </div>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Rechercher un avis..." 
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none w-full sm:w-64 bg-white text-gray-900"
                />
            </div>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <ReviewsList onReplySent={(msg) => showToast(msg, 'success')} />
        </div>
    </div>
  );
};

export default ReviewsPage;