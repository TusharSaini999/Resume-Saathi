import { AlertTriangle, RotateCcw } from "lucide-react";
import { useSelector } from "react-redux";

const AnalysisError = ({ error, onReupload }) => {
  const isDark = useSelector((state) => state.theme.isDark);

  return (
    <div
      className={`rounded-2xl border-2 p-8 ${
        isDark
          ? "border-red-500/50 bg-red-500/10"
          : "border-red-300 bg-red-50"
      }`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Error Icon */}
        <div className="p-4 rounded-full bg-red-500/20 mb-4">
          <AlertTriangle size={40} className="text-red-500" />
        </div>

        {/* Error Title */}
        <h3
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-red-400" : "text-red-600"
          }`}
        >
          Analysis Failed
        </h3>

        {/* Error Message */}
        <p
          className={`mb-6 text-sm ${
            isDark
              ? "text-[#cbd5e1] bg-red-500/20 p-4 rounded-lg"
              : "text-[#7f1d1d] bg-red-100/50 p-4 rounded-lg"
          }`}
        >
          {error || "An error occurred while analyzing your resume. Please try again."}
        </p>

        {/* Error Details Box */}
        <div
          className={`w-full mb-6 p-4 rounded-lg text-left ${
            isDark
              ? "bg-[#1e293b] border border-red-500/30"
              : "bg-white border border-red-200"
          }`}
        >
          <h4
            className={`font-bold text-sm mb-2 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            Possible Issues:
          </h4>
          <ul
            className={`text-xs space-y-2 ${
              isDark ? "text-[#cbd5e1]" : "text-[#64748b]"
            }`}
          >
            <li>• File is corrupted or not readable</li>
            <li>• Resume format is not supported</li>
            <li>• File size exceeds the limit (5MB)</li>
            <li>• Server error occurred during processing</li>
          </ul>
        </div>

        {/* Troubleshooting Tips */}
        <div
          className={`w-full mb-6 p-4 rounded-lg text-left ${
            isDark
              ? "bg-blue-500/10 border border-blue-500/30"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <h4
            className={`font-bold text-sm mb-2 ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          >
            💡 Tips to Fix:
          </h4>
          <ul
            className={`text-xs space-y-2 ${
              isDark ? "text-[#cbd5e1]" : "text-[#64748b]"
            }`}
          >
            <li>✓ Try uploading a different resume file</li>
            <li>✓ Ensure your resume is in PDF format (.pdf) only</li>
            <li>✓ Try converting your resume to PDF format</li>
            <li>✓ Check that your file is less than 5MB</li>
            <li>✓ Ensure the document is not password protected</li>
          </ul>
        </div>

        {/* Reupload Button */}
        <button
          onClick={onReupload}
          className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            isDark
              ? "bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] text-white hover:scale-105 active:scale-95"
              : "bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] text-white hover:scale-105 active:scale-95"
          }`}
        >
          <RotateCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default AnalysisError;
