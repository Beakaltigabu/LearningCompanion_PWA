import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const icons = {
    success: <CheckCircle className="text-green-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
    error: <XCircle className="text-red-500" />,
};

const bgColors = {
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
};

const ToastNotification = ({ type = 'success', message, visible, onClose }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${bgColors[type]}`}
            >
                {icons[type]}
                <span className="font-medium text-gray-800">{message}</span>
                <button className="ml-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    &times;
                </button>
            </motion.div>
        )}
    </AnimatePresence>
);

export default ToastNotification;
