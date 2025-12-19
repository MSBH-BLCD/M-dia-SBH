
import React, { useState } from 'react';
import { ShoppingBag, Globe, CheckCircle2, ArrowRight, HelpCircle, Shield, Zap, Server, Package, CreditCard, Loader2, Info } from 'lucide-react';
import { sendToWorkflow } from '../../services/api';
import { API_CONFIG } from '../../config';

const WebCreationPage: React.FC = () => {
  const [siteType, setSiteType] = useState<'vitrine' | 'ecommerce'>('vitrine');
  const [pageCount, setPageCount] = useState(5);
  const [seoOption, setSeoOption] = useState<'basic' | 'advanced'>('basic');
  const [hasMaintenance, setHasMaintenance] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [productVolumeTier, setProductVolumeTier] = useState(0); // 0: 0-49, 1: 50-99...
  
  // PayPal State
  const [isPaypalLoading, setIsPaypalLoading] = useState(false);

  // Constants Pricing
  const PRICE_MAINTENANCE_VITRINE = 49;
  const PRICE_MAINTENANCE_ECOMMERCE = 72;
  const PRICE_SEO_ADVANCED_PER_PAGE = 79;
  
  const PRICE_TIER_1 = 225; // 1 to 5 pages
  const PRICE_TIER_2 = 199; // 6 to 10 pages
  const PRICE_TIER_3 = 179; // 11+ pages

  // Supplements
  const PRICE_ECOMMERCE_SETUP = 199;

  // Product Volume Pricing Tiers
  const PRODUCT_TIERS = [
      { label: '1 - 49 produits (Inclus)', price: 0 },
      { label: '50 - 99 produits (+230€)', price: 230 },
      { label: '100 - 199 produits (+440€)', price: 440 },
      { label: '200 - 499 produits (+870€)', price: 870 },
      { label: '500+ produits (Sur devis)', price: 0, manual: true }
  ];

  // --- CALCULATION LOGIC ---

  // 1. Creation Cost (Base)
  const calculateCreationCost = (pages: number) => {
    let cost = 0;
    // Tier 1: Pages 1-5
    const tier1Pages = Math.min(pages, 5);
    cost += tier1Pages * PRICE_TIER_1;
    
    // Tier 2: Pages 6-10
    if (pages > 5) {
        const tier2Pages = Math.min(pages - 5, 5);
        cost += tier2Pages * PRICE_TIER_2;
    }
    
    // Tier 3: Pages 11+
    if (pages > 10) {
        const tier3Pages = pages - 10;
        cost += tier3Pages * PRICE_TIER_3;
    }
    return cost;
  };

  const baseCreationCost = calculateCreationCost(pageCount);

  // Ecommerce Supplement (Base + Product Volume)
  let ecommerceSupplement = 0;
  if (siteType === 'ecommerce') {
      ecommerceSupplement += PRICE_ECOMMERCE_SETUP;
      ecommerceSupplement += PRODUCT_TIERS[productVolumeTier].price;
  }

  // 3. SEO Cost (One shot)
  const seoCost = seoOption === 'advanced' ? (pageCount * PRICE_SEO_ADVANCED_PER_PAGE) : 0;

  // 4. Maintenance Cost (Recurring)
  const rawMonthlyMaintenance = siteType === 'vitrine' ? PRICE_MAINTENANCE_VITRINE : PRICE_MAINTENANCE_ECOMMERCE;
  
  // Apply discount if yearly
  const maintenanceMonthlyPrice = billingCycle === 'yearly' 
    ? rawMonthlyMaintenance * 0.9 // -10%
    : rawMonthlyMaintenance;

  // Total amount to pay TODAY
  const maintenancePayableToday = hasMaintenance 
    ? (billingCycle === 'yearly' ? (maintenanceMonthlyPrice * 12) : maintenanceMonthlyPrice)
    : 0;

  const totalPayableToday = baseCreationCost + ecommerceSupplement + seoCost + maintenancePayableToday;
  const isEligibleFor4x = totalPayableToday <= 2000;

  const handleOrder = () => {
    window.open('https://stripe.com', '_blank');
  };

  const handlePaypal4x = async () => {
    setIsPaypalLoading(true);

    const payload = {
        intent: 'generate_payment_link',
        provider: 'paypal',
        type: '4x_installments',
        amount: totalPayableToday,
        currency: 'EUR',
        description: `Création site ${siteType} - ${pageCount} pages`,
        details: {
            siteType,
            pageCount,
            seoOption,
            productTier: siteType === 'ecommerce' ? PRODUCT_TIERS[productVolumeTier].label : 'N/A'
        }
    };

    await sendToWorkflow(API_CONFIG.STRIPE_CHECKOUT, payload); 

    setIsPaypalLoading(false);
    alert(`Redirection vers PayPal pour un paiement de ${totalPayableToday}€ en 4 fois sans frais.`);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* VIBRANT HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
        
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Création de Site Web</h2>
            <p className="text-blue-100 mb-0 max-w-xl">
                Une présence web professionnelle clé en main. Configurez votre formule sur-mesure avec nos experts.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: CONFIGURATION */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. TYPE DE SITE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-bold">1</span>
                        Type de Site
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={() => { setSiteType('vitrine'); }}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                            siteType === 'vitrine' 
                            ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
                            : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${siteType === 'vitrine' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Globe className="w-6 h-6" />
                            </div>
                            {siteType === 'vitrine' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                        </div>
                        <h4 className="font-bold text-gray-900">Site Vitrine</h4>
                        <p className="text-sm text-gray-500 mt-1">Présentez votre activité.</p>
                    </button>

                    <button 
                        onClick={() => setSiteType('ecommerce')}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                            siteType === 'ecommerce' 
                            ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' 
                            : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${siteType === 'ecommerce' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            {siteType === 'ecommerce' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                        </div>
                        <h4 className="font-bold text-gray-900">Site E-commerce</h4>
                        <p className="text-sm text-gray-500 mt-1">Vente en ligne (+{PRICE_ECOMMERCE_SETUP}€)</p>
                    </button>
                </div>

                {/* E-COMMERCE PRODUCT VOLUME SELECTOR */}
                {siteType === 'ecommerce' && (
                    <div className="px-6 pb-6 animate-fade-in-up">
                        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                            <label className="block text-sm font-bold text-purple-900 mb-2">Volume de produits à intégrer</label>
                            <select 
                                value={productVolumeTier}
                                onChange={(e) => setProductVolumeTier(parseInt(e.target.value))}
                                className="w-full p-3 border border-purple-200 rounded-lg bg-white font-medium focus:ring-2 focus:ring-purple-500 outline-none text-gray-800"
                            >
                                {PRODUCT_TIERS.map((tier, index) => (
                                    <option key={index} value={index}>{tier.label}</option>
                                ))}
                            </select>
                            <p className="text-xs text-purple-700 mt-2">
                                Nous importons vos produits, configurons les variantes et optimisons les fiches pour le SEO.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. VOLUME DE PAGES */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                     <h3 className="font-bold text-gray-900 flex items-center">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-bold">2</span>
                        Nombre de pages
                    </h3>
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                             <p className="text-sm font-medium text-gray-500 mb-1">Volume souhaité</p>
                             <p className="text-3xl font-bold text-blue-600">{pageCount} <span className="text-lg font-normal text-gray-400">pages</span></p>
                        </div>
                        <div className="text-right">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {pageCount <= 5 ? `${PRICE_TIER_1}€/page` : pageCount <= 10 ? `${PRICE_TIER_2}€/page (mixte)` : `${PRICE_TIER_3}€/page (mixte)`}
                             </span>
                        </div>
                    </div>

                    <input 
                        type="range" 
                        min="1" 
                        max="50" 
                        step="1"
                        value={pageCount}
                        onChange={(e) => setPageCount(parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                        <span>Landing Page (1-5p)</span>
                        <span>Site XXL (50p)</span>
                    </div>

                    <p className="text-xs text-blue-600 flex items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Vous pourrez ajouter des pages supplémentaires à tout moment depuis votre espace client.</span>
                    </p>
                </div>
            </div>

            {/* 3. OPTION SEO */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-bold">3</span>
                        Option Référencement (SEO)
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                     <button 
                        onClick={() => setSeoOption('basic')}
                        className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                            seoOption === 'basic' 
                            ? 'border-gray-300 bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-gray-900 text-lg">SEO de Base</span>
                            {seoOption === 'basic' && <CheckCircle2 className="w-5 h-5 text-gray-700" />}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Indexation Google, balises Meta automatiques, structure propre.</p>
                        <div className="inline-block bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">
                            INCLUS
                        </div>
                    </button>

                    <button 
                        onClick={() => setSeoOption('advanced')}
                        className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                            seoOption === 'advanced' 
                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                         <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-indigo-900 text-lg flex items-center">
                                SEO Avancé <Zap className="w-4 h-4 ml-2 fill-current text-indigo-600" />
                            </span>
                            {seoOption === 'advanced' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Recherche mots-clés, rédaction optimisée, balisage Schema, maillage interne.</p>
                        <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">
                            +{PRICE_SEO_ADVANCED_PER_PAGE}€ HT / page
                        </div>
                    </button>
                </div>
            </div>

            {/* 4. MAINTENANCE & HEBERGEMENT */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                     <h3 className="font-bold text-gray-900 flex items-center">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 font-bold">4</span>
                        Maintenance, suivi & Hébergement
                    </h3>
                    
                    {/* Toggle Switch */}
                    <button 
                        onClick={() => setHasMaintenance(!hasMaintenance)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${hasMaintenance ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${hasMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
                
                {hasMaintenance ? (
                    <div className="p-6 animate-fade-in-up">
                         {/* Billing Frequency Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-100 p-1 rounded-lg flex items-center relative">
                                <button 
                                    onClick={() => setBillingCycle('monthly')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Mensuel
                                </button>
                                <button 
                                    onClick={() => setBillingCycle('yearly')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    Annuel
                                    <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1.5 rounded-full font-bold">-10%</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex items-start">
                            <Server className="w-10 h-10 text-blue-600 mr-4 mt-1 bg-white p-2 rounded-lg shadow-sm" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-900">Forfait Sérénité</h4>
                                        <p className="text-sm text-gray-600 mt-1">Hébergement sécurisé, certificat SSL, mises à jour techniques et support prioritaire inclus.</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {maintenanceMonthlyPrice.toFixed(0)}€<span className="text-sm font-normal text-gray-500">/mois</span>
                                        </div>
                                        {billingCycle === 'yearly' && (
                                            <div className="text-xs text-green-600 font-medium">Facturé { (maintenanceMonthlyPrice * 12).toFixed(0) }€ / an</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-gray-50/50">
                        <div className="flex items-start text-gray-600 text-sm">
                            <Shield className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                            <p>
                                En désactivant la maintenance, vous serez responsable de l'hébergement, de la gestion du nom de domaine et des mises à jour de sécurité. Aucun support technique ne sera inclus après la livraison.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 sticky top-24">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                    <h3 className="font-bold text-gray-900 text-lg">Votre Devis</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    
                    {/* One Shot Fees */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Frais de création</p>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-700">Pack {pageCount} pages</span>
                            <span className="font-semibold text-gray-900">{baseCreationCost}€</span>
                        </div>
                        {siteType === 'ecommerce' && (
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-700 flex items-center"><Package className="w-3 h-3 mr-1 text-purple-600"/> Setup E-commerce</span>
                                <span className="font-semibold text-gray-900">{ecommerceSupplement}€</span>
                            </div>
                        )}
                         {seoCost > 0 && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-700 flex items-center"><Zap className="w-3 h-3 mr-1 text-indigo-500"/> Option SEO Avancé</span>
                                <span className="font-semibold text-gray-900">{seoCost}€</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                            <span className="text-sm font-bold text-gray-800">Sous-total Création</span>
                            <span className="font-bold text-gray-900">{baseCreationCost + ecommerceSupplement + seoCost}€ HT</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-gray-200"></div>

                    {/* Recurring Fees */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Maintenance, suivi & Hébergement</p>
                        {hasMaintenance ? (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-700">Forfait {siteType === 'vitrine' ? 'Vitrine' : 'E-commerce'}</span>
                                    <span className="font-semibold text-gray-900">{maintenanceMonthlyPrice.toFixed(0)}€ /mois</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Facturation</span>
                                    <span className="flex items-center">
                                        {billingCycle === 'yearly' ? (
                                            <>Annuelle <span className="bg-green-100 text-green-700 px-1 rounded ml-1">-10%</span></>
                                        ) : 'Mensuelle'}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 italic">sans maintenance</p>
                        )}
                    </div>

                    {/* Total Action */}
                    <div className="pt-4 mt-2">
                         <div className="bg-blue-50/50 p-4 rounded-xl mb-4 border border-blue-100">
                            <div className="flex justify-between items-end">
                                <span className="text-sm text-gray-800 font-medium">À régler aujourd'hui</span>
                                <span className="text-2xl font-bold text-blue-600">{totalPayableToday.toFixed(0)}€<span className="text-xs font-normal text-gray-500"> HT</span></span>
                            </div>
                            {hasMaintenance && (
                                <p className="text-xs text-gray-600 mt-1 text-right">
                                    Inclut Création + {billingCycle === 'yearly' ? '1 an' : '1 mois'} de maintenance
                                </p>
                            )}

                            {/* PayPal 4x Logic for Web */}
                            {isEligibleFor4x && (
                                <div className="mt-4 pt-3 border-t border-blue-200 space-y-3">
                                    <p className="text-xs font-bold text-gray-800 mb-2">
                                        Paiement sécurisé par Carte bancaire, Virement ou PayPal
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-blue-800 font-medium flex items-center">
                                            <CreditCard className="w-3 h-3 mr-1.5" />
                                            Option 4x sans frais
                                        </p>
                                        <span className="text-xs font-bold text-blue-600">
                                            4 x {(totalPayableToday / 4).toFixed(2)}€
                                        </span>
                                    </div>
                                    <button 
                                        onClick={handlePaypal4x}
                                        disabled={isPaypalLoading}
                                        className="w-full py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                                    >
                                        {isPaypalLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 mr-1.5" />}
                                        Paiement en 4x sans frais ({ (totalPayableToday / 4).toFixed(0) }€/mois)
                                    </button>
                                    <p className="text-[10px] text-gray-400 text-center italic">*Disponible pour les montants &lt; 2000€</p>
                                </div>
                            )}
                         </div>
                        <button 
                            onClick={handleOrder}
                            className={`w-full py-3 text-white rounded-xl font-bold shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center justify-center bg-blue-600 hover:bg-blue-700`}
                        >
                            Créer mon site <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>

                    <div className="flex items-center justify-center text-xs text-gray-400">
                        <HelpCircle className="w-3 h-3 mr-1" />
                        Besoin d'un devis personnalisé ? Contactez-nous.
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WebCreationPage;
