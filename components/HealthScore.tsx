import React from 'react';
import { TrendingUp, Info } from 'lucide-react';

const HealthScore: React.FC = () => {
  const score = 87;

  return (
    <div className="p-5 sm:p-6 bg-white shadow-sm rounded-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="z-10 w-full md:w-1/2 mb-6 md:mb-0">
        <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Google Health Score</h2>
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
        </div>
        <p className="text-gray-500 text-sm mb-6 pr-4">
          Votre fiche est très performante. Ajoutez 2 photos cette semaine pour atteindre le score parfait.
        </p>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-100">
                Excellent
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-primary-600">
                {score}/100
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 w-full">
            <div 
                style={{ width: `${score}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-primary-600 transition-all duration-1000 ease-out"
            ></div>
          </div>
        </div>
      </div>

      <div className="z-10 flex items-center justify-center md:justify-end w-full md:w-1/2 md:pl-8 border-t md:border-t-0 md:border-l border-dashed border-gray-200 pt-6 md:pt-0">
         <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-green-100 text-green-600">
                <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">+14%</h3>
            <p className="text-xs text-gray-500 font-medium">de visibilité vs mois dernier</p>
         </div>
      </div>
    </div>
  );
};

export default HealthScore;