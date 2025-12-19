import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import GlobalDashboard from './components/pages/GlobalDashboard';
import Toast from './components/Toast';
import PostsPage from './components/pages/PostsPage';
import ReviewsPage from './components/pages/ReviewsPage';
import SeoPage from './components/pages/SeoPage';
import CompetitorsPage from './components/pages/CompetitorsPage';
import SettingsPage from './components/pages/SettingsPage';
import SeoNetlinkingPage from './components/pages/SeoNetlinkingPage';
import SubscriptionPage from './components/pages/SubscriptionPage';
import SocialPerformancePage from './components/pages/SocialPerformancePage';
import SocialCompetitorsPage from './components/pages/SocialCompetitorsPage';
import SeoPerformancePage from './components/pages/SeoPerformancePage';
import SeoCompetitorsPage from './components/pages/SeoCompetitorsPage';
import GmbPerformancePage from './components/pages/GmbPerformancePage';
import WebCreationPage from './components/pages/WebCreationPage';
import WebManagementPage from './components/pages/WebManagementPage';
import ReferralPage from './components/pages/ReferralPage';
import LandingPage from './components/landing/LandingPage';
import { Loader2, X, Phone, Lock } from 'lucide-react';
import { sendToWorkflow } from './services/api';
import { API_CONFIG } from './config';

