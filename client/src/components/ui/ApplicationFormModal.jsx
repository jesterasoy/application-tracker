import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';

const applicationSchema = z.object({
    companyName: z.string().min(1, 'Company Name is required'),
    position: z.string().min(1, 'Position Title is required'),
    applicationDate: z.string().min(1, 'Application Date is required'),
    status: z.string().default('Wishlist'),
    jobType: z.string().default('Full-time'),
    workSetup: z.string().default('Remote'),
    priority: z.string().default('Medium'),
    salaryRange: z.string().optional(),
    jobLocation: z.string().optional(),
    applicationSource: z.string().default('LinkedIn'),
    recruiterName: z.string().optional(),
    recruiterEmail: z.string().email('Invalid email structure').optional().or(z.literal('')), recruiterContactNumber: z.string().optional(),
    companyWebsite: z.string().optional(),
    jobPostingUrl: z.string().optional(),
    resumeVersion: z.string().optional(),
    coverLetterVersion: z.string().optional(),
    jobDescription: z.string().optional(),
    notes: z.string().optional()
});

export default function ApplicationFormModal({ isOpen, onClose, onSubmit, editingApplication }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            status: 'Wishlist',
            jobType: 'Full-time',
            workSetup: 'Remote',
            priority: 'Medium',
            applicationSource: 'LinkedIn',
            applicationDate: new Date().toISOString().split('T')[0]
        }
    });

    useEffect(() => {
        if (editingApplication) {
            reset(editingApplication);
        } else {
            reset({
                companyName: '', position: '', salaryRange: '', jobLocation: '',
                recruiterName: '', recruiterEmail: '', recruiterContactNumber: '',
                companyWebsite: '', jobPostingUrl: '', resumeVersion: '', coverLetterVersion: '',
                jobDescription: '', notes: '',
                status: 'Wishlist', jobType: 'Full-time', workSetup: 'Remote', priority: 'Medium', applicationSource: 'LinkedIn',
                applicationDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [editingApplication, reset, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl my-8 p-6 shadow-xl relative max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold tracking-tight">
                        {editingApplication ? `Edit ${editingApplication.companyName} Entry` : 'Add New Application'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                        <X size={18} />
                    </button>
                </div>

                {/* Dynamic Form fields wrapping layout container */}
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto py-4 space-y-4 pr-1 flex-1 text-sm">

                    {/* Section 1: Core details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Company Name *</label>
                            <input {...register('companyName')} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                            {errors.companyName && <p className="text-rose-500 text-xs mt-0.5">{errors.companyName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Position Title *</label>
                            <input {...register('position')} type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                            {errors.position && <p className="text-rose-500 text-xs mt-0.5">{errors.position.message}</p>}
                        </div>
                    </div>

                    {/* Section 2: Metrics and Date fields */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Status</label>
                            <select {...register('status')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                                {['Wishlist', 'Applied', 'HR Screening', 'Assessment', 'Technical Interview', 'Manager Interview', 'Final Interview', 'Offer Received', 'Accepted', 'Rejected', 'Withdrawn'].map(st => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Work Setup</label>
                            <select {...register('workSetup')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                                {['Remote', 'Hybrid', 'Onsite'].map(ws => <option key={ws} value={ws}>{ws}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Job Type</label>
                            <select {...register('jobType')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                                {['Full-time', 'Part-time', 'Contract', 'Internship'].map(jt => <option key={jt} value={jt}>{jt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Priority</label>
                            <select {...register('priority')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                                {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Application Date *</label>
                            <input {...register('applicationDate')} type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Salary Range</label>
                            <input {...register('salaryRange')} placeholder="e.g. $100k - $125k" type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Source</label>
                            <select {...register('applicationSource')} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl">
                                {['LinkedIn', 'Indeed', 'JobStreet', 'Referral', 'Company Website', 'Other'].map(src => <option key={src} value={src}>{src}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Section 3: Recruiter Profile Blocks */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                        <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-2">Recruiter Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input {...register('recruiterName')} placeholder="Name" type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                            <div>
                                <input {...register('recruiterEmail')} placeholder="Email" type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                                {errors.recruiterEmail && <p className="text-rose-500 text-[11px] mt-0.5">{errors.recruiterEmail.message}</p>}
                            </div>
                            <input {...register('recruiterContactNumber')} placeholder="Phone Number" type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                        </div>
                    </div>

                    {/* Section 4: Text descriptions formatting blocks */}
                    <div>
                        <label className="block text-xs font-semibold mb-1 text-slate-500 uppercase tracking-wide">Job Description & Assets Summary</label>
                        <textarea {...register('jobDescription')} rows={2} placeholder="Paste job descriptions or core requirements..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl resize-none mb-2" />
                        <div className="grid grid-cols-2 gap-3">
                            <input {...register('resumeVersion')} placeholder="Resume file version used" type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                            <input {...register('coverLetterVersion')} placeholder="Cover Letter version used" type="text" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl" />
                        </div>
                    </div>

                    {/* Footer Action buttons row within modal portal window */}
                    <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm">
                            {editingApplication ? 'Save Changes' : 'Create Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}