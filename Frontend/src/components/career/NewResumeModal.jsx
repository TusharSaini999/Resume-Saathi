import React from "react";
import {
  X,
  Upload,
  RefreshCw,
  Sparkles,
  FileText,
} from "lucide-react";

export default function NewResumeModal({
  modalState,
  onClose,
  onFileSelect,
  onSetDragActive,
  onUploadAndCheck,
  GRADIENT_PRIMARY,
}) {
  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-linear-to-r from-purple-500/10 via-pink-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Check with New Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload updated resume to re-tailor and calculate ATS match %
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={modalState.uploading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              onSetDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              onSetDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              onSetDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              onSetDragActive(false);
              if (e.dataTransfer.files?.[0]) {
                onFileSelect(e.dataTransfer.files[0]);
              }
            }}
            className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${
              modalState.dragActive
                ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 scale-[1.01]"
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40"
            }`}
          >
            <div className="w-12 h-12 rounded-full border border-purple-400/40 bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mx-auto mb-3 text-purple-600 dark:text-purple-400">
              <Upload className="w-6 h-6" />
            </div>

            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {modalState.file ? modalState.file.name : "Drop your new PDF or DOCX resume here"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {modalState.file
                ? `${(modalState.file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze`
                : "Supports PDF and Word (.docx) up to 10MB"}
            </p>

            <div className="mt-4">
              <label
                htmlFor="modal-new-resume-input"
                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{modalState.file ? "Choose Different File" : "Browse File"}</span>
              </label>
              <input
                id="modal-new-resume-input"
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
                disabled={modalState.uploading}
              />
            </div>
          </div>

          {/* Error Banner */}
          {modalState.error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-medium text-red-600 dark:text-red-300">
              {modalState.error}
            </div>
          )}

          {/* Uploading Status */}
          {modalState.uploading && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center space-y-2">
              <RefreshCw className="w-5 h-5 text-purple-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {modalState.uploadStage || "Processing resume..."}
              </p>
            </div>
          )}

          {/* Action Submit */}
          {modalState.file && !modalState.uploading && (
            <button
              onClick={onUploadAndCheck}
              className={`w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white ${GRADIENT_PRIMARY} shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Upload &amp; Re-Score Career Openings</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            disabled={modalState.uploading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
