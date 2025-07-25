import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Lightbulb, MoonIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useThemeStore } from '../../store/themeStore';

export const ThemeToggle = ({ userType = 'parent', className }) => {
    const { theme, toggleTheme } = useThemeStore();

    // Different theme logic for parent vs child
    const isChildTheme = userType === 'child';
    const isDarkTheme = isChildTheme ? theme === 'moon' : theme === 'dark';

    // Different icons for parent vs child
    const LightIcon = isChildTheme ? Sun : Lightbulb;
    const DarkIcon = isChildTheme ? MoonIcon : Moon;

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkTheme ? (isChildTheme ? 'sunshine' : 'light') : (isChildTheme ? 'moon' : 'dark')} theme`}
            className={cn(
                'relative inline-flex items-center justify-center',
                isChildTheme ? 'w-12 h-7 rounded-full' : 'w-10 h-6 rounded-full',
                'transition-all duration-300',
                isChildTheme
                    ? (isDarkTheme ? 'bg-moon-primary shadow-inner' : 'bg-sunshine-primary shadow-lg')
                    : (isDarkTheme ? 'bg-gray-600 shadow-inner' : 'bg-blue-500 shadow-lg'),
                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current',
                className
            )}
        >
            {/* Toggle Background */}
            <motion.div
                className={cn(
                    'absolute inset-1 rounded-full',
                    isChildTheme
                        ? (isDarkTheme ? 'bg-moon-surface' : 'bg-sunshine-surface')
                        : (isDarkTheme ? 'bg-gray-800' : 'bg-white')
                )}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
            />

            {/* Icons container */}
            <div className="relative z-10 flex items-center justify-between w-full px-1">
                <LightIcon
                    className={cn(
                        isChildTheme ? 'w-4 h-4' : 'w-3 h-3',
                        'transition-all duration-300',
                        !isDarkTheme
                            ? (isChildTheme ? 'text-sunshine-text scale-110' : 'text-blue-600 scale-110')
                            : (isChildTheme ? 'text-sunshine-text-secondary scale-90' : 'text-gray-400 scale-90')
                    )}
                />
                <DarkIcon
                    className={cn(
                        isChildTheme ? 'w-4 h-4' : 'w-3 h-3',
                        'transition-all duration-300',
                        isDarkTheme
                            ? (isChildTheme ? 'text-moon-text scale-110' : 'text-gray-200 scale-110')
                            : (isChildTheme ? 'text-moon-text-secondary scale-90' : 'text-gray-600 scale-90')
                    )}
                />
            </div>

            {/* Sliding indicator */}
            <motion.div
                className={cn(
                    isChildTheme ? 'w-5 h-5' : 'w-4 h-4',
                    'absolute rounded-full shadow-lg',
                    isChildTheme
                        ? (isDarkTheme ? 'bg-moon-accent' : 'bg-sunshine-accent')
                        : (isDarkTheme ? 'bg-gray-300' : 'bg-blue-200')
                )}
                animate={{
                    x: isDarkTheme ? (isChildTheme ? 24 : 20) : 2
                }}
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
            />
        </motion.button>
    );
};
