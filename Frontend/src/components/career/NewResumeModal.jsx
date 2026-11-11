import React from "react";
import {
  X,
  Upload,
  RefreshCw,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                Check with New Resume
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Upload updated resume to recalculate match score against listings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={modalState.uploading}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
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
            className={`p-6 rounded-xl border border-dashed text-center transition-colors ${
              modalState.dragActive
                ? "border-[#fe3e91] bg-[#fe3e91]/10"
                : "border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40"
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-600 dark:text-zinc-400">
              <Upload className="w-5 h-5" />
            </div>

            <p className="font-medium text-xs sm:text-sm text-zinc-800 dark:text-zinc-200">
              {modalState.file ? modalState.file.name : "Drop updated resume (PDF or DOCX)"}
            </p>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-1">
              {modalState.file
                ? `${(modalState.file.size / 1024 / 1024).toFixed(2)} MB · Ready to parse`
                : "PDF or Word documents up to 10MB"}
            </p>

            <div className="mt-4">
              <label
                htmlFor="modal-new-resume-input"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac] shadow-xs transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{modalState.file ? "Choose different file" : "Browse file"}</span>
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
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300">
              {modalState.error}
            </div>
          )}

          {/* Uploading Status */}
          {modalState.uploading && (
            <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center space-y-2">
              <RefreshCw className="w-4 h-4 text-zinc-500 animate-spin mx-auto" />
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {modalState.uploadStage || "Processing resume..."}
              </p>
            </div>
          )}

          {/* Action Submit */}
          {modalState.file && !modalState.uploading && (
            <button
              onClick={onUploadAndCheck}
              className={`w-full py-2.5 rounded-lg text-xs font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs transition-all flex items-center justify-center gap-2`}
            >
              <span>Upload and re-score openings</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