// --- LOCK SCREEN COMPONENT - FORCE LIGHT MODE ---
const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'Tutrouvespas69') {
            sessionStorage.setItem('site_unlocked', 'true');
            onUnlock();
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                    <Lock className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Restreint</h1>
                <p className="text-gray-500 mb-8 text-sm">Veuillez entrer le mot de passe pour accéder au site.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Mot de passe"
                            className={`w-full px-4 py-3.5 bg-white border rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400 text-center tracking-widest transition-all ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
                            autoFocus
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs font-bold animate-pulse">Mot de passe incorrect</p>
                    )}
                    <button 
                        type="submit" 
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-100"
                    >
                        Déverrouiller
                    </button>
                </form>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [callbackData, setCallbackData] = useState({ name: '', phone: '', slot: '' });

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setCallbackLoading(true);
      await sendToWorkflow(API_CONFIG.ONBOARDING_WORKFLOW_URL, { ...callbackData, intent: 'callback_request' });
      setCallbackLoading(false);
      setCallbackSuccess(true);
      setTimeout(() => {
          setShowCallbackModal(false);
          setCallbackSuccess(false);
          setCallbackData({ name: '', phone: '', slot: '' });
      }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const isDashboardRoute = currentPath === '/espace-client';

  if (isDashboardRoute) {
      if (!user) {
          return <LandingPage onNavigate={navigate} initialAuthOpen={true} />;
      }

      const getPageTitle = () => {
        switch(activeTab) {
          case 'dashboard': return "Vue d'ensemble";
          case 'gmb-posts': return "GMB - Mes Posts";
          case 'gmb-reviews': return "GMB - Avis Clients";
          case 'gmb-competitors': return "GMB - Concurrents";
          case 'gmb-performance': return "GMB - Performances";
          case 'meta-calendar': return "Social - Calendrier";
          case 'social-performance': return "Social - Performances";
          case 'social-competitors': return "Social - Concurrents";
          case 'seo-list': return "SEO - Mes Articles";
          case 'seo-netlinking': return "SEO - Netlinking & DA";
          case 'seo-performance': return "SEO - Performances";
          case 'seo-competitors': return "SEO - Concurrents";
          case 'web-creation': return "Création Site Web";
          case 'web-management': return "Gérer mon site";
          case 'subscription': return "Mon Abonnement";
          case 'referral': return "Programme Parrainage";
          case 'settings': return "Réglages Système";
          default: return "Vue d'ensemble";
        }
      };

      const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <GlobalDashboard onNavigate={setActiveTab} />;
            case 'gmb-posts': return <PostsPage type="gmb" showToast={showToast} />;
            case 'gmb-reviews': return <ReviewsPage showToast={showToast} />;
            case 'gmb-competitors': return <CompetitorsPage />;
            case 'gmb-performance': return <GmbPerformancePage />;
            case 'meta-calendar': return <PostsPage type="social" showToast={showToast} />;
            case 'social-performance': return <SocialPerformancePage />;
            case 'social-competitors': return <SocialCompetitorsPage />;
            case 'seo-list': return <SeoPage showToast={(msg) => showToast(msg, 'success')} />;
            case 'seo-netlinking': return <SeoNetlinkingPage />;
            case 'seo-performance': return <SeoPerformancePage />;
            case 'seo-competitors': return <SeoCompetitorsPage />;
            case 'web-creation': return <WebCreationPage />;
            case 'web-management': return <WebManagementPage showToast={showToast} onNavigate={setActiveTab} />;
            case 'subscription': return <SubscriptionPage />;
            case 'referral': return <ReferralPage />;
            case 'settings': return <SettingsPage showToast={(msg) => showToast(msg, 'success')} />;
            default: return <GlobalDashboard onNavigate={setActiveTab} />;
        }
      };

      return (
        <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
          <Sidebar 
            mobileOpen={mobileOpen} 
            setMobileOpen={setMobileOpen} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onReturnHome={() => navigate('/')}
            onLogout={() => {
              signOut();
              navigate('/');
            }}
            onOpenCallbackModal={() => setShowCallbackModal(true)}
          />
          
          <div className="flex flex-col flex-1 w-full overflow-hidden relative">
            <Header onMenuClick={() => setMobileOpen(true)} title={getPageTitle()} />
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative custom-scrollbar">
              <div className="max-w-7xl mx-auto space-y-6 pb-10">{renderContent()}</div>
            </main>
          </div>

          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

          {showCallbackModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-blue-900/10 backdrop-blur-sm">
                  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up border border-gray-100">
                      <button onClick={() => setShowCallbackModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">×</button>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Être rappelé</h2>
                      <p className="text-sm text-gray-500 mb-8">Laissez-nous vos coordonnées, nous vous rappelons sur le créneau de votre choix.</p>
                      
                      {callbackSuccess ? (
                          <div className="text-center py-8">
                              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                                  <Phone className="w-8 h-8"/>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">Demande enregistrée !</h3>
                              <p className="text-gray-500 mt-2">À très vite.</p>
                          </div>
                      ) : (
                          <form onSubmit={handleCallbackSubmit} className="space-y-4">
                              <input type="text" placeholder="Nom complet" required value={callbackData.name} onChange={e => setCallbackData({...callbackData, name: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                              <input type="tel" placeholder="Téléphone mobile" required value={callbackData.phone} onChange={e => setCallbackData({...callbackData, phone: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                              
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Période souhaitée</label>
                                  <select required value={callbackData.slot} onChange={e => setCallbackData({...callbackData, slot: e.target.value})} className="w-full p-3.5 bg-white border border-gray-200 text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all">
                                      <option value="">Sélectionner...</option>
                                      <option value="Matin (9h - 12h)">Matin (9h - 12h)</option>
                                      <option value="Après-midi (13h - 17h)">Après-midi (13h - 17h)</option>
                                      <option value="Soirée (18h - 22h)">Soirée (18h - 22h)</option>
                                  </select>
                              </div>

                              <button type="submit" disabled={callbackLoading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex justify-center shadow-lg shadow-blue-100 transition-colors mt-6">
                                  {callbackLoading ? <Loader2 className="animate-spin"/> : 'Me faire rappeler'}
                              </button>
                          </form>
                      )}
                  </div>
              </div>
          )}
        </div>
      );
  }

  return <LandingPage onNavigate={navigate} />;
};

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState(() => {
      try { return sessionStorage.getItem('site_unlocked') !== 'true'; } catch (e) { return true; }
  });
  if (isLocked) return <LockScreen onUnlock={() => setIsLocked(false)} />;
  return <AuthProvider><AppContent /></AuthProvider>;
};

export default App;