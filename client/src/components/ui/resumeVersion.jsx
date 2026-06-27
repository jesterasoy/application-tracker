import React from 'react';
import { Upload, FileCheck, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form'; // Accesses parent context securely

export default function AssetUploadSection() {
  const { register, watch, setValue } = useFormContext();

  // Watch fields to dynamically update UI when a file is loaded
  const resumeFile = watch('resumeVersion');
  const coverLetterFile = watch('coverLetterVersion');

  // Utility to convert file binaries to base64 strings
  const handleFileConversion = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(fieldName, {
        name: file.name,
        type: file.type,
        data: reader.result // Base64 encoding string
      });
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (fieldName) => {
    setValue(fieldName, null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold mb-1 text-slate-500 uppercase tracking-wide">
          Job Description & Requirements
        </label>
        <textarea 
          {...register('jobDescription')} 
          rows={2} 
          placeholder="Paste job descriptions or core requirements..." 
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-xl resize-none" 
        />
      </div>

      <div>
        <label className="block text-xs font-bold mb-2 text-slate-500 uppercase tracking-wide">
          Application Assets (PDF, DOCX)
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* --- RESUME FILE INPUT CARD --- */}
          <div>
            {!resumeFile ? (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl cursor-pointer transition-all group text-center">
                <Upload size={18} className="text-slate-400 group-hover:text-indigo-500 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Upload Resume</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Click to browse</span>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileConversion(e, 'resumeVersion')}
                  className="hidden" 
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 rounded-xl animate-fadeIn">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-xs font-medium truncate text-indigo-900 dark:text-indigo-300">{resumeFile.name}</span>
                </div>
                <button type="button" onClick={() => removeFile('resumeVersion')} className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {/* --- COVER LETTER FILE INPUT CARD --- */}
          <div>
            {!coverLetterFile ? (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/40 rounded-xl cursor-pointer transition-all group text-center">
                <Upload size={18} className="text-slate-400 group-hover:text-indigo-500 mb-1" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Upload Cover Letter</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Click to browse</span>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileConversion(e, 'coverLetterVersion')}
                  className="hidden" 
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 rounded-xl animate-fadeIn">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-xs font-medium truncate text-indigo-900 dark:text-indigo-300">{coverLetterFile.name}</span>
                </div>
                <button type="button" onClick={() => removeFile('coverLetterVersion')} className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}