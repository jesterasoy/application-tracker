import React, { useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    ChevronUp,
    Eye,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Plus,
    Briefcase
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Applications({ onOpenAddModal, onOpenViewModal, onOpenEditModal, onOpenDeleteModal }) {
    const { applications } = useJobs();

    // --- UI Filter & Sort States ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [setupFilter, setSetupFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, company, position
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- Filter & Sort Pipeline Logical Processing ---
    const filteredAndSortedApplications = useMemo(() => {
        let result = [...applications];

        // Text Filters
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(app =>
                app.companyName.toLowerCase().includes(term) ||
                app.position.toLowerCase().includes(term) ||
                (app.recruiterName && app.recruiterName.toLowerCase().includes(term))
            );
        }

        // Dropdown Filters
        if (statusFilter) result = result.filter(app => app.status === statusFilter);
        if (setupFilter) result = result.filter(app => app.workSetup === setupFilter);
        if (typeFilter) result = result.filter(app => app.jobType === typeFilter);
        if (priorityFilter) result = result.filter(app => app.priority === priorityFilter);

        // Sorting Engine
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.applicationDate) - new Date(a.applicationDate);
            if (sortBy === 'oldest') return new Date(a.applicationDate) - new Date(b.applicationDate);
            if (sortBy === 'company') return a.companyName.localeCompare(b.companyName);
            if (sortBy === 'position') return a.position.localeCompare(b.position);
            return 0;
        });

        return result;
    }, [applications, searchTerm, statusFilter, setupFilter, typeFilter, priorityFilter, sortBy]);

    // --- Pagination Logic ---
    const totalItems = filteredAndSortedApplications.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const paginatedApplications = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedApplications.slice(start, start + itemsPerPage);
    }, [filteredAndSortedApplications, currentPage]);

    // Handle page out-of-bounds reset
    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // --- Style Badge Dynamic Mapping Helpers ---
    const getStatusStyle = (status) => {
        const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ";
        switch (status) {
            case 'Offer Received': case 'Accepted':
                return base + "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/60";
            case 'Rejected': case 'Withdrawn':
                return base + "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60";
            case 'Technical Interview': case 'Final Interview': case 'Manager Interview':
                return base + "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/60";
            case 'Wishlist':
                return base + "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
            default:
                return base + "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60";
        }
    };

    const getPriorityStyle = (priority) => {
        if (priority === 'High') return 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400 px-2 py-0.5 rounded text-xs font-bold';
        if (priority === 'Medium') return 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded text-xs font-bold';
        return 'text-slate-500 bg-slate-50 dark:bg-slate-800/60 dark:text-slate-400 px-2 py-0.5 rounded text-xs font-bold';
    };

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* Top Controls Header Action row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight cursor-pointer">Application Tracker</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage, sort, and inspect your end-to-end interviewing pipeline.</p>
                </div>
                <button
                    onClick={onOpenAddModal}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-all shadow-sm"
                >
                    <Plus size={16} />
                    Add New Application
                </button>
            </div>

            {/* Interactive Filters Panel Block */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Global Search Bar input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search company, title, or recruiter..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    {/* Sort Selection Menu */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Sort By:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <option value="newest">Newest Applied</option>
                            <option value="oldest">Oldest Applied</option>
                            <option value="company">Company (A-Z)</option>
                            <option value="position">Position (A-Z)</option>
                        </select>
                    </div>
                </div>

                {/* Secondary Category Filters row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent dark:text-slate-300 text-xs py-1.5 focus:outline-none">
                        <option value="">All Statuses</option>
                        <option value="Wishlist">Wishlist</option>
                        <option value="Applied">Applied</option>
                        <option value="HR Screening">HR Screening</option>
                        <option value="Technical Interview">Technical Interview</option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <select value={setupFilter} onChange={(e) => setSetupFilter(e.target.value)} className="bg-transparent dark:text-slate-300 text-xs py-1.5 focus:outline-none">
                        <option value="">All Work Setups</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Onsite">Onsite</option>
                    </select>

                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-transparent dark:text-slate-300 text-xs py-1.5 focus:outline-none">
                        <option value="">All Job Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                    </select>

                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="bg-transparent dark:text-slate-300 text-xs py-1.5 focus:outline-none">
                        <option value="">All Priorities</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {/* Main Responsive Data Display Table Element */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                <th className="py-3.5 px-4">Company & Position</th>
                                <th className="py-3.5 px-4">Date Applied</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4">Setup / Type</th>
                                <th className="py-3.5 px-4">Priority</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                            {paginatedApplications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center">
                                            <Briefcase size={40} className="text-slate-300 dark:text-slate-700 mb-2" />
                                            <p className="text-sm font-medium">No records found matching current query configurations.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                        {/* Primary fields row stack */}
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">{app.companyName}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{app.position}</div>
                                        </td>
                                        <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                                            {format(parseISO(app.applicationDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={getStatusStyle(app.status)}>{app.status}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-xs font-medium">{app.workSetup}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">{app.jobType}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={getPriorityStyle(app.priority)}>{app.priority}</span>
                                        </td>
                                        {/* Context Action Triggers */}
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => onOpenViewModal(app)} title="View Details" className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                                    <Eye size={15} />
                                                </button>
                                                <button onClick={() => onOpenEditModal(app)} title="Edit Record" className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                                    <Edit2 size={15} />
                                                </button>
                                                <button onClick={() => onOpenDeleteModal(app.id)} title="Delete Record" className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls Footer section container */}
                {totalPages > 1 && (
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            Showing page <strong>{currentPage}</strong> of {totalPages}
                        </span>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}