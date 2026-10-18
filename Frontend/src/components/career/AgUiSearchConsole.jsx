import React, { useState, useEffect } from "react";
import { Sparkles, Globe, ShieldCheck, Cpu, Terminal, ArrowRight, Zap } from "lucide-react";

export default function AgUiSearchConsole({ roleQuery, location, company, GRADIENT_PRIMARY }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: "💼",
      label: "Scanning LinkedIn Company Requisitions",
      detail: "Probing official company guest feeds & active post IDs",
    },
    {
      icon: "🏢",
      label: "Querying ATS Boards (Greenhouse, Lever, SmartRecruiters)",
      detail: "Direct API extraction of verified employer requisition slugs",
    },
    {
      icon: "⚡",
      label: "Validating Direct Apply Requisition URLs",
      detail: "Enforcing 100% active endpoints (zero generic career landing pages)",
    },
    {
      icon: "🧠",
      label: "Synthesizing AI Match Score & Skill Gap Matrix",
      detail: "Evaluating candidate profile fit, domain track, and fresher eligibility",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* High-Tech AG-UI Agent HUD Scanner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-purple-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/40 text-white">
        {/* Futuristic glowing background gradients & grid */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1e3810_1px,transparent_1px),linear-gradient(to_bottom,#1e1e3810_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Radar + Mission Status */}
          <div className="flex items-center gap-5">
            {/* Animated Concentric Radar Pulse */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/40 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-cyan-400/50 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white animate-spin" style={{ animationDuration: "6s" }} />
              </div>
              {/* Radar sweep beam */}
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" style={{ animationDuration: "2s" }} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  AG-UI SEARCH ENGINE ACTIVE
                </span>
                <span className="text-[11px] font-mono text-purple-300">
                  AGENTIC SCANNER v3.1
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200">
                Autonomous Career Agent Search In Progress
              </h2>

              <p className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
                <span>Targets:</span>
                <span className="text-cyan-300 font-mono font-bold">LinkedIn Company Pages</span>
                <span>•</span>
                <span className="text-purple-300 font-mono font-bold">Official ATS Boards</span>
                <span>•</span>
                <span className="text-emerald-300 font-mono font-bold">Unicorns &amp; Startups</span>
              </p>
            </div>
          </div>

          {/* Right: Active Query Chips & Telemetry */}
          <div className="flex flex-wrap lg:flex-col items-end gap-2 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Query:</span>
              <span className="text-white font-bold">
                {roleQuery || company || "All Software & Tech Roles"}
              </span>
              <span className="text-slate-400">@</span>
              <span className="text-cyan-300">{location || "India"}</span>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Real URLs
              </span>
              <span className="flex items-center gap-1 text-purple-400">
                <Sparkles className="w-3.5 h-3.5" /> AI Personalized
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Scanning Step Progress Line */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((st, idx) => {
              const isCurrent = activeStep === idx;
              const isPassed = activeStep > idx;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all duration-300 ${
                    isCurrent
                      ? "bg-purple-950/60 border-purple-400/80 shadow-lg shadow-purple-900/30 scale-[1.02]"
                      : isPassed
                      ? "bg-slate-900/50 border-emerald-500/40 text-slate-300"
                      : "bg-slate-900/30 border-slate-800/50 text-slate-500 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{st.icon}</span>
                    <span className="text-xs font-bold truncate">
                      {st.label}
                    </span>
                    {isCurrent && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">
                    {st.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shimmer Skeleton Grid to maintain the structured AG-UI layout during search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4 animate-pulse"
          >
            {/* Header shimmer */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 w-full">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-2 w-3/4">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                </div>
              </div>
              <div className="w-14 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            </div>

            {/* Tags shimmer */}
            <div className="flex items-center gap-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-20" />
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-24" />
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-md w-16" />
            </div>

            {/* Match recommendation shimmer */}
            <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />

            {/* CTAs shimmer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-20" />
              <div className="flex items-center gap-2">
                <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-16" />
                <div className="h-7 bg-purple-200 dark:bg-purple-900/50 rounded-lg w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
