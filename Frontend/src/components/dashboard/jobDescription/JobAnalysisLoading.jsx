import { Loader2 } from "lucide-react";

function JobAnalysisLoading({ loadingStage }) {
  const loadingTitle =
    loadingStage === "processing"
      ? "Evaluating candidate criteria against job description"
      : loadingStage === "finalizing"
        ? "Generating comparative match insights"
        : "Submitting job description";

  const loadingDescription =
    loadingStage === "processing"
      ? "Auditing required hard skills, experience duration, and keyword overlap against parsed resume data."
      : loadingStage === "finalizing"
        ? "Structuring missing competencies and actionable bullet recommendations."
        : "Sending listing criteria into secure processing pipeline.";

  const loadingStepText =
    loadingStage === "processing"
      ? "Step 2 of 3 · Deep comparative analysis"
      : loadingStage === "finalizing"
        ? "Step 3 of 3 · Finalizing scoring"
        : "Step 1 of 3 · Ingestion";

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 dark:border-zinc-800 dark:bg-[#19191b] md:p-8 shadow-xs">
      <div className="mx-auto flex min-h-[36vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-[#fe3e91] dark:bg-zinc-800">
          <Loader2 size={24} className="animate-spin" />
        </div>

        <h3 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
          {loadingTitle}
        </h3>
        
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-md">
          {loadingDescription}
        </p>

        <p className="mt-5 inline-flex rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 px-3 py-1 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          {loadingStepText}
        </p>
      </div>
    </div>
  );
}

export default JobAnalysisLoading;
