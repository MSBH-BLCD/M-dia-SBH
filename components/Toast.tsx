import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const borders = {
    success: 'border-green-100',
    error: 'border-red-100',
    info: 'border-blue-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className={`flex items-center px-4 py-3 bg-white rounded-xl shadow-lg border ${borders[type]}`}>
        <div className="mr-3">
            {icons[type]}
        </div>
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
    </div>
  );
};

export default Toast;