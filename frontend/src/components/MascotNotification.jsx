import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mascotImg from '../assets/react.svg'; // Replace with actual mascot image

const MascotNotification = ({ message, visible, onClose }) => (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="fixed bottom-8 right-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl flex items-center gap-4 px-6 py-4 z-50"
            >
                <img src={mascotImg} alt="Mascot" className="w-16 h-16 animate-bounce" />
                <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">{message}</p>
                    <button className="text-blue-500 hover:underline" onClick={onClose}>Dismiss</button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default MascotNotification;
