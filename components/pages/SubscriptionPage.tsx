
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sliders, FileText, AlertTriangle, Calendar, Globe, Server, Shield, MousePointer2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const SubscriptionPage: React.FC = () => {
    const { user } = useAuth();
    const [currentPlan, setCurrentPlan] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'offers' | 'my_plan'>('offers');

    // --- STATE: CUSTOM CALCULATOR ---
    const [customGmb, setCustomGmb] = useState(4);
    const [customSocial, setCustomSocial] = useState(4);
    const [customBlog, setCustomBlog] = useState(2);
    const [customSocialChannels, setCustomSocialChannels] = useState<string[]>(['facebook', 'instagram', 'linkedin']);

    const toggleSocialChannel = (channel: string) => {
        if (customSocialChannels.includes(channel)) {
            setCustomSocialChannels(customSocialChannels.filter(c => c !== channel));
        } else {
            setCustomSocialChannels([...customSocialChannels, channel]);
        }
    };

    const calculateSubPrice = () => {
        let price = 0;
        
        // GMB: 4 posts = 29€ -> 7.25€/u
        if (customGmb > 0) price += customGmb * 7.25; 
        
        // Social: 4 posts = 49€ -> 12.25€/u
        if (customSocial > 0) price += customSocial * 12.25; 

        // Premium Channels (+29€ each) - Uniquement si du social est activé
        if (customSocial > 0) {
            if (customSocialChannels.includes('linkedin')) price += 29;
            if (customSocialChannels.includes('pinterest')) price += 29;
        }
        
        // Blog Articles : 4 articles = 49€ -> 12.25€/u
        if (customBlog > 0) price += customBlog * 12.25;
        
        return Math.round(price);
    };
    
    const subTotalPrice = calculateSubPrice();
    
    // Validation Rules
    const isGmbValid = customGmb === 0 || customGmb >= 4;
    const isSocialValid = customSocial === 0 || customSocial >= 4;
    const isBlogValid = customBlog === 0 || customBlog >= 2; // Min 2
    const isValidConfig = isGmbValid && isSocialValid && isBlogValid && subTotalPrice > 0;

    useEffect(() => {
        if(!user) return;
        const fetchSub = async () => {
            const { data } = await supabase.from('profiles').select('subscription_data').eq('id', user.id).single();
            if(data?.subscription_data?.plan) {
                setCurrentPlan(data.subscription_data.plan);
                setActiveTab('my_plan');
            }
            setLoading(false);
        };
        fetchSub();
    }, [user]);

    const handleSelectPlan = async (plan: string) => {
        if(!user) return;
        window.open('https://stripe.com', '_blank');
    };

    const getPlanDetails = (planId: string) => {
        switch(planId) {
            case 'essentiel': return { name: 'Essentiel', price: '54€', features: ['4 Posts Google/mois', '2 Articles Blog'] };
            case 'business': return { name: 'Business', price: '132€', features: ['4 Posts Google', '4 Posts Social', '2 Articles Blog'] };
            case 'performance': return { name: 'Performance', price: '300€', features: ['8 Posts Google', '8 Posts Social', '7 Articles Blog'] };
            case 'custom': return { name: 'Sur Mesure', price: 'Variable', features: ['Configuration personnalisée'] };
            default: return { name: 'Aucun', price: '-', features: [] };
        }
    };

    const currentPlanDetails = getPlanDetails(currentPlan);

    if (loading) return <div className="p-8">Chargement de votre offre...</div>;

    return (
        <div className="space-y-8 pb-10">
             <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold text-gray-900">Gérez vos Abonnements</h2>
                 <p className="text-gray-500">Pilotez vos modules Marketing et la maintenance de votre Site Web.</p>
             </div>

             {/* TABS */}
             <div className="flex justify-center mb-8">
                 <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                     <button 
                        onClick={() => setActiveTab('offers')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'offers' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                     >
                         Modules Marketing
                     </button>
                     <button 
                        onClick={() => setActiveTab('my_plan')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'my_plan' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                     >
                         Mon Contrat & Site Web
                     </button>
                 </div>
             </div>

             {/* TAB: OFFERS */}
             {activeTab === 'offers' && (
                <div className="space-y-12">
                    {/* CUSTOM SUBSCRIPTION CALCULATOR */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4">
                                    <Sliders className="w-3 h-3 mr-2" /> À la Carte
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Composez votre offre</h3>
                                <p className="text-gray-600 mb-8">
                                    Activez les modules dont vous avez besoin. Vous pouvez choisir un seul module indépendamment.
                                    <br/><span className="text-xs text-gray-400 italic">Minimums : 4 posts (Social/GMB) ou 2 articles (Blog). Quantités mensuelles.</span>
                                </p>

                                <div className="space-y-8">
                                    {/* GMB Slider */}
                                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold text-gray-800 flex items-center"><Globe className="w-4 h-4 mr-2 text-blue-600"/> Module Google Business</span>
                                            <span className="text-sm font-bold text-blue-600">{customGmb} posts <span className="text-xs font-normal text-gray-400">/mois</span></span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="28" 
                                            value={customGmb} 
                                            onChange={e=> {
                                                const v = parseInt(e.target.value);
                                                if(v > 0 && v < 4 && customGmb === 0) setCustomGmb(4);
                                                else if(v > 0 && v < 4 && customGmb >= 4) setCustomGmb(0);
                                                else setCustomGmb(v);
                                            }} 
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Désactivé (0)</span>
                                            <span>28 posts</span>
                                        </div>
                                    </div>

                                    {/* Social Slider & Channels */}
                                    <div className="bg-white p-4 rounded-xl border border-pink-100 shadow-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold text-gray-800 flex items-center"><MousePointer2 className="w-4 h-4 mr-2 text-pink-600"/> Module Réseaux Sociaux</span>
                                            <span className="text-sm font-bold text-pink-600">{customSocial} posts <span className="text-xs font-normal text-gray-400">/mois</span></span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="28" 
                                            value={customSocial} 
                                            onChange={e=> {
                                                const v = parseInt(e.target.value);
                                                let newVal = v;
                                                if(v > 0 && v < 4 && customSocial === 0) newVal = 4;
                                                else if(v > 0 && v < 4 && customSocial >= 4) newVal = 0;
                                                else newVal = v;

                                                setCustomSocial(newVal);

                                                if (newVal === 0) {
                                                     setCustomSocialChannels(prev => prev.filter(c => c !== 'linkedin' && c !== 'pinterest'));
                                                }
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600" 
                                        />
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 mb-2">Plateformes incluses (Fb/Insta) + Options :</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['Facebook', 'Instagram', 'LinkedIn', 'Pinterest'].map((channel) => (
                                                    <button
                                                        key={channel}
                                                        disabled={customSocial === 0}
                                                        onClick={() => toggleSocialChannel(channel.toLowerCase())}
                                                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                                                            customSocialChannels.includes(channel.toLowerCase()) && customSocial > 0
                                                            ? 'bg-pink-600 text-white border-pink-600 font-medium'
                                                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                                        } ${customSocial === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {channel}
                                                        {(channel === 'LinkedIn' || channel === 'Pinterest') && (
                                                            <span className={`ml-1 text-[10px] ${customSocialChannels.includes(channel.toLowerCase()) ? 'text-white' : 'text-gray-400'}`}>+29€</span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blog Slider */}
                                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-bold text-gray-800 flex items-center"><FileText className="w-4 h-4 mr-2 text-indigo-600"/> Module SEO & Blog</span>
                                            <span className="text-sm font-bold text-indigo-600">{customBlog} articles <span className="text-xs font-normal text-gray-400">/mois</span></span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="28" 
                                            value={customBlog} 
                                            onChange={e=> {
                                                const v = parseInt(e.target.value);
                                                if(v > 0 && v < 2 && customBlog === 0) setCustomBlog(2);
                                                else if(v > 0 && v < 2 && customBlog >= 2) setCustomBlog(0);
                                                else setCustomBlog(v);
                                            }} 
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>Désactivé (0)</span>
                                            <span>28 articles</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl text-center sticky top-6">
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Votre tarif mensuel</div>
                                <div className="text-5xl font-extrabold text-blue-900 mb-2">{subTotalPrice}€</div>
                                <div className="text-gray-400 text-sm mb-8">Sans engagement</div>
                                
                                <div className="space-y-3 text-left mb-8 bg-gray-50 p-4 rounded-lg text-sm">
                                    {customGmb > 0 && (
                                        <div className="flex justify-between"><span className="text-gray-600">Module Google ({customGmb} posts)</span><span className="font-bold">{(customGmb * 7.25).toFixed(0)}€</span></div>
                                    )}
                                    {customSocial > 0 && (
                                        <div className="flex justify-between"><span className="text-gray-600">Module Social ({customSocial} posts)</span><span className="font-bold">{(customSocial * 12.25).toFixed(0)}€</span></div>
                                    )}
                                    {customSocialChannels.includes('linkedin') && customSocial > 0 && (
                                        <div className="flex justify-between"><span className="text-gray-500 pl-2 text-xs">+ Option LinkedIn</span><span className="font-bold text-xs">29€</span></div>
                                    )}
                                    {customSocialChannels.includes('pinterest') && customSocial > 0 && (
                                        <div className="flex justify-between"><span className="text-gray-500 pl-2 text-xs">+ Option Pinterest</span><span className="font-bold text-xs">29€</span></div>
                                    )}
                                    {customBlog > 0 && (
                                        <div className="flex justify-between"><span className="text-gray-600">Module Blog ({customBlog} articles)</span><span className="font-bold">{(customBlog * 12.25).toFixed(0)}€</span></div>
                                    )}
                                    
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        {!isGmbValid && <div className="text-red-500 text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Min. 4 posts Google</div>}
                                        {!isSocialValid && <div className="text-red-500 text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Min. 4 posts Social</div>}
                                        {!isBlogValid && <div className="text-red-500 text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Min. 2 articles Blog</div>}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleSelectPlan('custom')}
                                    disabled={!isValidConfig}
                                    className={`w-full py-4 text-white font-bold rounded-xl transition-colors shadow-lg ${!isValidConfig ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    Valider cette offre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             )}

             {/* TAB: MY PLAN & WEBSITE */}
             {activeTab === 'my_plan' && (
                 <div className="max-w-4xl mx-auto space-y-8">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Marketing Plan */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50">
                                <div>
                                    <p className="text-xs text-purple-600 font-bold uppercase tracking-wider flex items-center">
                                        <Sliders className="w-3 h-3 mr-1"/> Marketing Modules
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1">{currentPlanDetails.name}</h3>
                                </div>
                                <div className="text-right">
                                    <span className="block text-lg font-bold text-purple-600">{currentPlanDetails.price}</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1">
                                <div className="space-y-3">
                                    {currentPlanDetails.features.length > 0 ? (
                                        currentPlanDetails.features.map((feat, i) => (
                                            <div key={i} className="flex items-center text-sm text-gray-700">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                {feat}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic text-sm">Aucun module marketing actif.</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                <button onClick={()=>setActiveTab('offers')} className="text-sm font-semibold text-purple-600 hover:text-purple-700">Modifier mon offre</button>
                            </div>
                        </div>

                        {/* Website Maintenance Section */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider flex items-center">
                                        <Server className="w-3 h-3 mr-1"/> Site Web
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-900 mt-1">Maintenance & Hébergement</h3>
                                </div>
                                <div className="text-right">
                                    {/* Placeholder logic for website active plan */}
                                    <span className="block text-lg font-bold text-gray-400">--</span>
                                </div>
                            </div>
                            <div className="p-6 flex-1">
                                <p className="text-sm text-gray-600 mb-4">
                                    Assurez la sécurité, les mises à jour et la performance de votre site vitrine ou e-commerce.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li className="flex items-center"><Shield className="w-4 h-4 mr-2 text-blue-500"/> Certificat SSL & Sécurité</li>
                                    <li className="flex items-center"><Server className="w-4 h-4 mr-2 text-blue-500"/> Hébergement Haute Dispo.</li>
                                    <li className="flex items-center"><Globe className="w-4 h-4 mr-2 text-blue-500"/> Nom de domaine inclus</li>
                                </ul>
                            </div>
                             <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">Gérer mon site</button>
                            </div>
                        </div>
                     </div>

                     {/* Legal */}
                     <div className="bg-white rounded-2xl border border-gray-200 p-6">
                         <div className="flex items-center mb-4 text-gray-900">
                             <FileText className="w-5 h-5 mr-2 text-gray-500" />
                             <h4 className="font-bold">Conditions générales</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                             <div className="flex items-start">
                                 <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                                 <span><strong>Sans engagement :</strong> Résiliation possible à tout moment (préavis 1 mois).</span>
                             </div>
                             <div className="flex items-start">
                                 <AlertTriangle className="w-4 h-4 text-orange-500 mr-2 mt-0.5" />
                                 <span><strong>Support :</strong> Inclus par email et chat pour tous les abonnés actifs.</span>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

export default SubscriptionPage;
