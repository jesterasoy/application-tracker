import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3500); // Auto-dismiss after 3.5 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-4 flex items-start gap-3 animate-slideIn">
            <div className={`p-1 rounded-lg mt-0.5 ${type === 'success'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400'
                }`}>
                {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>

            <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {message}
            </div>

            <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                <X size={14} />
            </button>
        </div>
    );
}