
import React, { useEffect } from 'react';

const CmsConnectPage: React.FC = () => {
  useEffect(() => {
    // Redirection automatique vers la nouvelle interface centralisée
    window.location.href = '/espace-client?tab=settings&section=accounts';
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Redirection vers la gestion des comptes...</p>
      </div>
    </div>
  );
};

export default CmsConnectPage;
