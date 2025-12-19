
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Send, 
  MessageSquare, 
  Share2, 
  Link as LinkIcon, 
  CreditCard, 
  Layers, 
  Smartphone, 
  BarChart3, 
  Target, 
  LayoutTemplate, 
  Monitor, 
  Gift, 
  Phone, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReturnHome: () => void;
  onLogout: () => void;
  onOpenCallbackModal: () => void;
}

interface MenuItem {
  id?: string;
  label: string;
  icon?: React.ElementType;
  badge?: number;
  isSection?: boolean;
  subItems?: {
    id: string;
    label: string;
    icon?: React.ElementType;
    badge?: number;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen, activeTab, setActiveTab, onLogout, onReturnHome, onOpenCallbackModal }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<{business_name: string, category: string} | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['gmb', 'seo', 'social']);
  const [referralBadge, setReferralBadge] = useState(1);

  useEffect(() => {
    const seen = localStorage.getItem('referral_seen');
    if (seen) {
        setReferralBadge(0);
    }

    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('business_name, category')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfileData(data);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const menuStructure: MenuItem[] = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    
    { label: 'PLATEFORME DE GESTION', isSection: true },
    { 
      id: 'gmb',
      label: 'Google Business', 
      icon: Store,
      subItems: [
        { id: 'gmb-posts', label: 'Mes Posts', icon: Send },
        { id: 'gmb-reviews', label: 'Avis Clients', icon: MessageSquare },
        { id: 'gmb-performance', label: 'Performances', icon: BarChart3 },
        { id: 'gmb-competitors', label: 'Concurrents', icon: Target },
      ]
    },
    {
      id: 'social',
      label: 'Réseaux Sociaux',
      icon: Smartphone,
      subItems: [
        { id: 'meta-calendar', label: 'Calendrier', icon: FileText },
        { id: 'social-performance', label: 'Performances', icon: BarChart3 },
        { id: 'social-competitors', label: 'Concurrents', icon: Target },
      ]
    },
    { 
      id: 'seo',
      label: 'SEO & Blog', 
      icon: Layers,
      subItems: [
        { id: 'seo-list', label: 'Mes Articles', icon: FileText },
        { id: 'seo-netlinking', label: 'Netlinking & DA', icon: LinkIcon },
        { id: 'seo-performance', label: 'Performances', icon: BarChart3 },
        { id: 'seo-competitors', label: 'Concurrents', icon: Target },
      ]
    },

    { label: 'ESPACE SITE WEB', isSection: true },
    { id: 'web-creation', label: 'Création Site Web', icon: LayoutTemplate },
    { id: 'web-management', label: 'Gérer mon site', icon: Monitor },

    { label: 'FINANCE & AVANTAGES', isSection: true },
    { id: 'subscription', label: 'Mon Abonnement', icon: CreditCard },
    { id: 'referral', label: 'Parrainage', icon: Gift, badge: referralBadge },

    { label: 'SYSTÈME', isSection: true },
    { id: 'settings', label: 'Réglages', icon: Settings },
  ];

  const handleNavClick = (itemId: string, hasSubItems: boolean, e: React.MouseEvent) => {
    e.preventDefault();
    if (itemId === 'referral') {
        setReferralBadge(0);
        localStorage.setItem('referral_seen', 'true');
    }
    if (hasSubItems) {
      setExpandedMenus(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
    } else {
      setActiveTab(itemId);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-100 shrink-0">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={onReturnHome}>
              <svg viewBox="0 0 810 817.92" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="fe8b7e56d7"><path d="M 30 227 L 760 227 L 760 624 L 30 624 Z M 30 227 " clipRule="nonzero"/></clipPath>
                    <clipPath id="4fef6b6601"><path d="M 23.101562 231.648438 L 738.476562 150.785156 L 786.824219 578.519531 L 71.449219 659.382812 Z M 23.101562 231.648438 " clipRule="nonzero"/></clipPath>
                    <clipPath id="9c6af801e8"><path d="M 23.101562 231.648438 L 738.476562 150.785156 L 786.824219 578.519531 L 71.449219 659.382812 Z M 23.101562 231.648438 " clipRule="nonzero"/></clipPath>
                </defs>
                <g clipPath="url(#fe8b7e56d7)">
                    <g clipPath="url(#4fef6b6601)">
                        <g clipPath="url(#9c6af801e8)">
                            <path fill="#000000" d="M 385.160156 621.972656 C 377.425781 624.347656 368.84375 623.902344 361.386719 620.75 C 357.683594 619.1875 354.121094 616.835938 352.277344 613.265625 C 350.1875 609.230469 350.648438 604.410156 350.527344 599.863281 C 350.421875 595.308594 349.316406 590.1875 345.417969 587.828125 C 342.070312 585.800781 337.488281 586.40625 334.386719 583.988281 C 332.101562 582.203125 331.195312 579.242188 329.953125 576.628906 C 328.171875 572.878906 325.1875 569.542969 321.871094 567.03125 C 312.828125 568.824219 302.929688 562.757812 300.425781 553.882812 C 299.425781 550.351562 299.34375 546.25 296.71875 543.675781 C 295.078125 542.066406 292.757812 541.394531 290.902344 540.058594 C 282.269531 533.847656 286.875 516.941406 277.222656 512.445312 C 272.4375 510.21875 266.914062 512.664062 261.65625 513.230469 C 248.1875 514.695312 236.886719 503.828125 227.738281 493.839844 C 224.378906 490.164062 220.929688 486.371094 219.246094 481.675781 C 217.550781 476.996094 218.03125 471.171875 221.734375 467.820312 C 228.152344 462.023438 238.65625 467.394531 243.695312 474.4375 C 248.734375 481.476562 251.933594 490.433594 259.460938 494.714844 C 261.375 495.808594 263.6875 496.523438 265.785156 495.851562 C 271.746094 493.90625 269.425781 484.855469 265.585938 479.894531 C 258.914062 471.300781 250.9375 463.703125 242.039062 457.449219 C 234.5 452.164062 225.308594 446.160156 225.289062 436.960938 C 225.277344 432.589844 227.507812 428.34375 227.015625 423.996094 C 226.417969 418.699219 221.765625 414.574219 216.683594 412.929688 C 211.597656 411.289062 206.128906 411.644531 200.804688 412.015625 C 201.234375 406.015625 200.972656 398.683594 195.703125 395.796875 C 193.1875 394.417969 190.132812 394.5 187.261719 394.636719 C 173.058594 395.265625 158.859375 395.90625 144.65625 396.535156 C 146.683594 390.488281 142.800781 383.578125 137.132812 380.648438 C 131.464844 377.71875 124.597656 378.097656 118.46875 379.871094 C 120.164062 371.660156 109.09375 367.226562 104.6875 360.097656 C 103.101562 357.539062 102.394531 354.511719 100.777344 351.96875 C 95.164062 343.054688 82.167969 343.765625 71.796875 345.535156 C 69.519531 333.5 67.851562 321.355469 66.765625 309.15625 C 53.726562 310.28125 38.0625 310.214844 30.769531 299.359375 C 40.503906 288.59375 59.71875 292.210938 69.90625 281.875 C 74.667969 277.050781 76.484375 269.511719 74.457031 263.046875 C 72.425781 256.570312 66.628906 251.4375 59.957031 250.210938 C 56.054688 249.484375 51.988281 250 48.128906 249.125 C 44.265625 248.234375 40.351562 245.207031 40.53125 241.25 C 46.484375 236.65625 52.5625 231.988281 59.632812 229.425781 C 66.707031 226.863281 75.058594 226.707031 81.347656 230.863281 C 90.136719 236.679688 92.160156 248.492188 93.386719 258.96875 C 98.484375 258.667969 102.484375 263.613281 103.828125 268.546875 C 105.175781 273.484375 104.839844 278.769531 106.28125 283.667969 C 108.511719 291.257812 116.0625 297.578125 123.894531 296.429688 C 131.726562 295.296875 137.144531 284.917969 132.28125 278.671875 C 135.929688 276.902344 140.3125 279.542969 142.585938 282.902344 C 144.863281 286.261719 145.976562 290.320312 148.46875 293.523438 C 156.261719 303.53125 171.914062 300.117188 183.8125 295.753906 C 186.667969 294.699219 189.714844 293.523438 191.457031 291.023438 C 192.835938 289.046875 193.179688 286.542969 194.15625 284.332031 C 197.449219 276.816406 206.742188 274.425781 214.8125 272.945312 C 224.011719 271.261719 233.195312 269.582031 242.394531 267.902344 C 244.238281 280.335938 247 295.609375 248.84375 308.039062 C 255.5625 312.675781 264.988281 313.007812 272.015625 308.863281 C 275.816406 306.625 280.09375 303.066406 284.035156 305.054688 C 285.566406 305.828125 286.609375 307.316406 287.488281 308.789062 C 289.855469 312.675781 291.761719 317.171875 291.046875 321.667969 C 290.328125 326.167969 286.132812 330.332031 281.65625 329.554688 C 282.925781 333.929688 284.207031 338.304688 285.472656 342.683594 C 290.203125 340.542969 296.234375 346.042969 294.546875 350.957031 C 297.035156 350.808594 299.527344 350.65625 302.03125 350.503906 C 302.441406 353.097656 302.851562 355.707031 303.246094 358.300781 C 312.742188 356.132812 324.535156 354.710938 330.535156 362.375 C 336.105469 369.472656 332.585938 380.511719 325.773438 386.414062 C 322.890625 388.914062 319.125 392.734375 321.449219 395.765625 C 322.273438 396.839844 323.636719 397.300781 324.878906 397.859375 C 331.695312 400.878906 336.195312 407.558594 342.605469 411.367188 C 353.53125 417.859375 367.375 414.835938 379.667969 411.625 C 384.367188 410.394531 389.566406 408.800781 391.960938 404.578125 C 394.371094 400.355469 390.867188 393.34375 386.222656 394.804688 C 383.417969 382.523438 395.652344 372.480469 406.34375 365.816406 C 416.054688 359.761719 425.78125 353.722656 435.820312 348.226562 C 437.082031 354.5 438.800781 361.070312 443.386719 365.523438 C 447.960938 369.992188 456.441406 372.15625 460.667969 367.359375 C 467.644531 371.953125 477.257812 366.566406 481.707031 359.488281 C 486.15625 352.410156 487.804688 343.792969 492.664062 337.003906 C 498.042969 329.5 506.96875 324.746094 511.015625 316.457031 C 516.296875 305.640625 511.570312 292.835938 506.835938 281.78125 C 513.988281 274.132812 521.144531 266.488281 528.3125 258.839844 C 529.703125 257.355469 531.390625 255.75 533.410156 255.945312 C 535.648438 256.144531 537.042969 258.421875 537.957031 260.460938 C 541.042969 267.359375 542.847656 274.824219 543.289062 282.355469 C 546.753906 279.585938 551.742188 281.9375 555.761719 283.816406 C 559.777344 285.695312 565.863281 286.246094 567.421875 282.105469 C 567.957031 280.671875 567.761719 278.945312 568.6875 277.71875 C 570.148438 275.789062 573.164062 276.425781 575.414062 275.558594 C 579.035156 274.171875 579.777344 269.539062 580.90625 265.839844 C 582.03125 262.140625 586.015625 258.175781 589.199219 260.398438 C 589.066406 274.335938 605.125 287.65625 598.257812 299.789062 C 594.285156 306.8125 583.371094 310.628906 584.453125 318.625 C 585.003906 322.734375 588.984375 325.695312 593.058594 326.414062 C 597.136719 327.148438 601.308594 326.140625 605.324219 325.144531 C 604.945312 317.550781 605.277344 308.488281 611.675781 304.335938 C 614.132812 302.746094 617.105469 302.207031 619.75 300.960938 C 624.785156 298.570312 628.394531 293.714844 633.53125 291.574219 C 638.683594 289.429688 646.632812 292.703125 645.367188 298.136719 C 644.898438 300.171875 643.277344 301.683594 641.925781 303.292969 C 636.246094 310.058594 635.101562 320.308594 639.167969 328.144531 C 646.113281 334.285156 657.21875 339.253906 663.964844 332.894531 C 669.023438 328.121094 668.097656 320.0625 668.742188 313.136719 C 669.390625 306.210938 674.960938 297.972656 681.464844 300.457031 C 684.058594 301.449219 685.75 303.894531 687.277344 306.203125 C 693.011719 314.898438 699.027344 325.140625 696.058594 335.140625 C 695.296875 337.691406 693.992188 340.070312 693.542969 342.6875 C 692.59375 348.347656 696.53125 354.417969 702.101562 355.847656 C 706.058594 358.972656 712.398438 356.765625 715.0625 352.484375 C 717.730469 348.203125 717.535156 342.746094 716.507812 337.800781 C 727.28125 333.667969 736.746094 326.210938 743.269531 316.699219 C 745.519531 313.410156 749.21875 309.375 752.644531 311.410156 C 753.738281 312.058594 754.421875 313.207031 754.945312 314.355469 C 757.199219 319.21875 757.542969 324.953125 755.871094 330.042969 C 754.960938 332.8125 753.480469 335.457031 753.257812 338.371094 C 752.867188 343.328125 756.121094 347.726562 757.929688 352.363281 C 762.878906 365.058594 755.117188 381.140625 742.117188 385.175781 C 746.996094 403.082031 750.023438 421.476562 751.113281 440 C 751.253906 442.417969 751.347656 444.929688 750.433594 447.164062 C 747.207031 454.992188 735.78125 453.46875 727.828125 450.578125 C 727.398438 448.308594 726.761719 446.835938 726.707031 444.523438 C 726.421875 433.882812 716.660156 424.386719 706.003906 424.410156 C 694.445312 424.417969 685.234375 433.757812 678.160156 442.894531 C 671.089844 452.035156 663.863281 462.296875 652.796875 465.621094 C 645.914062 467.695312 638.257812 466.769531 631.675781 469.683594 C 623.875 473.148438 619.21875 481.238281 612.238281 486.167969 C 609.160156 488.339844 605.511719 489.992188 603.402344 493.117188 C 600.679688 497.140625 601.21875 502.445312 601.863281 507.242188 C 603.945312 522.796875 606.035156 538.351562 608.117188 553.90625 C 596.9375 554.191406 593.464844 572.621094 582.300781 573.429688 C 575.316406 573.941406 570.273438 567.136719 566.679688 561.125 C 563.875 556.441406 561.089844 551.769531 558.285156 547.085938 C 556.089844 543.414062 553.328125 539.351562 549.082031 538.796875 C 545.867188 538.371094 542.6875 540.144531 539.472656 539.808594 C 532.59375 539.085938 530.023438 529.886719 523.746094 526.980469 C 516.363281 523.554688 508.402344 530.15625 503.222656 536.429688 C 498.042969 542.699219 491.273438 550.011719 483.351562 548.179688 C 483.945312 558.070312 484.554688 567.972656 485.148438 577.867188 C 478.132812 576.675781 471.320312 574.207031 465.160156 570.648438 C 466.019531 581.105469 466.898438 591.5625 467.757812 602.019531 C 463.113281 604.921875 457.550781 600.199219 454.136719 595.9375 C 448.148438 588.460938 442.167969 580.972656 436.175781 573.5 C 433.445312 570.09375 430.597656 566.578125 426.6875 564.628906 C 420.089844 561.335938 411.734375 563.375 406.105469 568.152344 C 400.476562 572.914062 397.214844 579.917969 395.144531 586.988281 C 392.035156 597.664062 391.320312 609.027344 393.085938 619.996094 C 390.335938 617.464844 388.71875 620.824219 385.140625 621.914062 Z M 385.160156 621.972656 " fillOpacity="1" fillRule="nonzero"/></g></g></g></svg>
              <span className="text-xl font-bold text-gray-900">Média SBH</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {menuStructure.map((item, index) => {
              if (item.isSection) {
                return (
                  <div key={index} className="pt-4 pb-2 px-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {item.label}
                    </p>
                  </div>
                );
              }

              const isExpanded = item.id && expandedMenus.includes(item.id);
              const isActiveParent = item.subItems?.some(sub => sub.id === activeTab);
              const isActive = activeTab === item.id;
              const Icon = item.icon || FileText; 
              
              return (
                <div key={item.id || item.label} className="mb-1">
                  <a
                    href="#"
                    onClick={(e) => handleNavClick(item.id || '', !!item.subItems, e)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive && !item.subItems
                        ? 'bg-primary-50 text-primary-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${isActiveParent ? 'text-primary-800 bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive || isActiveParent ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                      {item.label}
                    </div>
                    {item.subItems && (
                      <div className="text-gray-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    )}
                    {item.badge && item.badge > 0 && (
                        <span className="ml-auto bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs font-semibold">
                        {item.badge}
                        </span>
                    )}
                  </a>

                  {item.subItems && isExpanded && (
                    <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-1 animate-fade-in-up">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                            <a
                            key={subItem.id}
                            href="#"
                            onClick={(e) => handleNavClick(subItem.id, false, e)}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                activeTab === subItem.id
                                ? 'text-primary-600 bg-primary-50'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            >
                            {SubIcon && <SubIcon className="w-4 h-4 mr-2 opacity-70" />}
                            {subItem.label}
                            {subItem.badge && subItem.badge > 0 && (
                                <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-semibold">
                                {subItem.badge}
                                </span>
                            )}
                            </a>
                        )
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="px-1 mt-6">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-4 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                    <h4 className="font-bold text-sm mb-1 relative z-10">Besoin d'aide ?</h4>
                    <p className="text-xs text-indigo-100 mb-3 relative z-10">Nos experts sont là pour vous.</p>
                    <div className="flex flex-col space-y-2 relative z-10">
                    <button onClick={() => setActiveTab('web-creation')} className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center shadow-sm">
                        <Sparkles className="w-3 h-3 mr-1.5" /> Obtenir un devis
                    </button>
                    <button type="button" onClick={(e) => { e.preventDefault(); onOpenCallbackModal(); }} className={`w-full py-2 bg-indigo-500/50 hover:bg-indigo-500/70 text-white border border-white/20 rounded-lg text-xs font-medium transition-colors flex items-center justify-center`}>
                        <Phone className="w-3 h-3 mr-1.5" /> Être rappelé
                    </button>
                    </div>
                </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2 shrink-0">
            <div className="flex items-center w-full px-4 py-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                {profileData?.business_name ? profileData.business_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : '?')}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-gray-700 truncate">{profileData?.business_name || "Mon Entreprise"}</p>
                <p className="text-xs text-gray-500 truncate" title={user?.email}>{user?.email}</p>
              </div>
            </div>
            <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group">
                <LogOut className="w-4 h-4 mr-2 group-hover:text-red-600" /> Déconnexion
            </button>
          </div>
        </div>
    </>
  );
};

export default Sidebar;
