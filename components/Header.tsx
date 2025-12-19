
import React from 'react';
import { Menu, ZapOff } from 'lucide-react';
import { API_CONFIG } from '../config';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  const isDemoMode = !API_CONFIG.ONBOARDING_WORKFLOW_URL;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-gray-200 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-3 text-gray-500 focus:outline-none lg:hidden hover:text-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate max-w-[200px] sm:max-w-none">{title}</h1>
            {isDemoMode && (
                <span className="flex items-center text-[10px] font-bold text-orange-500 uppercase tracking-tight">
                    <ZapOff className="w-2.5 h-2.5 mr-1" /> Mode démo (n8n non connecté)
                </span>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
