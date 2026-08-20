import React from 'react';
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  message: string | null;
  onClose?: () => void;
  type?: 'info' | 'success' | 'warning';
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, type = 'info' }) => {
  if (!message) return null;

  const icons = {
    info: <Info className="text-indigo-400 shrink-0" size={18} />,
    success: <CheckCircle className="text-emerald-400 shrink-0" size={18} />,
    warning: <AlertTriangle className="text-amber-400 shrink-0" size={18} />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 border border-slate-700 text-slate-100 text-sm font-medium rounded-xl shadow-2xl backdrop-blur-md animate-fade-in max-w-md">
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
