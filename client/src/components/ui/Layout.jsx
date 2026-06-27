import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Briefcase } from 'lucide-react';

export default function Layout({ children, currentView, setView }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">

            {/* Navigation Top Bar */}
            <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 dark:bg-slate-900/80 backdrop-blur dark:border-slate-800 transition-colors">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

                    {/* Logo Brand Title */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm shadow-indigo-600/20">
                            <Briefcase size={18} />
                        </div>
                        <span className="font-bold text-base tracking-tight hidden sm:block">CareerPipeline</span>
                    </div>

                    {/* Action Row Links & Dark Mode Button Toggle */}
                    <div className="flex items-center gap-2">
                        <nav className="flex items-center gap-1 mr-2">
                            <button
                                onClick={() => setView('dashboard')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${currentView === 'dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setView('applications')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${currentView === 'applications' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
                            >
                                Applications
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${currentView === 'calendar' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
                            >
                                Calendar
                            </button>
                        </nav>

                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mr-1" />

                        {/* Dark Mode Theme Controller Trigger */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle structural interface theme"
                            className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all shadow-sm"
                        >
                            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
                        </button>
                    </div>

                </div>
            </header>

            {/* Main View Container */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}