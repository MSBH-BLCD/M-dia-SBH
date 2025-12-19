
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { sendToWorkflow } from '../../services/api';
import { API_CONFIG } from '../../config';
import { 
  Store, Search, Menu, X, Zap, Smartphone, CheckCircle2, ArrowRight,
  Layout, CreditCard, ShieldCheck, MousePointer2, Loader2, LogIn, Star,
  TrendingUp, Users, MapPin, Globe, PenTool, Phone, ShoppingBag, Calculator, Sliders, Info, Check, Calendar, Clock, User, Mail, Server, FileText, AlertTriangle, Monitor, BarChart3, ChevronRight, Facebook, Instagram, Linkedin, Twitter, LayoutTemplate, Target, HelpCircle, MessageSquare, Rocket, ThumbsUp, Heart, Share2, MessageCircle, Gift, Sparkles, Navigation, Lock, Link as LinkIcon, Copy
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  initialAuthOpen?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, initialAuthOpen = false }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(initialAuthOpen);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authBusinessName, setAuthBusinessName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Update modal visibility if prop changes (e.g. redirected from protected route)
  useEffect(() => {
    if (initialAuthOpen) {
        setShowAuthModal(true);
    }
  }, [initialAuthOpen]);

  // --- STATE: QUOTE MODAL (DEVIS) ---
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteData, setQuoteData] = useState({
      businessName: '',
      email: '',
      phone: ''
  });

  // --- STATE: APPOINTMENT MODAL ---
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [rdvData, setRdvData] = useState({
      name: '',
      phone: '',
      email: '',
      date: '',
      slot: ''
  });

  // --- STATE: CALLBACK MODAL ---
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [callbackSuccess, setCallbackSuccess] = useState(false);
  const [callbackData, setCallbackData] = useState({
      name: '',
      phone: '',
      slot: '' // Matin, Après-midi, Soirée
  });

  // --- STATE: REFERRAL GENERATOR MODAL ---
  const [showReferralGenModal, setShowReferralGenModal] = useState(false);
  const [refBusinessName, setRefBusinessName] = useState('');
  const [generatedRefLink, setGeneratedRefLink] = useState('');
  const [refCopied, setRefCopied] = useState(false);

  // Calculate min date (Today + 1 day for realism)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  // Generate 3 random slots based on constraints
  const generateSlotsForDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const day = date.getDay(); // 0 = Sun, 6 = Sat
      
      if (day === 0) return []; // No Sunday

      // Constraints: Mon-Fri: 14h-22h, Sat: 14h-17h
      const startHour = 14;
      const endHour = day === 6 ? 17 : 22; 
      
      // Generate all possible 15min blocks in range
      const possibleStarts = [];
      for (let h = startHour; h < endHour; h++) {
          possibleStarts.push(`${h}h00`);
          possibleStarts.push(`${h}h15`);
          possibleStarts.push(`${h}h30`);
          possibleStarts.push(`${h}h45`);
      }

      // Randomly select 3 unique slots
      const shuffled = possibleStarts.sort(() => 0.5 - Math.random());
      const selectedStarts = shuffled.slice(0, 3).sort(); // Sort chronologically

      return selectedStarts.map(start => {
          // Calculate end time
          const [hStr, mStr] = start.split('h');
          let h = parseInt(hStr);
          let m = parseInt(mStr);
          
          let endM = m + 15;
          let endH = h;
          if (endM >= 60) {
              endM -= 60;
              endH += 1;
          }
          
          const endStr = `${endH}h${endM.toString().padStart(2, '0')}`;
          return `${start} - ${endStr}`;
      });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const date = e.target.value;
      setRdvData({ ...rdvData, date, slot: '' });
      const newSlots = generateSlotsForDate(date);
      setAvailableSlots(newSlots);
  };

  // --- STATE: TABS (WEB vs MARKETING) ---
  const [activeCalculatorTab, setActiveCalculatorTab] = useState<'marketing' | 'web'>('web');

  // --- STATE: WEB CALCULATOR ---
  const [webType, setWebType] = useState<'vitrine' | 'ecommerce'>('vitrine');
  const [webPages, setWebPages] = useState(5);
  const [webMaintenance, setWebMaintenance] = useState(true);
  const [seoOption, setSeoOption] = useState<'basic' | 'advanced'>('basic');
  const [productVolumeTier, setProductVolumeTier] = useState(0); // 0: 0-49, 1: 50-99, etc.
  
  // Pricing Constants Web
  const PRICE_WEB_PAGE_TIER1 = 225; // 1-5 pages
  const PRICE_WEB_PAGE_TIER2 = 199; // 6-10 pages
  const PRICE_WEB_PAGE_TIER3 = 179; // 11+ pages
  const PRICE_WEB_MAINTENANCE = webType === 'vitrine' ? 49 : 72;
  const PRICE_ECOMMERCE_SETUP = 199;
  const PRICE_SEO_ADVANCED_PER_PAGE = 79;

  // Product Tiers Pricing
  const PRODUCT_TIERS = [
      { label: '1 - 49 produits (Inclus)', price: 0 },
      { label: '50 - 99 produits (+230€)', price: 230 },
      { label: '100 - 199 produits (+440€)', price: 440 },
      { label: '200 - 499 produits (+870€)', price: 870 },
      { label: '500+ produits (Sur devis)', price: 0, manual: true }
  ];

  const calculateWebPrice = () => {
      let cost = 0;
      // Tier 1: Pages 1-5
      const tier1Pages = Math.min(webPages, 5);
      cost += tier1Pages * PRICE_WEB_PAGE_TIER1;
      
      // Tier 2: Pages 6-10
      if (webPages > 5) {
          const tier2Pages = Math.min(webPages - 5, 5);
          cost += tier2Pages * PRICE_WEB_PAGE_TIER2;
      }
      
      // Tier 3: Pages 11+
      if (webPages > 10) {
          const tier3Pages = webPages - 10;
          cost += tier3Pages * PRICE_WEB_PAGE_TIER3;
      }

      // Ecommerce Supplement
      if (webType === 'ecommerce') {
          cost += PRICE_ECOMMERCE_SETUP;
          cost += PRODUCT_TIERS[productVolumeTier].price;
      }

      // SEO Supplement
      if (seoOption === 'advanced') {
          cost += webPages * PRICE_SEO_ADVANCED_PER_PAGE;
      }
      
      return cost;
  };
  const webCreationPrice = calculateWebPrice();
  const webTotalToday = webCreationPrice + (webMaintenance ? PRICE_WEB_MAINTENANCE : 0);
  const isWebEligibleFor4x = webTotalToday <= 2000;


  // --- STATE: MARKETING CALCULATOR ---
  // Default Config: Start at 4 for everyone
  const [customGmb, setCustomGmb] = useState(4); 
  const [customSocial, setCustomSocial] = useState(4);
  const [customBlog, setCustomBlog] = useState(4);
  
  // Toggles for modules
  const [isGmbEnabled, setIsGmbEnabled] = useState(true);
  const [isSocialEnabled, setIsSocialEnabled] = useState(true);
  const [isBlogEnabled, setIsBlogEnabled] = useState(true);

  const [customSocialChannels, setCustomSocialChannels] = useState<string[]>(['facebook', 'instagram', 'linkedin']);

  // Packs Logic
  const selectPack = (pack: 'decouverte' | 'essentiel' | 'performance') => {
      if (pack === 'decouverte') {
          setIsGmbEnabled(true);
          setCustomGmb(4);
          
          setIsSocialEnabled(false);
          setCustomSocial(4); // Default hidden value
          
          setIsBlogEnabled(true);
          setCustomBlog(2);
          
          setCustomSocialChannels(['facebook', 'instagram']);
      } else if (pack === 'essentiel') {
          setIsGmbEnabled(true);
          setCustomGmb(4);
          
          setIsSocialEnabled(true);
          setCustomSocial(4);
          
          setIsBlogEnabled(true);
          setCustomBlog(2);
          
          setCustomSocialChannels(['facebook', 'instagram', 'linkedin']);
      } else if (pack === 'performance') {
          setIsGmbEnabled(true);
          setCustomGmb(8);
          
          setIsSocialEnabled(true);
          setCustomSocial(8);
          
          setIsBlogEnabled(true);
          setCustomBlog(7);
          
          setCustomSocialChannels(['facebook', 'instagram', 'linkedin', 'pinterest']);
      }
  };

  const toggleSocialChannel = (channel: string) => {
    if (customSocialChannels.includes(channel)) {
        setCustomSocialChannels(customSocialChannels.filter(c => c !== channel));
    } else {
        setCustomSocialChannels([...customSocialChannels, channel]);
    }
  };

  const calculateMarketingPrice = () => {
      let price = 0;
      // GMB: 4 posts = 29€ -> 7.25€/u
      if (isGmbEnabled) price += customGmb * 7.25; 
      
      // Social: 4 posts = 49€ -> 12.25€/u
      if (isSocialEnabled) {
          price += customSocial * 12.25; 
          
          // Options Social (Updated to 49€)
          if (customSocialChannels.includes('linkedin')) price += 49;
          if (customSocialChannels.includes('pinterest')) price += 49;
      }

      // Blog: 2 articles min. 4 articles = 49€ -> 12.25€/u
      if (isBlogEnabled) price += customBlog * 12.25;

      return Math.round(price);
  };
  const marketingTotalPrice = calculateMarketingPrice();

  // Validation Rules Marketing
  const isGmbValid = !isGmbEnabled || customGmb >= 4;
  const isSocialValid = !isSocialEnabled || customSocial >= 4;
  const isBlogValid = !isBlogEnabled || customBlog >= 2;
  const isValidConfig = isGmbValid && isSocialValid && isBlogValid && marketingTotalPrice > 0;

  // Dynamic Features List
  const activeFeatures = [
    "Dashboard complet",
    "Technologie Smart",
    "Support client & Chat",
    "Reporting mensuel",
    ...(isGmbEnabled ? ["Réponse aux avis Google", "Optimisation fiche GMB"] : []),
    ...(isSocialEnabled ? ["Posts Facebook & Instagram (Inclus)", "Création des visuels & Captions"] : []),
    ...(isSocialEnabled && customSocialChannels.includes('linkedin') ? ["Diffusion LinkedIn"] : []),
    ...(isSocialEnabled && customSocialChannels.includes('pinterest') ? ["Diffusion Pinterest"] : []),
    ...(isBlogEnabled ? ["Rédaction articles SEO", "Intégration CMS (Wordpress/Wix)"] : [])
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    try {
      let result;
      if (authMode === 'signup') {
        result = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    business_name: authBusinessName
                }
            }
        });
        if (result.error) throw result.error;
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
      }
      setShowAuthModal(false);
      onNavigate('/espace-client');
    } catch (err: any) {
      setAuthError(err.message || "Une erreur est survenue");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleClientSpaceClick = () => {
      if (user) {
          onNavigate('/espace-client');
      } else {
          setShowAuthModal(true);
      }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setQuoteLoading(true);
      // Simulate sending quote request
      await sendToWorkflow(API_CONFIG.ONBOARDING_WORKFLOW_URL, { 
          ...quoteData, 
          intent: 'quote_request',
          source: 'landing_page' 
      });
      setQuoteLoading(false);
      setQuoteSuccess(true);
      setTimeout(() => {
          setShowQuoteModal(false);
          setQuoteSuccess(false);
          setQuoteData({ businessName: '', email: '', phone: '' });
      }, 3000);
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAppointmentLoading(true);
      await sendToWorkflow(API_CONFIG.ONBOARDING_WORKFLOW_URL, { ...rdvData, intent: 'appointment_booking' });
      setAppointmentLoading(false);
      setAppointmentSuccess(true);
      setTimeout(() => {
          setShowAppointmentModal(false);
          setAppointmentSuccess(false);
          setRdvData({ name: '', phone: '', email: '', date: '', slot: '' });
          setAvailableSlots([]);
      }, 3000);
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

  const handleGenerateLink = (e: React.FormEvent) => {
      e.preventDefault();
      if(refBusinessName.trim()) {
          const slug = refBusinessName.trim().replace(/\s+/g, '-').toUpperCase();
          const randomId = Math.floor(Math.random() * 10000);
          setGeneratedRefLink(`https://mediasbh.com/ref/${slug}-${randomId}`);
      }
  };

  // --- LOGO COMPONENT (St Barth Map) ---
  const StBarthLogo = ({ className = "h-12 w-auto" }) => (
    <svg viewBox="0 0 810 817.92" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="fe8b7e56d7"><path d="M 30 227 L 760 227 L 760 624 L 30 624 Z M 30 227 " clipRule="nonzero"/></clipPath>
            <clipPath id="4fef6b6601"><path d="M 23.101562 231.648438 L 738.476562 150.785156 L 786.824219 578.519531 L 71.449219 659.382812 Z M 23.101562 231.648438 " clipRule="nonzero"/></clipPath>
            <clipPath id="9c6af801e8"><path d="M 23.101562 231.648438 L 738.476562 150.785156 L 786.824219 578.519531 L 71.449219 659.382812 Z M 23.101562 231.648438 " clipRule="nonzero"/></clipPath>
        </defs>
        <g clipPath="url(#fe8b7e56d7)">
            <g clipPath="url(#4fef6b6601)">
                <g clipPath="url(#9c6af801e8)">
                    <path fill="currentColor" d="M 385.160156 621.972656 C 377.425781 624.347656 368.84375 623.902344 361.386719 620.75 C 357.683594 619.1875 354.121094 616.835938 352.277344 613.265625 C 350.1875 609.230469 350.648438 604.410156 350.527344 599.863281 C 350.421875 595.308594 349.316406 590.1875 345.417969 587.828125 C 342.070312 585.800781 337.488281 586.40625 334.386719 583.988281 C 332.101562 582.203125 331.195312 579.242188 329.953125 576.628906 C 328.171875 572.878906 325.1875 569.542969 321.871094 567.03125 C 312.828125 568.824219 302.929688 562.757812 300.425781 553.882812 C 299.425781 550.351562 299.34375 546.25 296.71875 543.675781 C 295.078125 542.066406 292.757812 541.394531 290.902344 540.058594 C 282.269531 533.847656 286.875 516.941406 277.222656 512.445312 C 272.4375 510.21875 266.914062 512.664062 261.65625 513.230469 C 248.1875 514.695312 236.886719 503.828125 227.738281 493.839844 C 224.378906 490.164062 220.929688 486.371094 219.246094 481.675781 C 217.550781 476.996094 218.03125 471.171875 221.734375 467.820312 C 228.152344 462.023438 238.65625 467.394531 243.695312 474.4375 C 248.734375 481.476562 251.933594 490.433594 259.460938 494.714844 C 261.375 495.808594 263.6875 496.523438 265.785156 495.851562 C 271.746094 493.90625 269.425781 484.855469 265.585938 479.894531 C 258.914062 471.300781 250.9375 463.703125 242.039062 457.449219 C 234.5 452.164062 225.308594 446.160156 225.289062 436.960938 C 225.277344 432.589844 227.507812 428.34375 227.015625 423.996094 C 226.417969 418.699219 221.765625 414.574219 216.683594 412.929688 C 211.597656 411.289062 206.128906 411.644531 200.804688 412.015625 C 201.234375 406.015625 200.972656 398.683594 195.703125 395.796875 C 193.1875 394.417969 190.132812 394.5 187.261719 394.636719 C 173.058594 395.265625 158.859375 395.90625 144.65625 396.535156 C 146.683594 390.488281 142.800781 383.578125 137.132812 380.648438 C 131.464844 377.71875 124.597656 378.097656 118.46875 379.871094 C 120.164062 371.660156 109.09375 367.226562 104.6875 360.097656 C 103.101562 357.539062 102.394531 354.511719 100.777344 351.96875 C 95.164062 343.054688 82.167969 343.765625 71.796875 345.535156 C 69.519531 333.5 67.851562 321.355469 66.765625 309.15625 C 53.726562 310.28125 38.0625 310.214844 30.769531 299.359375 C 40.503906 288.59375 59.71875 292.210938 69.90625 281.875 C 74.667969 277.050781 76.484375 269.511719 74.457031 263.046875 C 72.425781 256.570312 66.628906 251.4375 59.957031 250.210938 C 56.054688 249.484375 51.988281 250 48.128906 249.125 C 44.265625 248.234375 40.351562 245.207031 40.53125 241.25 C 46.484375 236.65625 52.5625 231.988281 59.632812 229.425781 C 66.707031 226.863281 75.058594 226.707031 81.347656 230.863281 C 90.136719 236.679688 92.160156 248.492188 93.386719 258.96875 C 98.484375 258.667969 102.484375 263.613281 103.828125 268.546875 C 105.175781 273.484375 104.839844 278.769531 106.28125 283.667969 C 108.511719 291.257812 116.0625 297.578125 123.894531 296.429688 C 131.726562 295.296875 137.144531 284.917969 132.28125 278.671875 C 135.929688 276.902344 140.3125 279.542969 142.585938 282.902344 C 144.863281 286.261719 145.976562 290.320312 148.46875 293.523438 C 156.261719 303.53125 171.914062 300.117188 183.8125 295.753906 C 186.667969 294.699219 189.714844 293.523438 191.457031 291.023438 C 192.835938 289.046875 193.179688 286.542969 194.15625 284.332031 C 197.449219 276.816406 206.742188 274.425781 214.8125 272.945312 C 224.011719 271.261719 233.195312 269.582031 242.394531 267.902344 C 244.238281 280.335938 247 295.609375 248.84375 308.039062 C 255.5625 312.675781 264.988281 313.007812 272.015625 308.863281 C 275.816406 306.625 280.09375 303.066406 284.035156 305.054688 C 285.566406 305.828125 286.609375 307.316406 287.488281 308.789062 C 289.855469 312.675781 291.761719 317.171875 291.046875 321.667969 C 290.328125 326.167969 286.132812 330.332031 281.65625 329.554688 C 282.925781 333.929688 284.207031 338.304688 285.472656 342.683594 C 290.203125 340.542969 296.234375 346.042969 294.546875 350.957031 C 297.035156 350.808594 299.527344 350.65625 302.03125 350.503906 C 302.441406 353.097656 302.851562 355.707031 303.246094 358.300781 C 312.742188 356.132812 324.535156 354.710938 330.535156 362.375 C 336.105469 369.472656 332.585938 380.511719 325.773438 386.414062 C 322.890625 388.914062 319.125 392.734375 321.449219 395.765625 C 322.273438 396.839844 323.636719 397.300781 324.878906 397.859375 C 331.695312 400.878906 336.195312 407.558594 342.605469 411.367188 C 353.53125 417.859375 367.375 414.835938 379.667969 411.625 C 384.367188 410.394531 389.566406 408.800781 391.960938 404.578125 C 394.371094 400.355469 390.867188 393.34375 386.222656 394.804688 C 383.417969 382.523438 395.652344 372.480469 406.34375 365.816406 C 416.054688 359.761719 425.78125 353.722656 435.820312 348.226562 C 437.082031 354.5 438.800781 361.070312 443.386719 365.523438 C 447.960938 369.992188 456.441406 372.15625 460.667969 367.359375 C 467.644531 371.953125 477.257812 366.566406 481.707031 359.488281 C 486.15625 352.410156 487.804688 343.792969 492.664062 337.003906 C 498.042969 329.5 506.96875 324.746094 511.015625 316.457031 C 516.296875 305.640625 511.570312 292.835938 506.835938 281.78125 C 513.988281 274.132812 521.144531 266.488281 528.3125 258.839844 C 529.703125 257.355469 531.390625 255.75 533.410156 255.945312 C 535.648438 256.144531 537.042969 258.421875 537.957031 260.460938 C 541.042969 267.359375 542.847656 274.824219 543.289062 282.355469 C 546.753906 279.585938 551.742188 281.9375 555.761719 283.816406 C 559.777344 285.695312 565.863281 286.246094 567.421875 282.105469 C 567.957031 280.671875 567.761719 278.945312 568.6875 277.71875 C 570.148438 275.789062 573.164062 276.425781 575.414062 275.558594 C 579.035156 274.171875 579.777344 269.539062 580.90625 265.839844 C 582.03125 262.140625 586.015625 258.175781 589.199219 260.398438 C 589.066406 274.335938 605.125 287.65625 598.257812 299.789062 C 594.285156 306.8125 583.371094 310.628906 584.453125 318.625 C 585.003906 322.734375 588.984375 325.695312 593.058594 326.414062 C 597.136719 327.148438 601.308594 326.140625 605.324219 325.144531 C 604.945312 317.550781 605.277344 308.488281 611.675781 304.335938 C 614.132812 302.746094 617.105469 302.207031 619.75 300.960938 C 624.785156 298.570312 628.394531 293.714844 633.53125 291.574219 C 638.683594 289.429688 646.632812 292.703125 645.367188 298.136719 C 644.898438 300.171875 643.277344 301.683594 641.925781 303.292969 C 636.246094 310.058594 635.101562 320.308594 639.167969 328.144531 C 646.113281 334.285156 657.21875 339.253906 663.964844 332.894531 C 669.023438 328.121094 668.097656 320.0625 668.742188 313.136719 C 669.390625 306.210938 674.960938 297.972656 681.464844 300.457031 C 684.058594 301.449219 685.75 303.894531 687.277344 306.203125 C 693.011719 314.898438 699.027344 325.140625 696.058594 335.140625 C 695.296875 337.691406 693.992188 340.070312 693.542969 342.6875 C 692.59375 348.347656 696.53125 354.417969 702.101562 355.847656 C 706.058594 358.972656 712.398438 356.765625 715.0625 352.484375 C 717.730469 348.203125 717.535156 342.746094 716.507812 337.800781 C 727.28125 333.667969 736.746094 326.210938 743.269531 316.699219 C 745.519531 313.410156 749.21875 309.375 752.644531 311.410156 C 753.738281 312.058594 754.421875 313.207031 754.945312 314.355469 C 757.199219 319.21875 757.542969 324.953125 755.871094 330.042969 C 754.960938 332.8125 753.480469 335.457031 753.257812 338.371094 C 752.867188 343.328125 756.121094 347.726562 757.929688 352.363281 C 762.878906 365.058594 755.117188 381.140625 742.117188 385.175781 C 746.996094 403.082031 750.023438 421.476562 751.113281 440 C 751.253906 442.417969 751.347656 444.929688 750.433594 447.164062 C 747.207031 454.992188 735.78125 453.46875 727.828125 450.578125 C 727.398438 448.308594 726.761719 446.835938 726.707031 444.523438 C 726.421875 433.882812 716.660156 424.386719 706.003906 424.410156 C 694.445312 424.417969 685.234375 433.757812 678.160156 442.894531 C 671.089844 452.035156 663.863281 462.296875 652.796875 465.621094 C 645.914062 467.695312 638.257812 466.769531 631.675781 469.683594 C 623.875 473.148438 619.21875 481.238281 612.238281 486.167969 C 609.160156 488.339844 605.511719 489.992188 603.402344 493.117188 C 600.679688 497.140625 601.21875 502.445312 601.863281 507.242188 C 603.945312 522.796875 606.035156 538.351562 608.117188 553.90625 C 596.9375 554.191406 593.464844 572.621094 582.300781 573.429688 C 575.316406 573.941406 570.273438 567.136719 566.679688 561.125 C 563.875 556.441406 561.089844 551.769531 558.285156 547.085938 C 556.089844 543.414062 553.328125 539.351562 549.082031 538.796875 C 545.867188 538.371094 542.6875 540.144531 539.472656 539.808594 C 532.59375 539.085938 530.023438 529.886719 523.746094 526.980469 C 516.363281 523.554688 508.402344 530.15625 503.222656 536.429688 C 498.042969 542.699219 491.273438 550.011719 483.351562 548.179688 C 483.945312 558.070312 484.554688 567.972656 485.148438 577.867188 C 478.132812 576.675781 471.320312 574.207031 465.160156 570.648438 C 466.019531 581.105469 466.898438 591.5625 467.757812 602.019531 C 463.113281 604.921875 457.550781 600.199219 454.136719 595.9375 C 448.148438 588.460938 442.167969 580.972656 436.175781 573.5 C 433.445312 570.09375 430.597656 566.578125 426.6875 564.628906 C 420.089844 561.335938 411.734375 563.375 406.105469 568.152344 C 400.476562 572.914062 397.214844 579.917969 395.144531 586.988281 C 392.035156 597.664062 391.320312 609.027344 393.085938 619.996094 C 390.335938 617.464844 388.71875 620.824219 385.140625 621.914062 Z M 385.160156 621.972656 " fillOpacity="1" fillRule="nonzero"/></g></g></g></svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
               {/* App Icon Style Logo */}
               <div className="flex items-center gap-3">
                   <div className="relative flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                       <StBarthLogo className="w-6 h-6 text-white" />
                   </div>
                   <span className="text-xl font-bold tracking-tight text-gray-900">Média SBH</span>
               </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={() => { setActiveCalculatorTab('web'); scrollToSection('simulator-section'); }} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Site Web</button>
              <button onClick={() => { setActiveCalculatorTab('marketing'); scrollToSection('simulator-section'); }} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Marketing</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Fonctionnalités</button>
              <div className="h-5 w-px bg-gray-200"></div>
              
              <button 
                onClick={handleClientSpaceClick} 
                className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" /> 
                {user ? "Mon Espace" : "Espace Client"}
              </button>
              
              <div className="flex space-x-3">
                  <button onClick={() => setShowQuoteModal(true)} className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center">
                    <Sparkles className="w-3 h-3 mr-1.5" /> Obtenir un devis
                  </button>
                  <button onClick={() => setShowCallbackModal(true)} className="bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center">
                    <Phone className="w-3 h-3 mr-1.5" /> Être rappelé
                  </button>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 z-50 shadow-lg animate-fade-in-up">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => { setActiveCalculatorTab('web'); scrollToSection('simulator-section'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 font-medium text-gray-600 border-b border-gray-100">Site Web</button>
              <button onClick={() => { setActiveCalculatorTab('marketing'); scrollToSection('simulator-section'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 font-medium text-gray-600 border-b border-gray-100">Marketing</button>
              <button onClick={() => { handleClientSpaceClick(); setMobileMenuOpen(false); }} className="block w-full text-left py-3 font-medium text-blue-600">
                  {user ? "Mon Espace" : "Connexion Espace Client"}
              </button>
              
              <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                  <button onClick={() => { setShowQuoteModal(true); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform">
                      <Sparkles className="w-4 h-4 mr-2" /> Obtenir un devis
                  </button>
                  <button onClick={() => { setShowCallbackModal(true); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm active:bg-gray-200 transition-colors border border-gray-200">
                      <Phone className="w-4 h-4 mr-2" /> Être rappelé
                  </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-32 overflow-hidden bg-white">
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
             <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                
                <div className="text-left">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100 animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-ping"></span>
                        Des offres adaptées aux entrepreneurs, TPE/PME
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                        Des solutions digitales aux <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">prix imbattables.</span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                        Nous sommes le partenaire digital déterminé à développer vos canaux d'acquisition au profit de votre temps et de votre rentabilité, sans vous ruiner !
                        <br className="block" /><br className="block" />
                        Pour cela, nous proposons des offres 100% modulables à tarifs transparents et un tableau de bord ultra-simple, avec une assistance 24h/24 et 7j/7.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-4 mb-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                        <button onClick={() => { setActiveCalculatorTab('web'); scrollToSection('simulator-section'); }} className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
                            Accéder au simulateur
                        </button>
                        <button onClick={() => setShowAppointmentModal(true)} className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm">
                            Prendre RDV
                        </button>
                    </div>
                </div>

                {/* DASHBOARD MOCKUP (CSS ONLY) */}
                <div className="relative animate-fade-in-up hidden lg:block perspective-[2000px]" style={{animationDelay: '0.4s'}}>
                     {/* Floating Decoration */}
                     <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
                     <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>

                     {/* Main Dashboard Container */}
                     <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-y-6 rotate-x-6 hover:rotate-0 transition-all duration-700 ease-out shadow-blue-500/10">
                        {/* Fake Header */}
                        <div className="h-14 border-b border-gray-100 flex items-center px-4 justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className="flex space-x-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="h-4 w-32 bg-gray-100 rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-100"></div>
                            </div>
                        </div>
                        
                        <div className="flex">
                            {/* Fake Sidebar */}
                            <div className="w-48 bg-gray-50 border-r border-gray-100 p-4 hidden sm:block h-[400px]">
                                <div className="space-y-3">
                                    <div className="h-8 w-full bg-blue-100 rounded-lg flex items-center px-2"><div className="w-4 h-4 bg-blue-500 rounded mr-2"></div></div>
                                    <div className="h-8 w-full bg-transparent rounded-lg flex items-center px-2"><div className="w-4 h-4 bg-gray-300 rounded mr-2"></div></div>
                                    <div className="h-8 w-full bg-transparent rounded-lg flex items-center px-2"><div className="w-4 h-4 bg-gray-300 rounded mr-2"></div></div>
                                    <div className="h-8 w-full bg-transparent rounded-lg flex items-center px-2"><div className="w-4 h-4 bg-gray-300 rounded mr-2"></div></div>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <div className="h-2 w-16 bg-gray-200 rounded-full mb-2"></div>
                                    <div className="h-8 w-full bg-transparent rounded-lg flex items-center px-2"><div className="w-4 h-4 bg-gray-300 rounded mr-2"></div></div>
                                </div>
                            </div>

                            {/* Fake Content */}
                            <div className="flex-1 p-6 bg-white">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <div className="h-6 w-40 bg-gray-800 rounded-lg mb-2"></div>
                                        <div className="h-3 w-60 bg-gray-200 rounded-full"></div>
                                    </div>
                                    <div className="h-10 w-32 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30"></div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                                        <div className="h-8 w-8 rounded-full bg-green-100 mb-2"></div>
                                        <div className="h-6 w-16 bg-gray-800 rounded mb-1"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 mb-2"></div>
                                        <div className="h-6 w-16 bg-gray-800 rounded mb-1"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 mb-2"></div>
                                        <div className="h-6 w-16 bg-gray-800 rounded mb-1"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                                    </div>
                                </div>

                                <div className="h-40 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden flex items-end px-4 pb-0 gap-2">
                                    {/* Fake Chart Bars */}
                                    <div className="w-full bg-blue-200 h-[40%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-300 h-[60%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-400 h-[30%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-500 h-[80%] rounded-t-sm"></div>
                                    <div className="w-full bg-blue-600 h-[50%] rounded-t-sm"></div>
                                    <div className="w-full bg-indigo-500 h-[70%] rounded-t-sm"></div>
                                    <div className="w-full bg-indigo-600 h-[90%] rounded-t-sm"></div>
                                </div>
                            </div>
                        </div>
                     </div>

                     {/* Floating Badge */}
                     <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
                         <div className="bg-green-100 p-2 rounded-full">
                             <CheckCircle2 className="w-5 h-5 text-green-600" />
                         </div>
                         <div>
                             <p className="text-sm font-bold text-gray-900">Site en ligne</p>
                             <p className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">Partager</p>
                         </div>
                     </div>
                </div>
              </div>
          </div>
      </section>

      {/* ... (Rest of sections remain mostly same) ... */}
      <section id="simulator-section" className="py-12 md:py-24 bg-gray-50 text-gray-900 relative overflow-hidden">
          {/* Background decoration - Adjusted for Light Mode */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12 max-w-3xl mx-auto">
                  <div className="inline-block bg-yellow-400 text-black font-bold text-xs px-3 py-1 rounded-full mb-4 transform -rotate-2">Simulateur Live</div>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Estimez votre projet</h2>
                  <p className="text-lg text-gray-500">
                      Tarification transparente.<br/>Pas de frais cachés.
                  </p>
              </div>

              {/* TABS (Light Mode) */}
              <div className="flex justify-center mb-10">
                  <div className="bg-white border border-gray-200 p-1 rounded-lg inline-flex shadow-sm">
                      <button 
                          onClick={() => setActiveCalculatorTab('web')}
                          className={`px-8 py-3 rounded-md text-sm font-bold transition-all flex items-center ${activeCalculatorTab === 'web' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                          <Globe className="w-4 h-4 mr-2" />
                          Site Web
                      </button>
                      <button 
                          onClick={() => setActiveCalculatorTab('marketing')}
                          className={`px-8 py-3 rounded-md text-sm font-bold transition-all flex items-center ${activeCalculatorTab === 'marketing' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                      >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Marketing
                      </button>
                  </div>
              </div>

              {/* === WEB CALCULATOR CONTENT === */}
              {activeCalculatorTab === 'web' && (
                  <div className="animate-fade-in-up">
                      <div className="bg-white rounded-3xl overflow-hidden text-gray-900 max-w-5xl mx-auto shadow-2xl flex flex-col lg:flex-row">
                          {/* ... (Web Calculator Content from original file) ... */}
                          
                          {/* Left: Controls */}
                          <div className="p-8 lg:p-10 flex-1">
                              <h3 className="text-2xl font-bold mb-6">Configurez votre site</h3>
                              
                              <div className="space-y-8">
                                  {/* Type */}
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-3">Type de projet</label>
                                      <div className="grid grid-cols-2 gap-3">
                                          <button 
                                            onClick={() => setWebType('vitrine')} 
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${webType === 'vitrine' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                          >
                                              <span className="block font-bold mb-1">Vitrine</span>
                                              <span className="text-xs text-gray-500">Présentation</span>
                                          </button>
                                          <button 
                                            onClick={() => setWebType('ecommerce')} 
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${webType === 'ecommerce' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                                          >
                                              <span className="block font-bold mb-1">E-commerce</span>
                                              <span className="text-xs text-gray-500">Vente en ligne</span>
                                          </button>
                                      </div>
                                  </div>

                                  {/* Pages Slider */}
                                  <div>
                                      <div className="flex justify-between mb-2">
                                          <label className="block text-sm font-bold text-gray-700">Nombre de pages</label>
                                          <span className="text-blue-600 font-bold text-sm">{webPages} pages</span>
                                      </div>
                                      <input type="range" min="1" max="50" value={webPages} onChange={e => setWebPages(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                                          <span>Landing Page (1-5p)</span>
                                          <span>Site XXL (50p)</span>
                                      </div>
                                      <p className="text-xs text-blue-600 mt-2 flex items-center">
                                          <Info className="w-3 h-3 mr-1"/>
                                          Besoin de plus ? Ajoutez des pages en un clic depuis votre tableau de bord.
                                      </p>
                                  </div>

                                  {/* SEO Option */}
                                  <div>
                                      <label className="block text-sm font-bold text-gray-700 mb-3">Option Référencement (SEO)</label>
                                      <div className="grid grid-cols-2 gap-3">
                                          <button 
                                            onClick={() => setSeoOption('basic')} 
                                            className={`p-4 rounded-xl border-2 text-left transition-all relative ${seoOption === 'basic' ? 'border-gray-400 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                          >
                                              <span className="block font-bold mb-1 text-sm">SEO de Base</span>
                                              <span className="text-xs text-gray-500 block">Structure & Indexation</span>
                                              <span className="inline-block bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded mt-2">INCLUS</span>
                                          </button>
                                          <button 
                                            onClick={() => setSeoOption('advanced')} 
                                            className={`p-4 rounded-xl border-2 text-left transition-all ${seoOption === 'advanced' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                                          >
                                              <span className="block font-bold mb-1 text-sm flex items-center text-indigo-700">SEO Avancé <Zap className="w-3 h-3 ml-1 fill-current" /></span>
                                              <span className="text-xs text-gray-500 block">Mots-clés & Rédaction</span>
                                              <span className="inline-block bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded mt-2">+79€ /page</span>
                                          </button>
                                      </div>
                                  </div>

                                  {/* E-commerce Options */}
                                  {webType === 'ecommerce' && (
                                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                          <label className="block text-sm font-bold text-purple-900 mb-2">Catalogue produits</label>
                                          <select 
                                              value={productVolumeTier}
                                              onChange={(e) => setProductVolumeTier(parseInt(e.target.value))}
                                              className="w-full p-2.5 border border-purple-200 rounded-lg bg-white font-medium focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                          >
                                              {PRODUCT_TIERS.map((tier, index) => (
                                                  <option key={index} value={index}>{tier.label}</option>
                                              ))}
                                          </select>
                                      </div>
                                  )}

                                  {/* Maintenance Toggle */}
                                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                                      <div>
                                          <span className="block font-bold text-gray-900 text-sm">Maintenance, suivi & Hébergement</span>
                                          <span className="text-xs text-gray-500">Sécurité, SSL, Mises à jour</span>
                                      </div>
                                      <button 
                                        onClick={() => setWebMaintenance(!webMaintenance)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${webMaintenance ? 'bg-green-500' : 'bg-gray-200'}`}
                                      >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${webMaintenance ? 'translate-x-5' : 'translate-x-0'}`} />
                                      </button>
                                  </div>
                              </div>
                          </div>

                          {/* Right: Summary & Inclusions */}
                          <div className="bg-gray-50 p-8 lg:p-10 lg:w-[400px] border-l border-gray-100 flex flex-col">
                              <h4 className="font-bold text-gray-900 mb-6">Ce qui est inclus</h4>
                              
                              <ul className="space-y-3 mb-8 flex-1">
                                  <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0"/> Design sur-mesure (Responsive)</li>
                                  
                                  {seoOption === 'advanced' ? (
                                      <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-indigo-500 mr-2 mt-0.5 shrink-0"/> <strong>SEO Avancé</strong> (Rédaction, Mots-clés)</li>
                                  ) : (
                                      <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0"/> SEO Technique de base</li>
                                  )}

                                  <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0"/> Formulaire de contact & Map</li>
                                  <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0"/> Interface de gestion autonome</li>
                                  
                                  {webType === 'ecommerce' && (
                                      <>
                                          <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-purple-500 mr-2 mt-0.5 shrink-0"/> Module Paiement Sécurisé</li>
                                          <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-purple-500 mr-2 mt-0.5 shrink-0"/> Gestion Stocks & Commandes</li>
                                      </>
                                  )}

                                  {webMaintenance ? (
                                      <>
                                          <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0"/> Hébergement Haute Performance</li>
                                          <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0"/> Nom de domaine inclus</li>
                                          <li className="flex items-start text-sm text-gray-600"><Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 shrink-0"/> Certificat SSL (HTTPS)</li>
                                      </>
                                  ) : (
                                      <li className="flex items-start text-sm text-gray-400"><X className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0"/> Hébergement non inclus</li>
                                  )}
                              </ul>

                              <div className="border-t border-gray-200 pt-6">
                                  <div className="flex justify-between items-end mb-1">
                                      <span className="text-sm text-gray-500">Frais de création</span>
                                      <span className="text-2xl font-extrabold text-gray-900">{webCreationPrice}€</span>
                                  </div>
                                  <div className="flex justify-between items-center mb-6">
                                      <span className="text-sm text-gray-500">Maintenance</span>
                                      <span className="font-bold text-gray-900">
                                          {webMaintenance 
                                              ? `${webType === 'vitrine' ? '49€' : '72€'} /mois` 
                                              : 'sans maintenance'
                                          }
                                      </span>
                                  </div>
                                  
                                  {isWebEligibleFor4x && (
                                    <div className="mb-4 pt-3 border-t border-gray-200">
                                        <p className="text-xs font-bold text-gray-700 flex items-center mb-2">
                                            <ShieldCheck className="w-3 h-3 mr-1.5 text-green-600" />
                                            Paiement sécurisé par Carte bancaire, Virement ou PayPal
                                        </p>
                                        <button 
                                            onClick={() => alert("Redirection vers PayPal pour le paiement en 4 fois.")}
                                            className="w-full py-2 bg-white border border-blue-200 hover:bg-blue-50 text-blue-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                                        >
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3 mr-1.5" />
                                            Payer en 4x ({ (webTotalToday/4).toFixed(0) }€ /mois)
                                        </button>
                                        <p className="text-[10px] text-gray-400 mt-1 text-center italic">*Disponible pour les montants &lt; 2000€</p>
                                    </div>
                                  )}

                                  <button onClick={() => setShowAuthModal(true)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                                      Lancer mon projet
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* === MARKETING CALCULATOR CONTENT === */}
              {activeCalculatorTab === 'marketing' && (
                  <div className="animate-fade-in-up space-y-8">
                      {/* ... (Marketing Calculator content remains the same) ... */}
                      {/* PACKS CARDS */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                           {/* Pack Découverte */}
                           <div onClick={() => selectPack('decouverte')} className="bg-white rounded-2xl p-6 text-gray-900 cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                               <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-bl-lg font-bold uppercase">Lancement</div>
                               <h3 className="text-xl font-bold mb-1">Découverte</h3>
                               <p className="text-3xl font-extrabold text-blue-600 mb-1">54€ <span className="text-sm font-normal text-gray-500">/mois</span></p>
                               <span className="block text-[10px] font-medium text-green-600 mb-4 bg-green-50 px-2 py-0.5 rounded-full w-fit">Sans engagement</span>
                               <ul className="text-sm space-y-2 mb-4 text-gray-600">
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> <strong>4 Posts Google Business</strong></li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> 2 Articles Blog SEO</li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-gray-400 mr-2"/> Réponse aux avis Google</li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-gray-400 mr-2"/> Tableau de bord de suivi</li>
                               </ul>
                               <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">Choisir ce pack</button>
                           </div>

                           {/* Pack Essentiel */}
                           <div onClick={() => selectPack('essentiel')} className="bg-gray-800 rounded-2xl p-6 text-white cursor-pointer border-2 border-blue-500 shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                               <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] px-2 py-1 rounded-bl-lg font-bold uppercase">Le plus populaire</div>
                               <h3 className="text-xl font-bold mb-1">Business</h3>
                               <p className="text-3xl font-extrabold text-white mb-1">132€ <span className="text-sm font-normal text-gray-400">/mois</span></p>
                               <span className="block text-[10px] font-medium text-green-400 mb-4 bg-white/10 px-2 py-0.5 rounded-full w-fit">Sans engagement</span>
                               <ul className="text-sm space-y-2 mb-4 text-gray-300">
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-blue-400 mr-2"/> <strong>4 Posts Google Business</strong></li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-blue-400 mr-2"/> <strong>4 Posts Réseaux Sociaux</strong></li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-blue-400 mr-2"/> 2 Articles Blog SEO</li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-blue-400 mr-2"/> Création de visuels inclus</li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-blue-400 mr-2"/> Calendrier éditorial</li>
                               </ul>
                               <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 transition-colors">Choisir ce pack</button>
                           </div>

                           {/* Pack Performance */}
                           <div onClick={() => selectPack('performance')} className="bg-white rounded-2xl p-6 text-gray-900 cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all shadow-lg hover:-translate-y-1 relative overflow-hidden group">
                               <div className="absolute top-0 right-0 bg-purple-100 text-purple-600 text-[10px] px-2 py-1 rounded-bl-lg font-bold uppercase">Croissance</div>
                               <h3 className="text-xl font-bold mb-1">Performance</h3>
                               <p className="text-3xl font-extrabold text-purple-600 mb-1">300€ <span className="text-sm font-normal text-gray-500">/mois</span></p>
                               <span className="block text-[10px] font-medium text-green-600 mb-4 bg-green-50 px-2 py-0.5 rounded-full w-fit">Sans engagement</span>
                               <ul className="text-sm space-y-2 mb-4 text-gray-600">
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> <strong>8 Posts Google Business</strong></li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> <strong>8 Posts Réseaux Sociaux</strong></li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> 7 Articles Blog SEO</li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> Pinterest & LinkedIn Inclus</li>
                                   <li className="flex items-center"><CheckCircle2 className="w-3 h-3 text-green-500 mr-2"/> Stratégie de contenu avancée</li>
                               </ul>
                               <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">Choisir ce pack</button>
                           </div>
                      </div>

                      {/* CALCULATOR */}
                      <div className="bg-white rounded-3xl p-8 lg:p-12 text-gray-900 max-w-5xl mx-auto shadow-2xl">
                          <div className="text-center mb-8">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ou composez à la carte</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              {/* MODULES SELECTION */}
                              <div className="space-y-6">
                                    {/* GMB Module */}
                                    <div className={`p-4 rounded-2xl border-2 transition-all ${isGmbEnabled ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsGmbEnabled(!isGmbEnabled)}>
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg mr-3 ${isGmbEnabled ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <span className={`font-bold ${isGmbEnabled ? 'text-gray-900' : 'text-gray-500'}`}>Google Business</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isGmbEnabled ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                                {isGmbEnabled && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        
                                        {isGmbEnabled && (
                                            <div className="pl-14 pr-2 pb-2 animate-fade-in-up">
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="font-medium text-gray-700">Fréquence</span>
                                                    <span className="font-bold text-blue-600">{customGmb} posts <span className="text-xs font-normal text-gray-500">/mois</span></span>
                                                </div>
                                                <input 
                                                    type="range" min="4" max="28" step="1" 
                                                    value={customGmb} 
                                                    onChange={e => setCustomGmb(parseInt(e.target.value))} 
                                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                                                />
                                                <p className="text-xs text-gray-500 mt-2">Inclus : Rédaction, Visuels, Publication & Réponses aux avis.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Social Module */}
                                    <div className={`p-4 rounded-2xl border-2 transition-all ${isSocialEnabled ? 'border-pink-500 bg-pink-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsSocialEnabled(!isSocialEnabled)}>
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg mr-3 ${isSocialEnabled ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <Smartphone className="w-5 h-5" />
                                                </div>
                                                <span className={`font-bold ${isSocialEnabled ? 'text-gray-900' : 'text-gray-500'}`}>Réseaux Sociaux</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSocialEnabled ? 'bg-pink-500 border-pink-500' : 'border-gray-300'}`}>
                                                {isSocialEnabled && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        
                                        {isSocialEnabled && (
                                            <div className="pl-14 pr-2 pb-2 animate-fade-in-up">
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="font-medium text-gray-700">Fréquence</span>
                                                    <span className="font-bold text-pink-600">{customSocial} posts <span className="text-xs font-normal text-gray-500">/mois</span></span>
                                                </div>
                                                <input 
                                                    type="range" min="4" max="28" step="1"
                                                    value={customSocial} 
                                                    onChange={e => setCustomSocial(parseInt(e.target.value))} 
                                                    className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600" 
                                                />
                                                
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <span className="text-[10px] uppercase font-bold text-gray-400 w-full mb-1">Inclus</span>
                                                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-md border border-pink-200 flex items-center">
                                                        Facebook <Check className="w-3 h-3 ml-1" />
                                                    </span>
                                                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-md border border-pink-200 flex items-center">
                                                        Instagram <Check className="w-3 h-3 ml-1" />
                                                    </span>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-pink-100">
                                                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Options Premium (+49€)</p>
                                                    <div className="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar pb-2">
                                                        {['LinkedIn', 'Pinterest'].map(c => (
                                                            <button 
                                                                key={c} 
                                                                onClick={() => toggleSocialChannel(c.toLowerCase())} 
                                                                className={`text-xs border px-3 py-1.5 rounded-lg transition-colors flex items-center flex-shrink-0 whitespace-nowrap ${customSocialChannels.includes(c.toLowerCase()) ? 'bg-pink-600 text-white border-pink-600 font-bold shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                                                            >
                                                                {c}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Blog Module */}
                                    <div className={`p-4 rounded-2xl border-2 transition-all ${isBlogEnabled ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                                        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsBlogEnabled(!isBlogEnabled)}>
                                            <div className="flex items-center">
                                                <div className={`p-2 rounded-lg mr-3 ${isBlogEnabled ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                                <span className={`font-bold ${isBlogEnabled ? 'text-gray-900' : 'text-gray-500'}`}>Blog SEO</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isBlogEnabled ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                                                {isBlogEnabled && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        
                                        {isBlogEnabled && (
                                            <div className="pl-14 pr-2 pb-2 animate-fade-in-up">
                                                <div className="flex justify-between mb-2 text-sm">
                                                    <span className="font-medium text-gray-700">Volume</span>
                                                    <span className="font-bold text-indigo-600">{customBlog} articles <span className="text-xs font-normal text-gray-500">/mois</span></span>
                                                </div>
                                                <input 
                                                    type="range" min="2" max="28" step="1"
                                                    value={customBlog} 
                                                    onChange={e => setCustomBlog(parseInt(e.target.value))} 
                                                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                                                />
                                                <p className="text-xs text-gray-500 mt-2">Inclus : Recherche mots-clés, Rédaction, Intégration CMS.</p>
                                            </div>
                                        )}
                                    </div>
                              </div>

                              {/* SUMMARY */}
                              <div className="bg-gray-50 p-8 rounded-2xl flex flex-col justify-center text-center h-full">
                                    <p className="text-sm text-gray-500 uppercase font-bold mb-2">Mensuel Estimé</p>
                                    <p className="text-6xl font-extrabold text-gray-900 mb-1">{marketingTotalPrice}€</p>
                                    <span className="block text-[10px] font-medium text-green-600 mb-6 bg-green-50 px-2 py-0.5 rounded-full w-fit mx-auto">Sans engagement</span>
                                    
                                    <div className="text-left text-xs text-gray-500 space-y-2 mb-8 border-t border-gray-200 pt-4">
                                        {isGmbEnabled && <div className="flex justify-between"><span>Google Business ({customGmb} posts)</span> <span>{(customGmb * 7.25).toFixed(0)}€</span></div>}
                                        {isSocialEnabled && <div className="flex justify-between"><span>Social ({customSocial} posts)</span> <span>{(customSocial * 12.25).toFixed(0)}€</span></div>}
                                        {isSocialEnabled && customSocialChannels.includes('linkedin') && <div className="flex justify-between pl-2"><span>+ LinkedIn</span> <span>49€</span></div>}
                                        {isSocialEnabled && customSocialChannels.includes('pinterest') && <div className="flex justify-between pl-2"><span>+ Pinterest</span> <span>49€</span></div>}
                                        {isBlogEnabled && <div className="flex justify-between"><span>Blog ({customBlog} articles)</span> <span>{(customBlog * 12.25).toFixed(0)}€</span></div>}
                                    </div>

                                    <button 
                                        onClick={() => setShowAuthModal(true)}
                                        disabled={!isValidConfig}
                                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${isValidConfig ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        Je m'abonne
                                    </button>
                                    {(!isValidConfig && marketingTotalPrice > 0) && <p className="text-xs text-red-500 mt-4">Minimum requis non atteint</p>}
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-16">
                  <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Une offre à 360°</span>
                  <h2 className="text-4xl font-bold text-gray-900 mt-2">Tout ce dont vous avez besoin pour réussir.</h2>
              </div>

              {/* Feature 1: GMB */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-24">
                  <div className="flex-1 order-2 md:order-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex items-center justify-center">
                       {/* REALISTIC GMB MOCKUP */}
                       <div className="bg-white rounded-lg shadow-md max-w-sm w-full overflow-hidden border border-gray-200">
                          {/* GMB Map/Image Header */}
                          <div className="h-32 bg-gray-200 relative">
                             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <MapPin className="w-8 h-8 opacity-50" />
                             </div>
                             <div className="absolute bottom-[-20px] left-4 w-16 h-16 bg-white rounded-lg shadow-sm p-1">
                                <div className="w-full h-full bg-blue-100 rounded flex items-center justify-center font-bold text-blue-600 text-xl">M</div>
                             </div>
                          </div>
                          <div className="pt-8 px-4 pb-4">
                             <h4 className="font-bold text-lg text-gray-900">Un titre optimisé (activité-localité)</h4>
                             <div className="flex items-center text-yellow-500 text-xs mt-1">
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-gray-400 ml-1">(48 avis)</span>
                             </div>
                             <div className="flex gap-2 mt-4">
                                <div className="flex-1 bg-blue-600 text-white py-2 rounded-full text-xs font-bold text-center">Appeler</div>
                                <div className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-full text-xs font-bold text-center">Itinéraire</div>
                                <div className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-full text-xs font-bold text-center">Site Web</div>
                             </div>
                             <div className="mt-4 border-t pt-3">
                                <p className="text-xs text-gray-500 flex items-center mb-1"><CheckCircle2 className="w-3 h-3 text-green-500 mr-1"/> Ouvert maintenant</p>
                                <p className="text-xs text-gray-500">12 Rue de la Réussite, 75001 Paris</p>
                             </div>
                          </div>
                       </div>
                  </div>
                  <div className="flex-1 order-1 md:order-2">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                          <MapPin className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Dominez votre zone locale sur Google.</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                          Votre Fiche Google Business est votre vitrine n°1. Nous l'optimisons pour que vous soyez le premier résultat quand on cherche vos services.
                      </p>
                      <ul className="space-y-3">
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Optimisation des mots-clés locaux</li>
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Publication de posts d'actualité réguliers</li>
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> <strong>La réponse à tous vos avis en moins de 5 minutes</strong></li>
                      </ul>
                  </div>
              </div>

              {/* Feature 2: Social */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-24">
                  <div className="flex-1">
                      <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                          <Smartphone className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Facebook & Instagram : Soyez présent, sans effort.</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                          Montrez votre savoir-faire et rassurez vos futurs clients avec une page active et professionnelle. Nous créons le contenu pour vous.
                      </p>
                      <ul className="space-y-3">
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Création de visuels à votre image</li>
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Rédaction de légendes engageantes</li>
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Publication régulière multi-canal</li>
                      </ul>
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500 italic">
                          Note : Nous gérons la diffusion de votre image. La modération des commentaires privés (Facebook/Instagram) reste votre lien privilégié avec vos clients.
                      </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex justify-center items-center">
                      {/* REALISTIC SOCIAL MOCKUP */}
                       <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-64 overflow-hidden">
                           {/* Header */}
                           <div className="h-10 border-b flex items-center px-3 justify-between">
                               <div className="flex items-center">
                                   <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-0.5">
                                      <div className="w-full h-full bg-white rounded-full p-0.5">
                                         <div className="w-full h-full bg-gray-200 rounded-full"></div>
                                      </div>
                                   </div>
                                   <span className="text-xs font-bold ml-2">mon_entreprise</span>
                               </div>
                               <span className="text-gray-400">•••</span>
                           </div>
                           {/* Image */}
                           <div className="aspect-square bg-gray-100 flex items-center justify-center">
                               <ShoppingBag className="w-8 h-8 text-gray-300" />
                           </div>
                           {/* Actions */}
                           <div className="px-3 py-2 flex gap-3">
                               <Heart className="w-5 h-5 text-gray-800" />
                               <MessageCircle className="w-5 h-5 text-gray-800" />
                               <Share2 className="w-5 h-5 text-gray-800 ml-auto" />
                           </div>
                           {/* Caption */}
                           <div className="px-3 pb-4">
                               <p className="text-xs text-gray-800 font-bold mb-1">52 J'aime</p>
                               <p className="text-xs text-gray-800 leading-tight">
                                   <span className="font-bold mr-1">mon_entreprise</span>
                                   Découvrez notre nouvelle collection disponible dès maintenant ! 🚀 #nouveauté
                               </p>
                           </div>
                       </div>
                  </div>
              </div>

               {/* Feature 3: SEO */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                   <div className="flex-1 order-2 md:order-1 bg-gray-50 rounded-3xl p-8 border border-gray-100 flex items-center justify-center">
                       <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                           <div className="text-6xl font-bold text-gray-200 mb-2">#1</div>
                           <div className="w-48 h-4 bg-blue-600 rounded-full mx-auto mb-2"></div>
                           <div className="w-32 h-3 bg-gray-200 rounded-full mx-auto mb-1"></div>
                           <div className="w-40 h-3 bg-gray-200 rounded-full mx-auto"></div>
                           <p className="mt-4 text-xs font-bold text-gray-500">Position cible</p>
                       </div>
                  </div>
                  <div className="flex-1 order-1 md:order-2">
                      <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                          <TrendingUp className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">Référencement (SEO) : Préparez l'avenir.</h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                          Ne dépendez pas que de la publicité. Nous rédigeons des articles de blog optimisés pour faire remonter votre site sur les recherches Google spécifiques à votre métier.
                      </p>
                      <ul className="space-y-3">
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Articles de blog liés à des actualités récentes</li>
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Ciblage de mots-clés locaux</li>
                          <li className="flex items-center text-sm font-medium text-gray-700"><CheckCircle2 className="w-5 h-5 text-green-500 mr-3"/> Connexion directe à votre site (Wix, WordPress...)</li>
                      </ul>
                  </div>
              </div>

          </div>
      </section>

      {/* --- PROBLEM/SOLUTION SECTION --- */}
      <section className="py-12 md:py-20 bg-gray-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                   <div>
                       <h2 className="text-3xl font-bold text-gray-900 mb-6">Des offres 100% modulables sans engagement.</h2>
                       <div className="space-y-4">
                           <div className="flex items-start bg-red-50 p-4 rounded-xl border border-red-100">
                               <div className="bg-red-100 p-2 rounded-lg mr-4"><X className="w-5 h-5 text-red-600"/></div>
                               <p className="text-gray-700 text-sm">La plupart des agences vous engagent sur <strong>3, 4 ou 5 ans</strong> sans possibilité de sortie.</p>
                           </div>
                           <div className="flex items-start bg-red-50 p-4 rounded-xl border border-red-100">
                               <div className="bg-red-100 p-2 rounded-lg mr-4"><X className="w-5 h-5 text-red-600"/></div>
                               <p className="text-gray-700 text-sm">Vous payez des milliers d'euros pour un site qui ne vous appartient jamais vraiment.</p>
                           </div>
                           <div className="flex items-start bg-green-50 p-4 rounded-xl border border-green-100 mt-6">
                               <div className="bg-green-100 p-2 rounded-lg mr-4"><CheckCircle2 className="w-5 h-5 text-green-600"/></div>
                               <p className="text-gray-800 text-sm font-bold">Chez Média SBH, toutes nos prestations sont SANS ENGAGEMENT. Un site web qui vous appartient à 100%.</p>
                           </div>
                       </div>
                   </div>
                   <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                       <h3 className="text-2xl font-bold text-blue-600 mb-4">La solution Média SBH.</h3>
                       <p className="text-gray-600 mb-8 leading-relaxed">
                           Profitez de la puissance d'une grande agence digitale, adaptée à votre budget et sans complexité inutile.
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                           <div className="bg-blue-50 p-4 rounded-xl text-center">
                               <p className="text-xl font-bold text-blue-600 mb-1">Visibilité</p>
                               <p className="text-xs text-gray-500">Présence optimisée sur tous les écrans</p>
                           </div>
                           <div className="bg-indigo-50 p-4 rounded-xl text-center">
                               <p className="text-xl font-bold text-indigo-600 mb-1">Sérénité</p>
                               <p className="text-xs text-gray-500">Support et accompagnement inclus</p>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
      </section>

      {/* --- DASHBOARD HIGHLIGHT SECTION --- */}
      <section className="py-12 md:py-24 bg-white text-gray-900 overflow-hidden relative">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900">
                            Un tableau de bord unique pour tout piloter.
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            Fini la complexité. Suivez vos performances, validez vos posts et répondez à vos clients depuis une interface ultra-intuitive, conçue pour les entrepreneurs.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4 border border-blue-200">
                                    <BarChart3 className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Statistiques en temps réel</h4>
                                    <p className="text-sm text-gray-500">Vues, clics et appels en un coup d'œil.</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4 border border-purple-200">
                                    <Layout className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Gestion centralisée</h4>
                                    <p className="text-sm text-gray-500">Google, Facebook, Instagram au même endroit.</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4 border border-green-200">
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Support Chat 7j/7</h4>
                                    <p className="text-sm text-gray-500">Une équipe dédiée pour vous aider.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={() => { setActiveCalculatorTab('web'); scrollToSection('simulator-section'); }} className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
                                Démarrer maintenant
                            </button>
                            <button onClick={() => setShowAppointmentModal(true)} className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-sm">
                                Prendre rendez-vous
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative hidden lg:block">
                        {/* Abstract Dashboard Visual Representation */}
                        <div className="relative bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] group hover:scale-105 transition-transform duration-700">
                            {/* Header */}
                            <div className="h-12 border-b border-gray-100 bg-gray-50 flex items-center px-4 space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            {/* Body */}
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="bg-gray-100 rounded-xl h-32 animate-pulse"></div>
                                <div className="bg-gray-100 rounded-xl h-32 animate-pulse delay-100"></div>
                                <div className="col-span-2 bg-gray-100 rounded-xl h-48 animate-pulse delay-200"></div>
                            </div>
                            
                            {/* Floating Card */}
                            <div className="absolute bottom-8 right-8 bg-white text-gray-900 p-4 rounded-xl shadow-lg border border-gray-100 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase">Performance</p>
                                        <p className="text-lg font-bold">+124% ce mois-ci</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
      </section>

      {/* --- REFERRAL PROMO (DARK THEME) --- */}
      <section className="py-12 md:py-20 bg-gray-900 text-white relative overflow-hidden">
          {/* Subtle light effects */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[128px] opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-[128px] opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 max-w-xl">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6 tracking-wide uppercase">
                      <Gift className="w-3 h-3 mr-2" /> Programme de parrainage
                  </div>
                  <h2 className="text-4xl font-bold mb-4 tracking-tight">Gagnez 3 pages offertes (+ SEO)</h2>
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                      Recommandez Média SBH à un entrepreneur. Pour chaque site créé (min. 5 pages), nous ajoutons gratuitement 3 pages optimisées à votre propre site.
                  </p>
                  <button 
                    onClick={() => setShowReferralGenModal(true)}
                    className="group bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center shadow-lg shadow-white/5"
                  >
                      Obtenir un lien de parrainage
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
              </div>

              {/* 3D Glass Card - Redesigned */}
              <div className="relative">
                  <div className="relative w-80 h-52 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 group overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>

                      {/* Card Content */}
                      <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                      <Gift className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <div>
                                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">CADEAU</p>
                                      <p className="text-xs font-medium text-gray-300">Offre Parrainage</p>
                                  </div>
                              </div>
                              <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
                          </div>

                          <div className="space-y-1 mt-4">
                              <p className="text-3xl font-bold text-white tracking-tight">3 Pages Web</p>
                              <p className="text-sm text-gray-400 flex items-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                                  Inclus Rédaction SEO
                              </p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                              <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-500 uppercase">Valeur estimée</span>
                                  <span className="text-sm font-bold text-white">~834€ HT</span>
                              </div>
                              <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-medium text-white">
                                  Validité Illimitée
                              </div>
                          </div>
                      </div>
                      
                      {/* Shine effect */}
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                  </div>
                  
                  {/* Decorative elements behind card */}
                  <div className="absolute -z-10 top-4 -right-4 w-80 h-52 border border-white/5 rounded-2xl"></div>
              </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-8 md:pt-20 md:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16">
              {/* Brand */}
              <div>
                  <div className="flex items-center space-x-2 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                          <StBarthLogo className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-gray-900">Média SBH</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      L'agence digitale qui simplifie la performance web pour les TPE/PME avec des solutions complètes et sans engagement.
                  </p>
                  <div className="flex space-x-4">
                      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Facebook className="w-5 h-5"/></a>
                      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Instagram className="w-5 h-5"/></a>
                      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Linkedin className="w-5 h-5"/></a>
                      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><Twitter className="w-5 h-5"/></a>
                  </div>
              </div>

              {/* Solutions */}
              <div>
                  <h4 className="font-bold text-lg mb-6 text-gray-900">Solutions</h4>
                  <ul className="space-y-4 text-gray-500 text-sm">
                      <li><button onClick={() => { setActiveCalculatorTab('web'); scrollToSection('simulator-section'); }} className="hover:text-blue-600 transition-colors">Création Site Web</button></li>
                      <li><button onClick={() => { setActiveCalculatorTab('marketing'); scrollToSection('simulator-section'); }} className="hover:text-blue-600 transition-colors">Google Business</button></li>
                      <li><button onClick={() => { setActiveCalculatorTab('marketing'); scrollToSection('simulator-section'); }} className="hover:text-blue-600 transition-colors">Gestion Réseaux Sociaux</button></li>
                      <li><button onClick={() => { setActiveCalculatorTab('marketing'); scrollToSection('simulator-section'); }} className="hover:text-blue-600 transition-colors">Rédaction SEO</button></li>
                  </ul>
              </div>

              {/* Entreprise */}
              <div>
                  <h4 className="font-bold text-lg mb-6 text-gray-900">Entreprise</h4>
                  <ul className="space-y-4 text-gray-500 text-sm">
                      <li><a href="#" className="hover:text-blue-600 transition-colors">À propos</a></li>
                      <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
                      <li><button onClick={handleClientSpaceClick} className="hover:text-blue-600 transition-colors">Espace Client</button></li>
                      <li><button onClick={() => setShowAppointmentModal(true)} className="hover:text-blue-600 transition-colors">Prendre Rendez-vous</button></li>
                  </ul>
              </div>

              {/* Newsletter */}
              <div>
                  <h4 className="font-bold text-lg mb-6 text-gray-900">Restez informé</h4>
                  <p className="text-gray-500 text-sm mb-4">Conseils digitaux et actualités de l'agence.</p>
                  <div className="flex gap-2">
                      <input type="email" placeholder="Votre email" className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 placeholder-gray-400" />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors">OK</button>
                  </div>
              </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 Média SBH. Tous droits réservés.</p>
              <div className="flex space-x-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-gray-600 transition-colors">Mentions Légales</a>
                  <a href="#" className="hover:text-gray-600 transition-colors">CGV</a>
                  <a href="#" className="hover:text-gray-600 transition-colors">Confidentialité</a>
              </div>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}
      
      {/* REFERRAL GENERATOR MODAL */}
      {showReferralGenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
                  <button onClick={() => { setShowReferralGenModal(false); setGeneratedRefLink(''); setRefBusinessName(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5"/></button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Générateur de lien</h2>
                  <p className="text-sm text-gray-500 mb-6">Créez votre lien unique pour suivre vos parrainages.</p>
                  
                  {!generatedRefLink ? (
                      <form onSubmit={handleGenerateLink} className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de votre entreprise</label>
                              <input 
                                type="text" 
                                placeholder="Ex: Boulangerie Dubois" 
                                required 
                                value={refBusinessName} 
                                onChange={e => setRefBusinessName(e.target.value)} 
                                className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" 
                              />
                          </div>
                          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center shadow-lg transition-colors">
                              Générer mon lien
                          </button>
                      </form>
                  ) : (
                      <div className="space-y-6 text-center">
                          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                              <p className="text-sm font-medium text-green-800 mb-2">Votre lien personnalisé :</p>
                              <div className="bg-white border border-green-200 rounded p-2 text-xs font-mono text-gray-600 break-all select-all">
                                  {generatedRefLink}
                              </div>
                          </div>
                          <button 
                            onClick={() => {
                                navigator.clipboard.writeText(generatedRefLink);
                                setRefCopied(true);
                                setTimeout(() => setRefCopied(false), 2000);
                            }}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-lg flex justify-center items-center ${refCopied ? 'bg-green-600' : 'bg-gray-900 hover:bg-gray-800'}`}
                          >
                              {refCopied ? <Check className="w-4 h-4 mr-2"/> : <Copy className="w-4 h-4 mr-2"/>}
                              {refCopied ? 'Copié !' : 'Copier le lien'}
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in-up relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{authMode === 'signin' ? 'Connexion' : 'Créer un compte'}</h2>
            <p className="text-gray-500 mb-6">
                {authMode === 'signin' ? "Accédez à votre tableau de bord" : "Créer votre compte et sélectionner une offre"}
            </p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'entreprise</label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" required value={authBusinessName} onChange={e => setAuthBusinessName(e.target.value)} className="pl-10 w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 transition-all" placeholder="Votre Entreprise" />
                    </div>
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-10 w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 transition-all" placeholder="vous@exemple.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="pl-10 w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 transition-all" placeholder="••••••••" />
                </div>
              </div>

              {authError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{authError}</div>}

              <button type="submit" disabled={authLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex justify-center shadow-lg">
                {authLoading ? <Loader2 className="animate-spin" /> : (authMode === 'signin' ? 'Se connecter' : "S'inscrire")}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              {authMode === 'signin' ? "Pas encore de compte ? " : "Déjà un compte ? "}
              <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} className="text-blue-600 font-bold hover:underline">
                {authMode === 'signin' ? "Créer un compte" : "Se connecter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPOINTMENT MODAL */}
      {showAppointmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
                  <button onClick={() => setShowAppointmentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5"/></button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Prendre Rendez-vous</h2>
                  
                  {appointmentSuccess ? (
                      <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="w-8 h-8"/>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Demande envoyée !</h3>
                          <p className="text-gray-500 mt-2">Un expert vous recontactera sur le créneau choisi.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                          <input type="text" placeholder="Nom complet" required value={rdvData.name} onChange={e => setRdvData({...rdvData, name: e.target.value})} className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" />
                          <input type="email" placeholder="Email pro" required value={rdvData.email} onChange={e => setRdvData({...rdvData, email: e.target.value})} className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" />
                          <input type="tel" placeholder="Téléphone" required value={rdvData.phone} onChange={e => setRdvData({...rdvData, phone: e.target.value})} className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" />
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Date</label>
                                  <input 
                                    type="date" 
                                    required 
                                    min={getMinDate()}
                                    value={rdvData.date}
                                    onChange={handleDateChange}
                                    className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all [color-scheme:light]" 
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Horaire</label>
                                  <select 
                                    required 
                                    value={rdvData.slot} 
                                    onChange={e => setRdvData({...rdvData, slot: e.target.value})} 
                                    className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm h-[46px] transition-all"
                                    disabled={availableSlots.length === 0}
                                  >
                                      <option value="">{availableSlots.length === 0 ? "Choisir une date..." : "Sélectionner..."}</option>
                                      {availableSlots.map((slot, index) => (
                                          <option key={index} value={slot}>{slot}</option>
                                      ))}
                                  </select>
                              </div>
                          </div>

                          <button type="submit" disabled={appointmentLoading || !rdvData.slot} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center shadow-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                              {appointmentLoading ? <Loader2 className="animate-spin"/> : 'Valider le rendez-vous'}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      )}

      {/* QUOTE MODAL (NEW DEVIS) */}
      {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
                  <button onClick={() => setShowQuoteModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5"/></button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Demander un devis</h2>
                  <p className="text-sm text-gray-500 mb-6">Recevez une proposition personnalisée sous 24h.</p>
                  
                  {quoteSuccess ? (
                      <div className="text-center py-8">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle2 className="w-8 h-8"/>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Demande envoyée !</h3>
                          <p className="text-gray-500 mt-2">Notre équipe commerciale va vous recontacter rapidement.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleQuoteSubmit} className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Nom de l'entreprise</label>
                              <input 
                                type="text" 
                                required 
                                value={quoteData.businessName} 
                                onChange={e => setQuoteData({...quoteData, businessName: e.target.value})} 
                                className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" 
                                placeholder="Votre Entreprise"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Téléphone</label>
                              <input 
                                type="tel" 
                                required 
                                value={quoteData.phone} 
                                onChange={e => setQuoteData({...quoteData, phone: e.target.value})} 
                                className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" 
                                placeholder="06 12 34 56 78"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Email</label>
                              <input 
                                type="email" 
                                required 
                                value={quoteData.email} 
                                onChange={e => setQuoteData({...quoteData, email: e.target.value})} 
                                className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all" 
                                placeholder="contact@entreprise.com"
                              />
                          </div>

                          <button type="submit" disabled={quoteLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex justify-center shadow-lg transition-colors mt-4">
                              {quoteLoading ? <Loader2 className="animate-spin"/> : 'Valider ma demande'}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      )}

      {/* CALLBACK MODAL */}
      {showCallbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
                  <button onClick={() => setShowCallbackModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5"/></button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Être rappelé</h2>
                  <p className="text-sm text-gray-500 mb-6">Laissez-nous vos coordonnées, nous vous rappelons sur le créneau de votre choix.</p>
                  
                  {callbackSuccess ? (
                      <div className="text-center py-8">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Phone className="w-8 h-8"/>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Demande enregistrée !</h3>
                          <p className="text-gray-500 mt-2">À très vite.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleCallbackSubmit} className="space-y-4">
                          <input type="text" placeholder="Nom complet" required value={callbackData.name} onChange={e => setCallbackData({...callbackData, name: e.target.value})} className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none text-sm transition-all" />
                          <input type="tel" placeholder="Téléphone mobile" required value={callbackData.phone} onChange={e => setCallbackData({...callbackData, phone: e.target.value})} className="w-full p-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none text-sm transition-all" />
                          
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Créneau de rappel souhaité</label>
                              <select 
                                required 
                                value={callbackData.slot} 
                                onChange={e => setCallbackData({...callbackData, slot: e.target.value})} 
                                className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none text-sm transition-all"
                              >
                                  <option value="">Sélectionner une période...</option>
                                  <option value="Matin (9h - 12h)">Matin (9h - 12h)</option>
                                  <option value="Après-midi (13h - 17h)">Après-midi (13h - 17h)</option>
                                  <option value="Soirée (18h - 22h)">Soirée (18h - 22h)</option>
                              </select>
                          </div>

                          <button type="submit" disabled={callbackLoading} className="w-full py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 flex justify-center shadow-lg transition-colors">
                              {callbackLoading ? <Loader2 className="animate-spin"/> : 'Me faire rappeler'}
                          </button>
                      </form>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default LandingPage;
