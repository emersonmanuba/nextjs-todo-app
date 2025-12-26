'use client';

import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'react-feather';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 shadow-inner 
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-200'}`}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle theme"
        >
            {/* Toggle Circle */}
            <motion.div
                className="w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md flex items-center justify-center"
                animate={{
                    x: theme === 'dark' ? 32 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            >
                {/* Icon inside the circle */}
                <motion.div
                    initial={{ rotate: 30, scale: 0 }}
                    animate={{
                        rotate: theme === 'dark' ? 360 : 0,
                        scale: 1
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {theme === 'dark' ? (
                        <Moon size={20} className="text-blue-400" />
                    ) : (
                        <Sun size={20} className="text-yellow-500" />
                    )}
                </motion.div>
            </motion.div>
        </motion.button>
    );
}