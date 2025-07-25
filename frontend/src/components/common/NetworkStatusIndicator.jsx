import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

const NetworkStatusIndicator = () => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg border-b border-yellow-600"
        >
          <div className="flex items-center justify-center gap-3 px-4 py-3">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <WifiOff className="w-5 h-5" />
            </motion.div>
            <span className="font-medium text-sm">
              {t('You are offline. Some features may be limited.')}
            </span>
          </div>
        </motion.div>
      )}

      {/* Brief "back online" notification */}
      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg border-b border-green-600"
          onAnimationComplete={() => {
            setTimeout(() => {
              // This will be handled by the hook's state management
            }, 3000);
          }}
        >
          <div className="flex items-center justify-center gap-3 px-4 py-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              <Wifi className="w-5 h-5" />
            </motion.div>
            <span className="font-medium text-sm">
              {t('Connection restored!')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatusIndicator;
