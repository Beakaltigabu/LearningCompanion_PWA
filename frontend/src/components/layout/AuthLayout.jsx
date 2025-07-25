import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
      <motion.div 
        className="absolute inset-0 opacity-50 dark:opacity-30"
        animate={{
          transform: [
            'scale(1, 1) rotate(0deg)',
            'scale(1.2, 1.2) rotate(15deg)',
            'scale(1, 1) rotate(0deg)',
          ],
        }}
        transition={{
          duration: 30,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
        }}
        style={{
          background: 'radial-gradient(circle, rgba(13,188,204,0.2) 0%, rgba(13,188,204,0) 70%)',
        }}
      />
      <motion.div 
        className="absolute inset-0 opacity-50 dark:opacity-30"
        animate={{
          transform: [
            'scale(1, 1) rotate(0deg) translateX(50px) translateY(-50px)',
            'scale(1.3, 1.3) rotate(-25deg) translateX(0px) translateY(0px)',
            'scale(1, 1) rotate(0deg) translateX(50px) translateY(-50px)',
          ],
        }}
        transition={{
          duration: 40,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          delay: 5,
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255,193,7,0.15) 0%, rgba(255,193,7,0) 70%)',
        }}
      />

      <main className="w-full max-w-md mx-auto z-10">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
