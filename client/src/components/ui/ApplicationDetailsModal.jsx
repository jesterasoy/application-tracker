import React, { useState } from 'react';
import {
    X, Calendar, Building2, Briefcase, MapPin, DollarSign,
    User, Mail, Phone, Link2, FileText, CheckSquare, Square, Plus
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useJobs } from '../../context/JobContext';

export default function ApplicationDetailsModal({ isOpen, onClose, application }) {
    const { updateApplication } = useJobs();
    const [newTodo, setNewTodo] = useState('');

    if (!isOpen || !application) return null;

    // Handle checklist item toggling
    const toggleTodo = (todoId) => {
        const updatedChecklist = application.checklist.map(item =>
            item.id === todoId ? { ...item, completed: !item.completed } : item
        );
        updateApplication(application.id, { checklist: updatedChecklist });
    };

    // Handle adding a new checklist task
    const handleAddTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const newItem = {
            id: `todo-${Date.now()}`,
            task: newTodo.trim(),
            completed: false
        };

        const updatedChecklist = [...(application.checklist || []), newItem];
        updateApplication(application.id, { checklist: updatedChecklist });
        setNewTodo('');
    };

    // Safe date formatter
    const formatDateString = (dateStr) => {
        if (!dateStr) return 'N/A';
        try {
            return format(parseISO(dateStr), 'MMMM dd, yyyy');
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl my-8 shadow-xl relative max-h-[90vh] flex flex-col text-sm">

                {/* Sticky Header Section */}
                <div className="flex justify-between items-start p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-t-2xl">
                    <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900 mb-2">
                            {application.status}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{application.position}</h2>
                        <p className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <Building2 size={16} /> {application.companyName}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content Pane */}
                <div className="overflow-y-auto p-6 space-y-6 flex-1">

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Work Setup</span>
                            <span className="font-medium flex items-center gap-1 mt-0.5"><Briefcase size={14} /> {application.workSetup}</span>
                        </div>
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Job Type</span>
                            <span className="font-medium mt-0.5 block">{application.jobType}</span>
                        </div>
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Salary Target</span>
                            <span className="font-medium flex items-center gap-0.5 mt-0.5 text-emerald-600 dark:text-emerald-400"><DollarSign size={14} /> {application.salaryRange || 'Open'}</span>
                        </div>
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Date Applied</span>
                            <span className="font-medium flex items-center gap-1 mt-0.5"><Calendar size={14} /> {formatDateString(application.applicationDate)}</span>
                        </div>
                    </div>

                    {/* Core Body: 2-Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Main Column: Description & Notes */}
                        <div className="md:col-span-2 space-y-6">
                            {application.jobDescription && (
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Job Description</h3>
                                    <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {application.jobDescription}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Personal Tracking Notes</h3>
                                <textarea
                                    value={application.notes || ''}
                                    placeholder="Click to add thoughts, follow-up strategies, or interview summaries..."
                                    onChange={(e) => updateApplication(application.id, { notes: e.target.value })}
                                    className="w-full h-24 p-3 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        {/* Side Column: Contacts, Links, and Task checklist */}
                        <div className="space-y-6">

                            {/* Recruiter block */}
                            {(application.recruiterName || application.recruiterEmail) && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                        <User size={14} /> Recruiter Contact
                                    </h4>
                                    <div className="space-y-2 text-xs">
                                        {application.recruiterName && <div className="font-semibold">{application.recruiterName}</div>}
                                        {application.recruiterEmail && (
                                            <a href={`mailto:${application.recruiterEmail}`} className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                                                <Mail size={12} /> {application.recruiterEmail}
                                            </a>
                                        )}
                                        {application.recruiterContactNumber && (
                                            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                                <Phone size={12} /> {application.recruiterContactNumber}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Assets tracker cards */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                    <FileText size={14} /> Application Assets
                                </h4>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                    <div>Resume: <span className="font-semibold text-slate-700 dark:text-slate-300">{application.resumeVersion || 'Default'}</span></div>
                                    {application.coverLetterVersion && <div className="mt-1">Cover Letter: <span className="font-semibold text-slate-700 dark:text-slate-300">{application.coverLetterVersion}</span></div>}
                                </div>
                            </div>

                            {/* Dynamic Task Checklist Component */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Interview Task Checklist</h3>

                                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                                    {(application.checklist || []).map((todo) => (
                                        <button
                                            key={todo.id}
                                            onClick={() => toggleTodo(todo.id)}
                                            className="w-full flex items-start gap-2.5 p-2 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                                        >
                                            {todo.completed ? (
                                                <CheckSquare size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                            ) : (
                                                <Square size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 mt-0.5 flex-shrink-0" />
                                            )}
                                            <span className={`text-xs ${todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {todo.task}
                                            </span>
                                        </button>
                                    ))}
                                    {(!application.checklist || application.checklist.length === 0) && (
                                        <p className="text-xs text-slate-400 italic">No milestones defined yet.</p>
                                    )}
                                </div>

                                <form onSubmit={handleAddTodo} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add task item..."
                                        value={newTodo}
                                        onChange={(e) => setNewTodo(e.target.value)}
                                        className="flex-1 text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button type="submit" className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm">
                                        <Plus size={14} />
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}