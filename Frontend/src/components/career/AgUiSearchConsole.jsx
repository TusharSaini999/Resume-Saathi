import React, { useState, useEffect } from "react";
import { ShieldCheck, Cpu, Terminal, CheckCircle2 } from "lucide-react";

export default function AgUiSearchConsole({ roleQuery, location, company }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      label: "LinkedIn Company Requisitions",
      detail: "Probing official company guest feeds & active post IDs",
    },
    {
      num: "02",
      label: "ATS Boards (Greenhouse, Lever, SmartRecruiters)",
      detail: "Direct API extraction of verified employer requisition slugs",
    },
    {
      num: "03",
      label: "Direct Apply Endpoints",
      detail: "Enforcing 100% active endpoints with zero generic landing pages",
    },
    {
      num: "04",
      label: "Profile Match & Skill Gap",
      detail: "Evaluating candidate profile fit, domain track, and eligibility",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="space-y-6">
      {/* Console HUD */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-6 text-zinc-900 dark:text-zinc-100 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          {/* Status & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-750">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fe3e91]" />
                Autonomous Search Active
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                ENGINE v3.1
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
              Scanning Verified Employer Portals
            </h2>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-2">
              <span>Targets:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">LinkedIn Company Pages</span>
              <span>·</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">Greenhouse / Lever ATS</span>
              <span>·</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-200">Direct Portals</span>
            </p>
          </div>

          {/* Right: Telemetry */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-400">Query:</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[200px]">
                {roleQuery || company || "All Software Roles"}
              </span>
              <span className="text-zinc-400">@</span>
              <span className="text-zinc-700 dark:text-zinc-300">{location || "India"}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% verified URLs
              </span>
              <span>·</span>
              <span>ATS parsed</span>
            </div>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {steps.map((st, idx) => {
              const isCurrent = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs transition-colors ${
                    isCurrent
                      ? "bg-[#fe3e91]/10 dark:bg-[#fe3e91]/15 border-[#fe3e91] text-zinc-900 dark:text-zinc-100 shadow-2xs"
                      : isPassed
                      ? "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                      : "bg-transparent border-zinc-100 dark:border-zinc-850 text-zinc-400 dark:text-zinc-600 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-zinc-400">{st.num}</span>
                    <span className="font-medium truncate">{st.label}</span>
                    {isCurrent && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#fe3e91]" />
                    )}
                    {isPassed && (
                      <CheckCircle2 className="ml-auto w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {st.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean Shimmer Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 space-y-4 animate-pulse"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 w-full">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-2 w-3/4">
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-4/5" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-16" />
              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-20" />
              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-14" />
            </div>

            <div className="h-10 bg-zinc-50 dark:bg-zinc-850 rounded-lg w-full" />

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-16" />
              <div className="flex items-center gap-2">
                <div className="h-7 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-16" />
                <div className="h-7 bg-zinc-900/10 dark:bg-zinc-100/10 rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
