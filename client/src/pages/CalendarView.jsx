import React, { useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
} from 'date-fns';

import {
    ChevronLeft,
    ChevronRight,
    Video,
    FileText
} from 'lucide-react';
export default function CalendarView({ onOpenViewModal }) {
    const { applications } = useJobs();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // --- Generate Days Grid System Array ---
    const daysInMonth = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    // Adjust grid spacing offsets for the start of the week (Sunday align)
    const emptyDaysOffset = useMemo(() => {
        const firstDayIndex = daysInMonth[0].getDay();
        return Array(firstDayIndex).fill(null);
    }, [daysInMonth]);

    // --- Aggregate Calendar Events from Job Data ---
    // Find the eventsMap definition inside src/pages/CalendarView.jsx and rewrite it:
    const eventsMap = useMemo(() => {
        const map = [];

        applications.forEach(app => {
            // Capture the Specific Dedicated Interview Date Field
            if (app.interviewDate) {
                map.push({
                    id: `${app.id}-interview-round`,
                    appData: app,
                    date: new Date(app.interviewDate),
                    title: `Interview: ${app.companyName}`,
                    type: 'interview'
                });
            }
        });

        return map;
    }, [applications]);

    // Read matching events array for a targeted calendar grid block cell
    const getEventsForDay = (day) => {
        if (!day) return [];
        return eventsMap.filter(event => isSameDay(event.date, day));
    };

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="space-y-6 animate-fadeIn">

            {/* Calendar Navigation header block controls row */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Interview & Reminders Schedule</h1>
                    <p className="text-xs text-slate-400">Keep track of upcoming rounds and system follow-up updates.</p>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-4">
                    <h2 className="text-sm font-bold tracking-tight text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl">
                        {format(currentMonth, 'MMMM yyyy')}
                    </h2>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="cursor-pointer p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextMonth} className="cursor-pointer p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid Calendar Container Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/20 text-center text-xs font-bold text-slate-400 py-3 uppercase tracking-wider">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
                </div>

                {/* Calendar Box Days Container Grid */}
                <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-800/40 gap-[1px]">
                    {/* Fill empty grid blocks before start day of month */}
                    {emptyDaysOffset.map((_, idx) => (
                        <div key={`empty-${idx}`} className="bg-white dark:bg-slate-900 min-h-[100px] p-2 opacity-30 select-none" />
                    ))}

                    {/* Render Days populated with data items */}
                    {daysInMonth.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <div
                                key={day.toString()}
                                className={`bg-white dark:bg-slate-900 min-h-[110px] p-2 flex flex-col justify-between transition-colors ${isToday ? 'ring-2 ring-indigo-500 ring-inset dark:ring-indigo-400' : ''
                                    }`}
                            >
                                {/* Numeric cell indicator marker */}
                                <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded w-fit ${isToday
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-400 dark:text-slate-500'
                                    }`}>
                                    {format(day, 'd')}
                                </span>

                                {/* Day events collection frame stack */}
                                <div className="space-y-1 mt-2 flex-1 flex flex-col justify-start overflow-y-auto max-h-[75px] pr-0.5">
                                    {dayEvents.map(evt => (
                                        <button
                                            key={evt.id}
                                            onClick={() => onOpenViewModal(evt.appData)}
                                            className={`w-full text-left truncate text-[11px] px-1.5 py-1 rounded font-medium flex items-center gap-1 group border shadow-sm transition-all ${evt.type === 'interview'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-950/40'
                                                : 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/40'
                                                }`}
                                        >
                                            {evt.type === 'interview' ? <Video size={10} className="flex-shrink-0" /> : <FileText size={10} className="flex-shrink-0" />}
                                            <span className="truncate cursor-pointer">{evt.appData.companyName}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}