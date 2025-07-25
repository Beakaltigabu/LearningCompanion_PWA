import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import useToastStore from '../../store/toastStore';

const ToastNotification = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500 border-green-600 text-white';
      case 'warning': return 'bg-yellow-500 border-yellow-600 text-white';
      case 'error': return 'bg-red-500 border-red-600 text-white';
      case 'info': return 'bg-blue-500 border-blue-600 text-white';
      default: return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ y: -100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border
              ${getStyles(toast.type)} min-w-80 max-w-md pointer-events-auto
            `}
          >
            {getIcon(toast.type)}
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="hover:bg-white/20 rounded p-1 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;