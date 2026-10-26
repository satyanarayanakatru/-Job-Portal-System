import React, { useState } from 'react';
import { 
  FileUp, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function ResumeSection({ resume, onUpload, onRemove }) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      toast.error('Invalid document format. Please upload a PDF or Word document (.pdf, .docx)');
      return;
    }

    // Format size
    const sizeKB = Math.round(file.size / 1024);
    const sizeText = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    onUpload({
      name: file.name,
      size: sizeText,
      type: file.type || 'application/pdf',
    });
    toast.success(`Resume "${file.name}" uploaded successfully!`);
  };

  const handleDownload = () => {
    toast.info(`Downloading ${resume.name}...`);
  };

  const handlePreview = () => {
    toast.info(`Previewing ${resume.name} in document viewer.`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Candidate Resume & CV</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your attached primary resume used for 1-click job applications
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          UI Verified
        </span>
      </div>

      {resume ? (
        /* Display Attached Resume Card */
        <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-slate-900 truncate">{resume.name}</h4>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 uppercase font-bold shrink-0">
                  {resume.name.endsWith('.docx') ? 'DOCX' : 'PDF'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Size: <span className="font-semibold text-slate-700">{resume.size}</span> • Uploaded{' '}
                {new Date(resume.uploadedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handlePreview}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition shadow-2xs"
              title="Preview Resume"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition shadow-2xs"
              title="Download Resume"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                onRemove();
                toast.info('Resume removed from profile.');
              }}
              className="p-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 transition shadow-2xs"
              title="Remove Resume"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/60'
            : 'border-slate-200 hover:border-indigo-300 bg-slate-50/50'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
          <FileUp className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-800">
          {resume ? 'Upload a New Version to Replace' : 'Drag & Drop your Resume document here'}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Supports PDF, DOC, DOCX files up to 10MB
        </p>
        <input
          type="file"
          id="resume-dropzone-input"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="resume-dropzone-input"
          className="inline-block mt-3 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs transition"
        >
          {resume ? 'Replace Resume' : 'Browse Files'}
        </label>
      </div>
    </div>
  );
}
