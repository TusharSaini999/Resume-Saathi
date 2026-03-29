import { Loader2, Sparkles } from "lucide-react";

function JobAnalysisLoading({ loadingStage }) {
  const loadingTitle =
    loadingStage === "processing"
      ? "Analyzing your JD"
      : loadingStage === "finalizing"
        ? "Preparing recommendations"
        : "Submitting your JD";

  const loadingDescription =
    loadingStage === "processing"
      ? "We are matching your resume against required skills, experience, and keywords."
      : loadingStage === "finalizing"
        ? "Final touches are being added to your score insights and recommendations."
        : "Your job description is being sent securely for analysis.";

  const loadingStepText =
    loadingStage === "processing"
      ? "Step 2 of 3: Deep analysis"
      : loadingStage === "finalizing"
        ? "Step 3 of 3: Finalizing"
        : "Step 1 of 3: Submitting";

  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/85 md:p-8">
      <div className="mx-auto flex min-h-[42vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fce7f3] px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#be185d] dark:bg-[#4a1538] dark:text-[#f9a8d4]">
          <Sparkles size={12} /> JD Analysis In Progress
        </div>

        <div className="relative mb-4">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#f43f5e]/20" />
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(120deg,#ff4f87_0%,#f43f5e_45%,#8b5cf6_100%)] text-white shadow-lg">
            <Loader2 size={26} className="animate-spin" />
          </span>
        </div>

        <h3 className="text-2xl font-black text-[#1e293b] dark:text-white">{loadingTitle}</h3>
        <p className="mt-2 text-sm text-[#475569] dark:text-[#cbd5e1] md:text-base">{loadingDescription}</p>

        <p className="mt-4 inline-flex rounded-full bg-[#e2e8f0] px-3 py-1 text-xs font-bold text-[#475569] dark:bg-[#1e293b] dark:text-[#cbd5e1]">
          {loadingStepText}
        </p>
      </div>
    </div>
  );
}

export default JobAnalysisLoading;
