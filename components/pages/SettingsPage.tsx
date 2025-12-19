
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { Sparkles, Target, Hash, FileText, ExternalLink, Loader2, Globe, Link as LinkIcon, Instagram, Facebook, Linkedin, Pin, CheckCircle2, AlertCircle, Trash2, ShoppingBag, X } from 'lucide-react';
import { API_CONFIG } from '../../config';

const GoogleIcon = () => (<svg className="w-6 h-6" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>);

const PinterestIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.852-2.433-4.587 0-3.728 2.703-7.161 7.761-7.161 4.064 0 7.229 2.893 7.229 6.756 0 4.021-2.535 7.272-6.066 7.272-1.183 0-2.312-.619-2.686-1.345l-.736 2.793c-.266 1.024-.986 2.296-1.465 3.072.934.288 1.956.445 3.022.445 6.6 0 11.953-5.367 11.953-11.987C23.97 5.367 18.62 0 12.017 0z" />
  </svg>
);

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const SettingsPage: React.FC<{ showToast: (msg: string, type: 'success' | 'error' | 'info') => void }> = ({ showToast }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') || 'general';
    });
    
    const [loading, setLoading] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
    
    // Form States
    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [toneOfVoice, setToneOfVoice] = useState('Professionnel');
    const [rawSubscriptionData, setRawSubscriptionData] = useState<any>({});
    const [gmbKeywords, setGmbKeywords] = useState<string[]>(['', '', '']);
    const [blogKeywords, setBlogKeywords] = useState<string[]>(['', '', '']);
    const [socialHashtags, setSocialHashtags] = useState<string[]>(['', '', '']);
    const [notifReviews, setNotifReviews] = useState(true);
    const [notifReport, setNotifReport] = useState(true);
    const [autoPublish, setAutoPublish] = useState(false);

    // CMS Connection Modal
    const [showCmsModal, setShowCmsModal] = useState(false);
    const [selectedCms, setSelectedCms] = useState<any>(null);
    const [cmsConfig, setCmsConfig] = useState({ url: '', apiKey: '' });

    useEffect(() => {
        if (!user) return;

        // 1. Détection du retour d'authentification OAuth
        const params = new URLSearchParams(window.location.search);
        if (params.get('auth_success') === 'true') {
            const provider = params.get('provider');
            showToast(`Connexion ${provider?.toUpperCase()} réussie !`, 'success');
            // Nettoyer l'URL sans recharger la page
            window.history.replaceState({}, '', window.location.pathname + '?tab=accounts');
        } else if (params.get('auth_error')) {
            showToast("Échec de la connexion externe.", 'error');
            window.history.replaceState({}, '', window.location.pathname + '?tab=accounts');
        }

        const fetchData = async () => {
            // Fetch Profil
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) {
                setBusinessName(profile.business_name || '');
                setCategory(profile.category || '');
                setLocation(profile.location || '');
                setDescription(profile.description || '');
                setPhone(profile.phone || '');
                setWebsite(profile.website || '');
                if (profile.subscription_data) {
                    setRawSubscriptionData(profile.subscription_data);
                    setTargetAudience(profile.subscription_data.target_audience || '');
                    setToneOfVoice(profile.subscription_data.tone_of_voice || 'Professionnel');
                    if(profile.subscription_data.keywords_gmb) setGmbKeywords(profile.subscription_data.keywords_gmb);
                    if(profile.subscription_data.keywords_blog) setBlogKeywords(profile.subscription_data.keywords_blog);
                    if(profile.subscription_data.hashtags_social) setSocialHashtags(profile.subscription_data.hashtags_social);
                }
            }

            // Fetch Comptes Connectés (Real Data)
            const { data: accounts, error: accError } = await supabase
                .from('connected_accounts')
                .select('*')
                .eq('user_id', user.id);
            
            if (accounts) setConnectedAccounts(accounts);

            // Fetch User Settings
            const { data: settings } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single();
            if (settings) {
                setNotifReviews(settings.notif_reviews);
                setNotifReport(settings.notif_report);
                setAutoPublish(settings.auto_publish);
            }
            setDataLoaded(true);
        };
        fetchData();
    }, [user]);

    // --- ACTIONS DE CONNEXION ---

    const startOAuth = (provider: string) => {
        if (!user) return;
        // Redirection vers notre endpoint backend qui gère le démarrage OAuth
        const apiBase = API_CONFIG.ONBOARDING_WORKFLOW_URL; 
        const authUrl = `${apiBase}?action=oauth_start&provider=${provider}&user_id=${user.id}&redirect_uri=${encodeURIComponent(window.location.origin + '/espace-client')}`;
        
        showToast(`Redirection vers ${provider}...`, 'info');
        window.location.href = authUrl;
    };

    const handleDisconnect = async (accountId: string, provider: string) => {
        if (!confirm(`Voulez-vous vraiment déconnecter votre compte ${provider} ?`)) return;
        
        setLoading(true);
        const { error } = await supabase
            .from('connected_accounts')
            .delete()
            .eq('id', accountId);

        if (!error) {
            setConnectedAccounts(prev => prev.filter(a => a.id !== accountId));
            showToast("Compte déconnecté avec succès.", "success");
        } else {
            showToast("Erreur lors de la déconnexion.", "error");
        }
        setLoading(false);
    };

    const handleCmsConnect = async () => {
        if (!cmsConfig.url || !cmsConfig.apiKey) {
            showToast("Veuillez remplir tous les champs.", "error");
            return;
        }

        setLoading(true);
        const { error } = await supabase.from('connected_accounts').upsert({
            user_id: user?.id,
            provider: selectedCms.id,
            account_name: `Site ${selectedCms.name}`,
            status: 'active',
            site_url: cmsConfig.url,
        });

        if (!error) {
            showToast(`${selectedCms.name} connecté !`, 'success');
            setShowCmsModal(false);
            const { data } = await supabase.from('connected_accounts').select('*').eq('user_id', user?.id);
            if (data) setConnectedAccounts(data);
        } else {
            showToast("Erreur lors de l'enregistrement du site.", "error");
        }
        setLoading(false);
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('profiles').update({
            business_name: businessName, category, location, description, phone, website,
            subscription_data: { ...rawSubscriptionData, target_audience: targetAudience, tone_of_voice: toneOfVoice, keywords_gmb: gmbKeywords, keywords_blog: blogKeywords, hashtags_social: socialHashtags }
        }).eq('id', user?.id);
        setLoading(false);
        if (error) showToast("Erreur sauvegarde", 'error');
        else showToast("Profil mis à jour", 'success');
    };

    // Auto-save settings when toggled
    useEffect(() => { 
        if(user && dataLoaded) {
            supabase.from('user_settings').upsert({ user_id: user?.id, notif_reviews: notifReviews, notif_report: notifReport, auto_publish: autoPublish });
        }
    }, [notifReviews, notifReport, autoPublish, dataLoaded]);

    const socialPlatforms = [
        { id: 'google', name: 'Google Business', icon: GoogleIcon, desc: 'Avis, posts, horaires' },
        { id: 'facebook', name: 'Facebook Page', icon: Facebook, desc: 'Publication croisée', color: '#1877F2' },
        { id: 'instagram', name: 'Instagram', icon: Instagram, desc: 'Photos et stories', color: '#E1306C' },
        { id: 'pinterest', name: 'Pinterest', icon: PinterestIcon, desc: 'Inspiration visuelle', color: '#BD081C' },
        { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, desc: 'B2B et Pro', color: '#0A66C2' },
    ];

    const cmsPlatforms = [
        { id: 'wordpress', name: 'WordPress', icon: LinkIcon, desc: 'Via Application Password.' },
        { id: 'shopify', name: 'Shopify', icon: ShoppingBag, desc: 'Import produits.' },
        { id: 'webflow', name: 'Webflow', icon: Globe, desc: 'API Key Collections.' },
    ];

    const getAccountByProvider = (provider: string) => connectedAccounts.find(a => a.provider === provider);

    const inputClasses = "w-full p-2.5 bg-white border border-gray-200 text-gray-900 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto">
             <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50">
                {['general', 'strategy', 'accounts', 'notifications'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)} 
                        className={`px-6 py-4 text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {tab === 'general' ? 'Profil' : tab === 'strategy' ? 'Stratégie & SEO' : tab === 'accounts' ? 'Comptes & CMS' : 'Workflow'}
                    </button>
                ))}
             </div>

             <div className="p-8">
                {activeTab === 'general' && (
                    <form onSubmit={handleSaveProfile} className="space-y-10">
                         <div className="space-y-6">
                             <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                                 <Globe className="w-5 h-5 text-blue-600"/>
                                 <h3 className="text-lg font-bold text-gray-800">Identité de l'entreprise</h3>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className={labelClasses}>Nom de l'entreprise</label><input value={businessName} onChange={e=>setBusinessName(e.target.value)} className={inputClasses} placeholder="Ex: Boulangerie Moderne" /></div>
                                <div><label className={labelClasses}>Catégorie</label><input value={category} onChange={e=>setCategory(e.target.value)} className={inputClasses} placeholder="Ex: Boulangerie" /></div>
                                <div className="md:col-span-2"><label className={labelClasses}>Adresse / Zone</label><input value={location} onChange={e=>setLocation(e.target.value)} className={inputClasses} placeholder="Zone d'activité" /></div>
                                <div className="md:col-span-2"><label className={labelClasses}>Description courte (IA)</label><textarea value={description} onChange={e=>setDescription(e.target.value)} className={`${inputClasses} resize-none`} rows={3} placeholder="Détaillez vos services pour l'IA." /></div>
                                <div><label className={labelClasses}>Site Web</label><input value={website} onChange={e=>setWebsite(e.target.value)} className={inputClasses} placeholder="https://..." /></div>
                                <div><label className={labelClasses}>Téléphone</label><input value={phone} onChange={e=>setPhone(e.target.value)} className={inputClasses} /></div>
                             </div>
                         </div>
                        <button type="submit" disabled={loading} className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg">Enregistrer les modifications</button>
                    </form>
                )}

                {activeTab === 'strategy' && (
                     <form onSubmit={handleSaveProfile} className="space-y-10">
                         <div className="space-y-6">
                             <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
                                 <Sparkles className="w-5 h-5 text-indigo-600"/>
                                 <h3 className="text-lg font-bold text-gray-800">Ligne Éditoriale IA</h3>
                             </div>
                             <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-50 grid grid-cols-1 gap-6">
                                <div><label className="block text-sm font-bold text-blue-900 mb-2">Cible principale</label><input value={targetAudience} onChange={e=>setTargetAudience(e.target.value)} className={inputClasses} placeholder="Ex: Familles locales" /></div>
                                <div>
                                    <label className="block text-sm font-bold text-blue-900 mb-2">Ton de communication</label>
                                    <select value={toneOfVoice} onChange={e=>setToneOfVoice(e.target.value)} className={inputClasses}>
                                        <option value="Professionnel">Professionnel</option><option value="Amical">Amical</option><option value="Luxueux">Luxueux</option><option value="Humoristique">Humoristique</option><option value="Pédagogique">Pédagogique</option>
                                    </select>
                                </div>
                             </div>
                         </div>
                         <button type="submit" disabled={loading} className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold">Enregistrer la stratégie</button>
                     </form>
                )}

                {activeTab === 'accounts' && (
                    <div className="space-y-12">
                        {/* RÉSEAUX SOCIAUX (Flux OAuth) */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6">Réseaux Sociaux</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {socialPlatforms.map(platform => {
                                    const account = getAccountByProvider(platform.id);
                                    const isConnected = !!account;

                                    return (
                                        <div key={platform.id} className={`border p-5 rounded-2xl bg-white transition-all flex flex-col group ${isConnected ? 'border-green-100 ring-1 ring-green-50' : 'border-gray-100 hover:shadow-md'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                                                    {typeof platform.icon === 'function' ? <platform.icon style={{ color: platform.color }} /> : <platform.icon className="w-6 h-6" style={{ color: platform.color }} />}
                                                </div>
                                                {isConnected ? (
                                                    <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full flex items-center">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" /> Actif
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase rounded-full">Inactif</span>
                                                )}
                                            </div>
                                            <div className="mb-6">
                                                <div className="font-bold text-gray-900">{isConnected ? (account.account_name || platform.name) : platform.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{isConnected ? `Connecté le ${new Date(account.created_at).toLocaleDateString()}` : platform.desc}</div>
                                            </div>
                                            {isConnected ? (
                                                <button 
                                                    onClick={() => handleDisconnect(account.id, platform.name)}
                                                    className="w-full py-2.5 bg-gray-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-2" /> Déconnecter
                                                </button>
                                            ) : (
                                                <button onClick={() => startOAuth(platform.id)} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">Se connecter</button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SITE WEB (Flux API Key) */}
                        <div>
                            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3 mb-6"><Globe className="w-5 h-5 text-blue-600"/><h3 className="text-lg font-bold text-gray-800">Site Web & Blog (CMS)</h3></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {cmsPlatforms.map(cms => {
                                    const account = getAccountByProvider(cms.id);
                                    const isConnected = !!account;

                                    return (
                                        <div key={cms.id} className={`p-5 rounded-2xl border bg-white transition-all flex flex-col group ${isConnected ? 'border-green-100' : 'border-gray-100 hover:shadow-md'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2.5 bg-gray-50 rounded-xl border border-transparent group-hover:border-gray-100">
                                                    <cms.icon className="w-6 h-6 text-gray-400" />
                                                </div>
                                                {isConnected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                            </div>
                                            <div className="mb-6">
                                                <div className="font-bold text-gray-900">{isConnected ? account.site_url : cms.name}</div>
                                                <div className="text-xs text-gray-500 mt-1">{cms.desc}</div>
                                            </div>
                                            {isConnected ? (
                                                <button 
                                                    onClick={() => handleDisconnect(account.id, cms.name)}
                                                    className="w-full py-2.5 bg-gray-50 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-2" /> Déconnecter le site
                                                </button>
                                            ) : (
                                                <button onClick={() => { setSelectedCms(cms); setShowCmsModal(true); }} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">Connecter mon site</button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-6 max-w-2xl">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-6">Workflow & Automatisations</h3>
                        <label className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                            <div><span className="font-bold text-gray-900 block">Avis Clients</span><span className="text-xs text-gray-500">Alertes email en temps réel</span></div>
                            <Toggle checked={notifReviews} onChange={setNotifReviews} />
                        </label>
                        <label className="flex items-center justify-between p-5 border border-gray-100 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                            <div><span className="font-bold text-gray-900 block">Rapport Hebdomadaire</span><span className="text-xs text-gray-500">Synthèse des performances par email</span></div>
                            <Toggle checked={notifReport} onChange={setNotifReport} />
                        </label>
                        <label className="flex items-center justify-between p-5 border border-blue-100 rounded-2xl bg-blue-50/30 cursor-pointer">
                            <div><span className="font-bold text-blue-900 block">Publication Automatique</span><span className="text-xs text-blue-700">Publier sans validation manuelle (Auto-pilote IA)</span></div>
                            <Toggle checked={autoPublish} onChange={setAutoPublish} />
                        </label>
                    </div>
                )}
             </div>

             {/* CMS MODAL */}
             {showCmsModal && (
                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                     <div className="bg-white p-8 rounded-3xl max-w-md w-full animate-fade-in-up shadow-2xl relative">
                         <button onClick={() => setShowCmsModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                         
                         <h3 className="font-bold text-xl text-gray-900 mb-6">Connecter {selectedCms?.name}</h3>
                         <div className="space-y-4 mb-8">
                            <div>
                                <label className={labelClasses}>URL de votre site</label>
                                <input 
                                    value={cmsConfig.url} 
                                    onChange={e => setCmsConfig({...cmsConfig, url: e.target.value})} 
                                    className={inputClasses} 
                                    placeholder="https://votre-site.com" 
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Clé API / Application Password</label>
                                <input 
                                    type="password"
                                    value={cmsConfig.apiKey} 
                                    onChange={e => setCmsConfig({...cmsConfig, apiKey: e.target.value})} 
                                    className={inputClasses} 
                                    placeholder="•••• •••• •••• ••••" 
                                />
                                <p className="text-[10px] text-gray-400 mt-2 italic">
                                    Nous utilisons cette clé uniquement pour publier vos articles de blog validés.
                                </p>
                            </div>
                         </div>
                         <div className="flex gap-3">
                             <button onClick={()=>setShowCmsModal(false)} className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl font-bold">Annuler</button>
                             <button 
                                onClick={handleCmsConnect}
                                disabled={loading}
                                className="flex-[2] bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 shadow-lg font-bold flex justify-center items-center"
                             >
                                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Valider la connexion"}
                             </button>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

export default SettingsPage;
