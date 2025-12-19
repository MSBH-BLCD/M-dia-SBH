
import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Facebook, Linkedin, Twitter, MessageCircle, Users, Trophy, Star } from 'lucide-react';

const ReferralPage: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const referralCode = "MEDIASBH-CLIENT-PRO"; 
    const referralLink = `https://mediasbh.com/ref/${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 pb-12">
            
            {/* HERO SECTION */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-bold mb-6">
                        <Star className="w-4 h-4 mr-2 text-yellow-300 fill-current" /> Programme de parrainage
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                        Transformez votre réseau en <br/> <span className="text-yellow-300">croissance digitale.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-purple-100 mb-8 leading-relaxed">
                        Votre satisfaction est notre meilleure publicité. Recommandez Média SBH à un autre entrepreneur et recevez un cadeau d'une valeur exceptionnelle.
                    </p>
                </div>
            </div>

            {/* THE OFFER */}
            <div className="max-w-5xl mx-auto -mt-10 relative z-20 px-4">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">L'Offre Parrainage</h2>
                        <p className="text-gray-500">Pour chaque client qui crée son site web (Vitrine ou E-commerce, min. 5 pages) grâce à vous :</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 flex items-center gap-4 shadow-sm transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-white p-3 rounded-full shadow-md">
                            <Gift className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Nous vous offrons</p>
                            <p className="text-xl font-extrabold text-gray-900">3 Pages Site Web</p>
                            <p className="text-sm font-bold text-green-700 flex items-center">
                                <Check className="w-3 h-3 mr-1" /> Option SEO Avancé Incluse
                            </p>
                        </div>
                        <div className="ml-auto bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm transform rotate-3">
                            Valeur ~834€
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                    <h3 className="font-bold text-gray-900 mb-2">Partagez votre lien</h3>
                    <p className="text-sm text-gray-500">Envoyez votre lien unique ou parlez de nous à vos confrères artisans et commerçants.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                    <h3 className="font-bold text-gray-900 mb-2">Ils valident leur projet</h3>
                    <p className="text-sm text-gray-500">Dès qu'ils souscrivent à la création d'un site web (pack 5 pages min.), le parrainage est validé.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                    <h3 className="font-bold text-gray-900 mb-2">Profitez de vos pages</h3>
                    <p className="text-sm text-gray-500">Nous ajoutons 3 pages optimisées à votre site existant. Plus de contenu = Plus de trafic.</p>
                </div>
            </div>

            {/* SHARE SECTION */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Votre lien de parrainage unique</h3>
                
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 font-mono text-gray-600 w-full sm:w-96 overflow-hidden text-ellipsis whitespace-nowrap shadow-inner">
                        {referralLink}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className={`px-6 py-3 rounded-lg font-bold text-white transition-all shadow-md flex items-center ${copied ? 'bg-green-500' : 'bg-gray-900 hover:bg-gray-800'}`}
                    >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copié !' : 'Copier le lien'}
                    </button>
                </div>

                <div className="flex justify-center gap-4">
                    <button className="p-3 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity"><Facebook className="w-5 h-5"/></button>
                    <button className="p-3 bg-[#0A66C2] text-white rounded-full hover:opacity-90 transition-opacity"><Linkedin className="w-5 h-5"/></button>
                    <button className="p-3 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity"><Twitter className="w-5 h-5"/></button>
                    <button className="p-3 bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity"><MessageCircle className="w-5 h-5"/></button>
                </div>
            </div>

            {/* TRACKING (Simulated) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" /> Vos Filleuls
                    </h3>
                    <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">0 Parrainage actif</div>
                </div>
                <div className="p-12 text-center text-gray-400">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Vous n'avez pas encore de parrainage validé.</p>
                    <p className="text-sm mt-1">Partagez votre lien pour commencer à gagner des pages !</p>
                </div>
            </div>
        </div>
    );
};

export default ReferralPage;
