
import React, { useState, useRef } from 'react';
import { Upload, Monitor, Plus, CheckCircle2, Zap, AlertCircle, FileText, Image as ImageIcon, Video, Globe, Gift, ArrowRight } from 'lucide-react';
import { sendToWorkflow } from '../../services/api';
import { API_CONFIG } from '../../config';

interface WebManagementPageProps {
    showToast: (msg: string, type: 'success' | 'error') => void;
    onNavigate: (tab: string) => void;
}

const WebManagementPage: React.FC<WebManagementPageProps> = ({ showToast, onNavigate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeSection, setActiveSection] = useState<'assets' | 'pages'>('assets');
    
    // Assets State
    const [files, setFiles] = useState<File[]>([]);
    const [instructions, setInstructions] = useState('');
    const [domainInfo, setDomainInfo] = useState({ provider: '', authCode: '' });
    const [isUploading, setIsUploading] = useState(false);

    // Extra Pages State
    const [extraPages, setExtraPages] = useState(1);
    const [addSeo, setAddSeo] = useState(false);
    const [isOrdering, setIsOrdering] = useState(false);

    const PRICE_PER_PAGE = 199;
    const PRICE_SEO_OPTION = 79;

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
        }
    };

    const handleSendAssets = async () => {
        setIsUploading(true);
        const payload = {
            intent: 'web_assets_upload',
            instructions,
            domainInfo,
            fileCount: files.length,
            fileNames: files.map(f => f.name)
        };
        
        await sendToWorkflow(API_CONFIG.ONBOARDING_WORKFLOW_URL, payload);
        
        setIsUploading(false);
        showToast("Vos éléments ont été transmis à l'équipe technique.", 'success');
        setFiles([]);
        setInstructions('');
    };

    const handleOrderPages = async () => {
        setIsOrdering(true);
        const total = extraPages * (PRICE_PER_PAGE + (addSeo ? PRICE_SEO_OPTION : 0));
        
        const payload = {
            intent: 'generate_payment_link',
            provider: 'stripe',
            amount: total,
            description: `Achat ${extraPages} pages supplémentaires ${addSeo ? '+ SEO' : ''}`,
            details: { extraPages, addSeo }
        };

        await sendToWorkflow(API_CONFIG.STRIPE_CHECKOUT, payload);
        
        setIsOrdering(false);
        window.open('https://stripe.com', '_blank');
        showToast("Redirection vers le paiement...", 'success');
    };

    return (
        <div className="space-y-8 pb-12">
            
            {/* Header / Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setActiveSection('assets')}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'assets' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Envoyer mes éléments
                    </button>
                    <button 
                        onClick={() => setActiveSection('pages')}
                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === 'pages' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Commander des pages
                    </button>
                </div>
                <button onClick={() => onNavigate('referral')} className="text-sm font-bold text-green-600 flex items-center hover:underline">
                    <Gift className="w-4 h-4 mr-1" />
                    Obtenir des pages gratuites
                </button>
            </div>

            {/* SECTION 1: ASSETS UPLOAD */}
            {activeSection === 'assets' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Dropzone */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                                Contenu de votre site
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Transmettez-nous votre logo, vos images, vidéos et textes. Plus vous nous donnez de matière, plus votre site sera fidèle à votre image.
                            </p>

                            <div 
                                onDrop={handleFileDrop}
                                onDragOver={e => e.preventDefault()}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors group bg-white"
                            >
                                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className="w-8 h-8 text-blue-500" />
                                </div>
                                <p className="font-medium text-gray-700">Cliquez ou glissez vos fichiers ici</p>
                                <p className="text-xs text-gray-400 mt-1">Images (JPG, PNG), Vidéos (MP4), Documents (PDF, Word)</p>
                            </div>

                            {files.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {files.map((f, i) => (
                                        <div key={i} className="flex items-center text-sm p-2 bg-gray-50 rounded border border-gray-100 text-gray-700">
                                            {f.type.startsWith('image') ? <ImageIcon className="w-4 h-4 mr-2 text-purple-500"/> : f.type.startsWith('video') ? <Video className="w-4 h-4 mr-2 text-pink-500"/> : <FileText className="w-4 h-4 mr-2 text-blue-500"/>}
                                            <span className="truncate flex-1">{f.name}</span>
                                            <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Instructions Text */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Instructions & Préférences</h3>
                            <textarea 
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none h-32 transition-all"
                                placeholder="Décrivez vos attentes, les couleurs souhaitées, ou collez des liens vers des sites que vous aimez..."
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* Domain Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                                Nom de Domaine
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Si vous possédez déjà un nom de domaine, nous avons besoin de ces infos pour le transférer.
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Hébergeur actuel</label>
                                    <input 
                                        type="text" 
                                        value={domainInfo.provider}
                                        onChange={e => setDomainInfo({...domainInfo, provider: e.target.value})}
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                        placeholder="Ex: OVH, GoDaddy..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Code de transfert (Auth Code)</label>
                                    <input 
                                        type="text" 
                                        value={domainInfo.authCode}
                                        onChange={e => setDomainInfo({...domainInfo, authCode: e.target.value})}
                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                                        placeholder="Optionnel"
                                    />
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSendAssets}
                            disabled={isUploading || (files.length === 0 && !instructions && !domainInfo.provider)}
                            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                            {isUploading ? 'Envoi...' : 'Envoyer les informations'}
                        </button>
                    </div>
                </div>
            )}

            {/* SECTION 2: ORDER EXTRA PAGES */}
            {activeSection === 'pages' && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Besoin d'agrandir votre site ?</h2>
                            <p className="text-indigo-100 max-w-lg">
                                Ajoutez de nouvelles pages pour présenter de nouveaux services, des atterrissages publicitaires (Landing Pages) ou enrichir votre contenu.
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h3 className="font-bold text-gray-900 mb-6 text-lg">Configurer votre commande</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de pages à ajouter</label>
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => setExtraPages(Math.max(1, extraPages - 1))} className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-200">-</button>
                                        <span className="text-2xl font-bold text-indigo-600 w-12 text-center">{extraPages}</span>
                                        <button onClick={() => setExtraPages(extraPages + 1)} className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-200">+</button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Tarif unitaire : <strong>{PRICE_PER_PAGE}€</strong></p>
                                </div>

                                <div 
                                    onClick={() => setAddSeo(!addSeo)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${addSeo ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className={`p-2 rounded-lg mr-3 ${addSeo ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">Option SEO Avancé</span>
                                                <span className="text-xs text-gray-500">Rédaction optimisée, mots-clés, balisage.</span>
                                            </div>
                                        </div>
                                        {addSeo && <CheckCircle2 className="w-6 h-6 text-indigo-600" />}
                                    </div>
                                    <div className="mt-3 text-right">
                                        <span className="text-sm font-bold text-indigo-700">+{PRICE_SEO_OPTION}€ <span className="text-xs font-normal">/page</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-6">Récapitulatif</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{extraPages} x Page supplémentaire</span>
                                        <span className="font-bold text-gray-900">{extraPages * PRICE_PER_PAGE}€</span>
                                    </div>
                                    {addSeo && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{extraPages} x Option SEO</span>
                                            <span className="font-bold text-gray-900">{extraPages * PRICE_SEO_OPTION}€</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-3 flex justify-between items-end">
                                        <span className="font-bold text-lg text-gray-900">Total HT</span>
                                        <span className="font-extrabold text-3xl text-indigo-600">
                                            {extraPages * (PRICE_PER_PAGE + (addSeo ? PRICE_SEO_OPTION : 0))}€
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-start bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 mb-6">
                                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                                    <p>Une fois la commande validée, un expert prendra contact avec vous sous 24h pour définir le contenu.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button 
                                    onClick={handleOrderPages}
                                    disabled={isOrdering}
                                    className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                                >
                                    {isOrdering ? 'Chargement...' : 'Commander et Payer'}
                                </button>

                                {/* Referral Promo */}
                                <div 
                                    onClick={() => onNavigate('referral')}
                                    className="bg-white border border-green-200 rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-green-300 transition-all group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                                    
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-2 rounded-lg text-green-600">
                                                <Gift className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Ne payez pas ces pages !</p>
                                                <p className="text-xs text-gray-500 mt-0.5">Parrainez un ami = <strong>3 pages offertes</strong></p>
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebManagementPage;
