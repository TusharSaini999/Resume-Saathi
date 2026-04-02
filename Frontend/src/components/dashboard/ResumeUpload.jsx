import { useState } from "react";
import { Upload, File, X } from "lucide-react";

const ResumeUpload = ({ onUpload, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = ["application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setFileError("Please upload a PDF file (.pdf) only");
      return false;
    }

    if (file.size > maxSize) {
      setFileError("File size must be less than 5MB");
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (validateFile(files[0])) {
        setSelectedFile(files[0]);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  const formatFileSize = (sizeInBytes) => {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    if (sizeInMB >= 1) return `${sizeInMB.toFixed(2)} MB`;
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-3xl border border-[#e2e8f0] bg-white p-5 shadow-xl sm:p-7 md:p-8 dark:border-[#334155] dark:bg-[#0f172a]">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-[#fce7f3] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#be185d] dark:bg-[#3b0a2a] dark:text-[#f9a8d4]">
            Resume Checker
          </p>
          <h3 className="mt-3 bg-[linear-gradient(120deg,#ff7ab8_0%,#fe3e91_28%,#ca25af_62%,#7a4cff_100%)] bg-clip-text text-3xl font-black tracking-[-0.01em] text-transparent md:text-4xl dark:bg-[linear-gradient(120deg,#ffd1e7_0%,#ff84bf_30%,#e879f9_65%,#a5b4fc_100%)]">
            Upload Your Resume
          </h3>
          <div className="mx-auto mt-2 h-1.5 w-28 rounded-full bg-[linear-gradient(90deg,rgba(254,62,145,0.25)_0%,rgba(202,37,175,0.95)_45%,rgba(122,76,255,0.85)_100%)] dark:bg-[linear-gradient(90deg,rgba(255,132,191,0.35)_0%,rgba(232,121,249,0.95)_50%,rgba(165,180,252,0.9)_100%)]" />
          <p className="mt-3 text-sm text-[#64748b] dark:text-[#cbd5e1]">
            Drag and drop your PDF, or click browse. We will analyze it in one step.
          </p>
        </div>

        <div
          className={`mt-6 rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
            dragActive
              ? "scale-[1.01] border-[#fe3e91] bg-[#fef2f8] dark:bg-[#1e293b]"
              : "border-[#cbd5e1] bg-[#f8fafc] dark:border-[#475569] dark:bg-[#111827]/70"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#fe3e91]/40">
            <Upload size={30} className="text-[#fe3e91]" />
          </div>

          <p className="text-base font-bold text-[#1E293B] sm:text-lg dark:text-white">
            {selectedFile ? "File selected" : "Drop your PDF here"}
          </p>
          <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">
            {selectedFile ? "You can change it any time before clicking analyze." : "or click Browse PDF below"}
          </p>

          <div className="mt-5">
            <label
              htmlFor="resume-input"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5] px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25"
            >
              {selectedFile && !fileError ? "Choose Another PDF" : "Browse PDF"}
            </label>
            <input
              id="resume-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              disabled={loading}
              className="hidden"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="rounded-full bg-white px-3 py-1 text-[#475569] dark:bg-[#1e293b] dark:text-[#cbd5e1]">PDF only</span>
            <span className="rounded-full bg-white px-3 py-1 text-[#475569] dark:bg-[#1e293b] dark:text-[#cbd5e1]">Max 5MB</span>
            <span className="rounded-full bg-white px-3 py-1 text-[#475569] dark:bg-[#1e293b] dark:text-[#cbd5e1]">Fast scan</span>
          </div>
        </div>

        {fileError && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3">
            <p className="text-sm font-medium text-red-500">{fileError}</p>
          </div>
        )}

        {selectedFile && !fileError && (
          <div className="mt-4 rounded-2xl border border-[#dbe2ea] bg-[#f8fafc] p-4 dark:border-[#475569] dark:bg-[#111827]/70">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <File size={18} className="shrink-0 text-[#fe3e91]" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1E293B] dark:text-white">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!loading && (
                <button
                  onClick={handleRemoveFile}
                  className="rounded-lg p-2 transition hover:scale-110 active:scale-95 text-[#fe3e91] dark:text-[#ff5fa7]"
                  aria-label="Remove selected file"
                >
                  <X size={16} className="text-[#fe3e91] dark:text-[#ff5fa7]" />
                </button>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-4 w-full rounded-xl py-3 font-bold text-white transition-all ${
                loading
                  ? "cursor-not-allowed bg-[#fe3e91]/50"
                  : "bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5] hover:scale-[1.01] active:scale-95 shadow-lg shadow-purple-500/25"
              }`}
            >
              {loading ? "Analyzing Resume..." : "Analyze Resume"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
