import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullPage = false }) {
    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center z-50">
                <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 h-10 w-10" />
                <p className="text-xs text-slate-400 font-medium mt-3 tracking-wide uppercase animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-[1px] flex items-center justify-center z-40 rounded-2xl">
            <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400 h-6 w-6" />
        </div>
    );
}