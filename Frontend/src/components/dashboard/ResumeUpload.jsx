import { useState } from "react";
import { Upload, File, FileText, X } from "lucide-react";
import { BUTTON_CLASS, BUTTON_ACCENT_CLASS } from "../../constants/style";

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
    if (!file) return false;

    const ext = (file.name || "").split(".").pop().toLowerCase();
    const allowedExts = ["pdf", "docx", "doc"];
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/octet-stream",
      "application/x-zip-compressed",
      "application/zip"
    ];

    const hasValidExt = allowedExts.includes(ext);
    const hasValidMime = allowedMimes.includes(file.type) || !file.type;
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!hasValidExt && !hasValidMime) {
      setFileError("Please upload a PDF (.pdf) or Word document (.docx)");
      return false;
    }

    if (file.size > maxSize) {
      setFileError("File size must be less than 10MB");
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setFileError("Please select a file to upload");
      return;
    }
    onUpload(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileBadge = (filename) => {
    const ext = (filename || "").split(".").pop().toLowerCase();
    if (ext === "docx" || ext === "doc") {
      return {
        label: "DOCX",
        bg: "bg-rose-50 text-[#fe3e91] dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/60",
      };
    }
    return {
      label: "PDF",
      bg: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-6 sm:p-8 shadow-xs">
        <div className="text-center">
          <p className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 text-xs font-mono font-medium text-[#fe3e91] dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
            ATS Diagnostic Engine
          </p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            Upload your resume
          </h2>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Accepts PDF or Word documents (.pdf, .docx) up to 10MB.
          </p>
        </div>

        <div
          className={`mt-6 rounded-lg border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
            dragActive
              ? "border-[#fe3e91] bg-rose-50/20 dark:bg-rose-950/20"
              : "border-zinc-300 bg-zinc-50/50 dark:border-zinc-700 dark:bg-zinc-900/40"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            <Upload size={22} />
          </div>

          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {selectedFile ? selectedFile.name : "Drop your resume file here"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {selectedFile
              ? formatFileSize(selectedFile.size)
              : "Drag and drop, or choose from your files"}
          </p>

          <div className="mt-4">
            <label
              htmlFor="resume-input"
              className={BUTTON_CLASS}
            >
              {selectedFile && !fileError ? "Choose another file" : "Browse files"}
            </label>
            <input
              id="resume-input"
              type="file"
              accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              onChange={handleChange}
              disabled={loading}
              className="hidden"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-zinc-500">
            <span>PDF, DOCX</span>
            <span>&middot;</span>
            <span>Max 10MB</span>
            <span>&middot;</span>
            <span>Client-side session</span>
          </div>
        </div>

        {fileError && (
          <div className="mt-4 rounded-lg border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 px-3.5 py-2.5">
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{fileError}</p>
          </div>
        )}

        {selectedFile && !fileError && (
          <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                {selectedFile.name.toLowerCase().endsWith(".docx") || selectedFile.name.toLowerCase().endsWith(".doc") ? (
                  <FileText size={18} className="shrink-0 text-[#fe3e91]" />
                ) : (
                  <File size={18} className="shrink-0 text-zinc-600 dark:text-zinc-400" />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      {selectedFile.name}
                    </p>
                    <span
                      className={`inline-block shrink-0 rounded px-1.5 py-0.2 text-[10px] font-mono border ${
                        getFileBadge(selectedFile.name).bg
                      }`}
                    >
                      {getFileBadge(selectedFile.name).label}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              {!loading && (
                <button
                  onClick={handleRemoveFile}
                  className="rounded-md p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  aria-label="Remove selected file"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-3.5 w-full ${BUTTON_ACCENT_CLASS}`}
            >
              {loading ? "Analyzing resume..." : "Start ATS diagnostic"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
