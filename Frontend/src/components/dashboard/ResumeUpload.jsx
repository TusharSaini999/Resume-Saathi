import { useState } from "react";
import { Upload, File, X } from "lucide-react";
import { useSelector } from "react-redux";

const ResumeUpload = ({ onUpload, loading, hasAnalysis }) => {
  const isDark = useSelector((state) => state.theme.isDark);
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 shadow-2xl transition-all ${
          isDark
            ? "border-[#334155] bg-[#0f172a]"
            : "border-[#e2e8f0] bg-white"
        }`}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#fe3e91]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#803ad1]/10 blur-3xl" />

        <div className="relative z-10 mb-6 text-center">
          <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-[#1E293B]"}`}>
            Resume Upload
          </h3>
          <p className={`mt-2 text-sm ${isDark ? "text-[#cbd5e1]" : "text-[#64748b]"}`}>
            One file. One click. Instant ATS-ready analysis.
          </p>
        </div>

        <div
          className={`relative z-10 rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
            dragActive
              ? `scale-[1.01] border-[#fe3e91] ${isDark ? "bg-[#1e293b]" : "bg-[#fef2f8]"}`
              : isDark
              ? "border-[#475569] bg-[#111827]/80"
              : "border-[#cbd5e1] bg-[#f8fafc]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-r from-[#fe3e91]/20 via-[#ca25af]/20 to-[#803ad1]/20">
            <Upload size={34} className="text-[#fe3e91]" />
          </div>

          <p className={`text-lg font-bold ${isDark ? "text-white" : "text-[#1E293B]"}`}>
            {selectedFile ? "PDF ready to analyze" : "Drop your PDF here"}
          </p>
          <p className={`mt-1 text-sm ${isDark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
            {selectedFile ? "You can still change the file before analyzing." : "or click below to browse from your device"}
          </p>

          <div className="mt-6">
            <label
              htmlFor="resume-input"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
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

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className={`rounded-full px-3 py-1 ${isDark ? "bg-[#1e293b] text-[#cbd5e1]" : "bg-white text-[#475569]"}`}>PDF only</span>
            <span className={`rounded-full px-3 py-1 ${isDark ? "bg-[#1e293b] text-[#cbd5e1]" : "bg-white text-[#475569]"}`}>Max 5MB</span>
            <span className={`rounded-full px-3 py-1 ${isDark ? "bg-[#1e293b] text-[#cbd5e1]" : "bg-white text-[#475569]"}`}>Safe processing</span>
          </div>
        </div>

        {fileError && (
          <div className="relative z-10 mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3">
            <p className="text-sm font-medium text-red-500">{fileError}</p>
          </div>
        )}

        {selectedFile && !fileError && (
          <div className={`relative z-10 mt-5 rounded-xl border px-4 py-3 ${isDark ? "border-[#334155] bg-[#111827]" : "border-[#e2e8f0] bg-[#f8fafc]"}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <File size={18} className="shrink-0 text-[#fe3e91]" />
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${isDark ? "text-white" : "text-[#1E293B]"}`}>
                    {selectedFile.name}
                  </p>
                  <p className={`text-xs ${isDark ? "text-[#94a3b8]" : "text-[#64748b]"}`}>
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              {!loading && (
                <button
                  onClick={handleRemoveFile}
                  className="rounded-lg p-2 transition hover:bg-red-500/20"
                  aria-label="Remove selected file"
                >
                  <X size={16} className="text-red-500" />
                </button>
              )}
            </div>
          </div>
        )}

        {selectedFile && !fileError && (
          <button
            onClick={handleUpload}
            disabled={loading}
            className={`relative z-10 mt-5 w-full rounded-xl py-3 font-bold text-white transition-all ${
              loading
                ? "cursor-not-allowed bg-[#fe3e91]/50"
                : "bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] hover:scale-[1.01] active:scale-95"
            }`}
          >
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
        )}

        {hasAnalysis && !selectedFile && (
          <p className={`relative z-10 mt-4 text-center text-sm ${isDark ? "text-[#cbd5e1]" : "text-[#64748b]"}`}>
            Upload a new PDF to replace the current analysis.
          </p>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
