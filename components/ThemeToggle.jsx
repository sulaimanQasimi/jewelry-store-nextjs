'use client'

import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/context/ThemeContext'

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-gold-50 dark:hover:bg-slate-700/50 hover:text-gold-600 dark:hover:text-gold-400"
            title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            aria-label="Toggle theme"
        >
            <div className="relative h-6 w-6">
                <Sun
                    className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                        } text-amber-500`}
                />
                <Moon
                    className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                        } text-blue-400`}
                />
            </div>
        </button>
    )
}

export default ThemeToggle
