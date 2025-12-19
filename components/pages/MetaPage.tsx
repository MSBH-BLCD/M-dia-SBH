
import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Send, 
  Loader2, 
  Calendar, 
  X, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Hash 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { sendToWorkflow } from '../../services/api';
import { API_CONFIG } from '../../config';

// Icône Pinterest SVG custom car non dispo dans lucide standard parfois
const PinterestIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.852-2.433-4.587 0-3.728 2.703-7.161 7.761-7.161 4.064 0 7.229 2.893 7.229 6.756 0 4.021-2.535 7.272-6.066 7.272-1.183 0-2.312-.619-2.686-1.345l-.736 2.793c-.266 1.024-.986 2.296-1.465 3.072.934.288 1.956.445 3.022.445 6.6 0 11.953-5.367 11.953-11.987C23.97 5.367 18.62 0 12.017 0z" />
  </svg>
);

const MetaPage: React.FC<{ showToast: any, onNavigate: any }> = ({ showToast, onNavigate }) => {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Form State
    const [platforms, setPlatforms] = useState<string[]>(['instagram']);
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [isSending, setIsSending] = useState(false);

    const togglePlatform = (p: string) => {
        setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Preview URL
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            
            // Convert to Base64 for n8n
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendBrief = async () => {
        if (!user || platforms.length === 0 || !content) {
            showToast("Veuillez remplir le contenu et choisir une plateforme.", "error");
            return;
        }
        setIsSending(true);

        const payload = {
            intent: 'social',
            userId: user.id,
            platforms,
            content,
            imageBase64,
            scheduleDate: scheduleDate || 'now',
            timestamp: new Date().toISOString()
        };

        // 1. Send to Workflow (n8n)
        const apiResult = await sendToWorkflow(API_CONFIG.SOCIAL_WORKFLOW_URL, payload);

        if (apiResult.success) {
            // 2. Save Draft/Scheduled in Supabase for history
            const { error } = await supabase.from('social_posts').insert({
                user_id: user.id,
                content: content,
                platform: platforms[0], // Primary platform tag
                status: scheduleDate ? 'scheduled' : 'published',
                scheduled_at: scheduleDate || new Date().toISOString(),
                image_url: imagePreview, // In real app, upload to storage and get URL
                created_at: new Date()
            });

            if (!error) {
                showToast("Post envoyé au studio de production !", 'success');
                onNavigate('meta-calendar');
            } else {
                showToast("Commande envoyée mais erreur de sauvegarde historique.", 'info');
            }
        } else {
            showToast("Erreur de communication avec le serveur.", 'error');
        }

        setIsSending(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
            
            {/* LEFT: EDITOR */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 flex items-center">
                        <Hash className="w-5 h-5 mr-2 text-primary-600"/> Studio Social
                    </h2>
                    <span className="text-xs text-gray-400 font-mono">v2.0 Pro</span>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Platforms */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Diffusion</label>
                        <div className="flex gap-3">
                            <button onClick={() => togglePlatform('facebook')} className={`p-3 rounded-xl border-2 transition-all ${platforms.includes('facebook') ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                                <Facebook className="w-6 h-6" />
                            </button>
                            <button onClick={() => togglePlatform('instagram')} className={`p-3 rounded-xl border-2 transition-all ${platforms.includes('instagram') ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                                <Instagram className="w-6 h-6" />
                            </button>
                            <button onClick={() => togglePlatform('linkedin')} className={`p-3 rounded-xl border-2 transition-all ${platforms.includes('linkedin') ? 'border-blue-700 bg-blue-50 text-blue-800' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                                <Linkedin className="w-6 h-6" />
                            </button>
                            <button onClick={() => togglePlatform('pinterest')} className={`p-3 rounded-xl border-2 transition-all ${platforms.includes('pinterest') ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                                <PinterestIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Media */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Média (Photo/Vidéo)</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors group"
                        >
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="h-40 rounded-lg shadow-md object-cover" />
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageFile(null); }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-gray-400 group-hover:text-primary-600">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-50 transition-colors">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
                                    <p className="text-xs mt-1">JPG, PNG jusqu'à 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Légende & Hashtags</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none min-h-[150px] text-base"
                            placeholder="Écrivez votre légende ici... #Business #Nouveauté"
                        />
                        <div className="text-right text-xs text-gray-400 mt-1">{content.length} caractères</div>
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Programmation (Optionnel)</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="datetime-local" 
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button 
                        onClick={handleSendBrief} 
                        disabled={isSending || !content} 
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? (
                            <>
                                <Loader2 className="animate-spin mr-2" /> Traitement en cours...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 w-5 h-5" /> 
                                {scheduleDate ? 'Programmer le Post' : 'Publier Maintenant'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* RIGHT: LIVE PREVIEW (PHONE MOCKUP) */}
            <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-xl border border-gray-200 p-8">
                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6">Aperçu Mobile</h3>
                
                {/* Phone Frame */}
                <div className="w-[320px] h-[640px] bg-white rounded-[40px] border-[8px] border-gray-800 shadow-2xl overflow-hidden relative flex flex-col">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                    
                    {/* Status Bar */}
                    <div className="h-12 bg-white flex items-center justify-between px-6 pt-2 text-xs font-bold text-gray-800 z-10">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <div className="w-4 h-2.5 bg-gray-800 rounded-sm"></div>
                        </div>
                    </div>

                    {/* App Header */}
                    <div className="h-12 border-b flex items-center px-4">
                        <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-2">
                             {/* User Avatar Placeholder */}
                             <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                        </div>
                        <span className="text-sm font-semibold">mon_entreprise_officiel</span>
                        <span className="ml-auto text-gray-400">•••</span>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                        {/* Image */}
                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center">
                                    <ImageIcon className="w-12 h-12 mb-2" />
                                    <span className="text-xs">Aucun média</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="px-4 py-3 flex gap-4">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-800"></div> {/* Like */}
                            <div className="w-6 h-6 rounded-full border-2 border-gray-800 rotate-12"></div> {/* Comment */}
                            <div className="w-6 h-6 ml-auto rounded-full border-2 border-gray-800"></div> {/* Save */}
                        </div>

                        {/* Caption */}
                        <div className="px-4 pb-8">
                            <p className="text-sm text-gray-800">
                                <span className="font-bold mr-2">mon_entreprise_officiel</span>
                                {content || <span className="text-gray-300 italic">Votre légende apparaîtra ici...</span>}
                            </p>
                            <p className="text-xs text-gray-400 mt-2 uppercase">IL Y A 2 MINUTES</p>
                        </div>
                    </div>

                    {/* Nav Bar */}
                    <div className="h-16 border-t flex justify-around items-center px-4 bg-white">
                        <div className="w-6 h-6 bg-gray-800 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-md"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetaPage;
