import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Heart, Star, Zap } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-sunshine-background via-admin-light-surface to-moon-surface overflow-hidden relative">
      {/* Animated background elements - Mixed themes */}
      <div className="absolute inset-0">
        {/* Sunshine particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`sunshine-${i}`}
            className="absolute w-2 h-2 bg-sunshine-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 50}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        {/* Moon particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`moon-${i}`}
            className="absolute w-2 h-2 bg-moon-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * -100, 0],
              y: [0, Math.random() * 100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              right: `${Math.random() * 50}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="text-center z-10 px-6">
        {/* Main logo/mascot area with combined theming */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1.2
          }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32 glassmorphic-child rounded-child-xl flex items-center justify-center mb-6 bg-gradient-to-br from-sunshine-primary/20 to-moon-primary/20">
            {/* Rotating rings with different theme colors */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-sunshine-primary/30 rounded-child-xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-2 border-moon-primary/40 rounded-child-lg"
            />

            <BookOpen className="w-16 h-16 text-admin-light-primary" />

            {/* Floating icons around the main logo */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-sunshine-secondary" />
            </motion.div>

            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-2 -left-2"
            >
              <Star className="w-6 h-6 text-moon-secondary" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title with gradient text */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-sunshine-primary via-admin-light-primary to-moon-primary bg-clip-text text-transparent"
        >
          Learning Companion
        </motion.h1>

        {/* Subtitle with mixed theme elements */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-lg text-admin-light-text mb-8 flex items-center justify-center gap-2"
        >
          <Heart className="w-6 h-6 text-sunshine-secondary animate-pulse" />
          <span className="bg-gradient-to-r from-sunshine-text to-moon-text bg-clip-text text-transparent">
            Where Learning Meets Adventure
          </span>
          <Zap className="w-6 h-6 text-moon-secondary animate-pulse" />
        </motion.p>

        {/* Loading animation with mixed colors */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex justify-center space-x-2 mb-8"
        >
          {[
            { color: 'bg-sunshine-primary', delay: 0 },
            { color: 'bg-admin-light-primary', delay: 0.2 },
            { color: 'bg-moon-primary', delay: 0.4 }
          ].map((dot, i) => (
            <motion.div
              key={i}
              className={`w-4 h-4 ${dot.color} rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: dot.delay
              }}
            />
          ))}
        </motion.div>

        {/* Combined theme message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="glassmorphic-admin rounded-lg px-6 py-3 inline-block bg-gradient-to-r from-sunshine-surface/30 to-moon-surface/30"
        >
          <p className="text-sm text-admin-light-text font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sunshine-secondary" />
            <span>For Children & Parents</span>
            <Star className="w-4 h-4 text-moon-secondary" />
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
