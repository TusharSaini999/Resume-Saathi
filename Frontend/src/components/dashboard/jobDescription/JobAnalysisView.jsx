import {
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";
import { asArray, formatDate, getScoreTone } from "./jobDescriptionUtils";

function JobAnalysisView({ selectedJob }) {
  const jdAnalysis = selectedJob?.jd_analysis;
  const matchedSkills = asArray(jdAnalysis?.skills?.matched_skills);
  const missingSkills = asArray(jdAnalysis?.skills?.missing_skills);
  const extraSkills = asArray(jdAnalysis?.skills?.extra_skills);
  const suggestions = asArray(jdAnalysis?.suggestions);

  if (!selectedJob) {
    return (
      <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-[#19191b]">
        <div className="rounded-lg border border-dashed border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">No analysis selected</p>
          <p className="mt-1 text-xs text-zinc-500">
            Choose an item from history or submit a new JD to view diagnostics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-zinc-800 dark:bg-[#19191b]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              {selectedJob?.title || "Job Analysis"}
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={13} /> {selectedJob?.company_name || "Company not specified"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} /> {formatDate(selectedJob?.createdAt)}
              </span>
            </p>
          </div>
          <span className={`rounded-md px-2.5 py-1 text-xs font-mono font-medium ${getScoreTone(jdAnalysis?.match_score)}`}>
            {jdAnalysis?.match_score ?? 0}% match
          </span>
        </div>

        <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-1.5 rounded-full bg-[#fe3e91] transition-all"
            style={{ width: `${Math.max(0, Math.min(100, Number(jdAnalysis?.match_score) || 0))}%` }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-mono uppercase text-zinc-500">Required experience</p>
            <p className="mt-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {jdAnalysis?.experience?.required_experience || "Not specified"}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-mono uppercase text-zinc-500">Candidate experience</p>
            <p className="mt-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100">
              {jdAnalysis?.experience?.candidate_experience || "Not available"}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-mono uppercase text-zinc-500">Experience fit</p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium">
              {jdAnalysis?.experience?.experience_match ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300">Matched</span>
                </>
              ) : (
                <>
                  <CircleAlert size={14} className="text-amber-600 dark:text-amber-400" />
                  <span className="text-amber-700 dark:text-amber-300">Experience gap</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-mono uppercase text-zinc-500">Education criteria</p>
            <p className="mt-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              Required: {jdAnalysis?.education?.required_education || "Not specified"}
            </p>
            <p className="mt-0.5 text-xs text-zinc-700 dark:text-zinc-300">
              Candidate: {jdAnalysis?.education?.candidate_education || "Not available"}
            </p>
            <div className="mt-2">
              <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-mono font-medium ${
                jdAnalysis?.education?.education_match
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60"
              }`}>
                {jdAnalysis?.education?.education_match ? "Education matched" : "Education gap"}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="text-xs font-mono uppercase text-zinc-500">Keyword density</p>
            <div className="mt-1.5 flex items-center justify-between text-xs font-mono text-zinc-900 dark:text-zinc-100">
              <span>Matched terms</span>
              <span>
                {jdAnalysis?.keyword_match?.matched_keywords ?? 0} / {jdAnalysis?.keyword_match?.total_keywords ?? 0}
              </span>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-[11px] font-mono font-medium bg-rose-50 text-[#fe3e91] dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
                <TrendingUp size={12} /> {jdAnalysis?.keyword_match?.percentage ?? 0}% coverage
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-3">
          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-700 dark:text-emerald-300">
              <Target size={14} /> Matched skills
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {matchedSkills.length ? (
                matchedSkills.map((skill, idx) => <li key={`${skill}-${idx}`}>&middot; {skill}</li>)
              ) : (
                <li>No matched skills detected.</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-mono font-medium text-red-600 dark:text-red-400">
              <CircleAlert size={14} /> Missing skills
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {missingSkills.length ? (
                missingSkills.map((skill, idx) => <li key={`${skill}-${idx}`}>&middot; {skill}</li>)
              ) : (
                <li>No missing core skills detected.</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300">
              <Briefcase size={14} /> Additional skills
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {extraSkills.length ? (
                extraSkills.map((skill, idx) => <li key={`${skill}-${idx}`}>&middot; {skill}</li>)
              ) : (
                <li>No extra candidate skills reported.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#fe3e91]">
            <Lightbulb size={14} /> Recommendations
          </p>
          <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
            {suggestions.length ? (
              suggestions.map((item, idx) => <li key={`${item}-${idx}`}>&middot; {item}</li>)
            ) : (
              <li>No specific suggestions generated.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JobAnalysisView;
