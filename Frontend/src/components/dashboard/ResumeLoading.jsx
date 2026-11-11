import { Loader2 } from "lucide-react";

function ResumeLoading({ loadingStage }) {
  const loadingTitle =
    loadingStage === "processing"
      ? "Analyzing resume structure and ATS compliance"
      : loadingStage === "finalizing"
        ? "Generating diagnostic metrics"
        : "Uploading document";

  const loadingDescription =
    loadingStage === "processing"
      ? "Auditing section hierarchy, extracting target skills, and calculating ATS match criteria."
      : loadingStage === "finalizing"
        ? "Aggregating parser findings and inferred stack matching."
        : "Securely receiving document into session buffer.";

  const loadingStepText =
    loadingStage === "processing"
      ? "Step 2 of 3 · Parser evaluation"
      : loadingStage === "finalizing"
        ? "Step 3 of 3 · Finalizing report"
        : "Step 1 of 3 · Ingestion";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-8 text-center shadow-xs">
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[#fe3e91]">
          <Loader2 size={24} className="animate-spin" />
        </div>

        <h3 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
          {loadingTitle}
        </h3>
        
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          {loadingDescription}
        </p>

        <div className="mt-6 inline-flex rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          {loadingStepText}
        </div>
      </div>
    </div>
  );
}

export default ResumeLoading;
