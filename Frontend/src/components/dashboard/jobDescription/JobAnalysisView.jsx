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
      <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/85 md:p-6">
        <div className="rounded-2xl border border-dashed border-[#cbd5e1] p-8 text-center dark:border-[#475569]">
          <p className="text-lg font-black text-[#1e293b] dark:text-white">No analysis selected</p>
          <p className="mt-2 text-sm text-[#64748b] dark:text-[#94a3b8]">
            Choose an item from history or submit a new JD to view analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/85 md:p-6">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-[#1e293b] dark:text-white">{selectedJob?.title || "Job Analysis"}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#64748b] dark:text-[#94a3b8]">
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} /> {selectedJob?.company_name || "Unknown company"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} /> {formatDate(selectedJob?.createdAt)}
              </span>
            </p>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-sm font-black ${getScoreTone(jdAnalysis?.match_score)}`}>
            {jdAnalysis?.match_score ?? 0}% Match
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-[#e2e8f0] dark:bg-[#1e293b]">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,#f43f5e_0%,#fb7185_45%,#a855f7_100%)] transition-all"
            style={{ width: `${Math.max(0, Math.min(100, Number(jdAnalysis?.match_score) || 0))}%` }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">Required Experience</p>
            <p className="mt-2 text-sm font-semibold text-[#1e293b] dark:text-white">
              {jdAnalysis?.experience?.required_experience || "Not specified"}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">Candidate Experience</p>
            <p className="mt-2 text-sm font-semibold text-[#1e293b] dark:text-white">
              {jdAnalysis?.experience?.candidate_experience || "Not available"}
            </p>
          </div>
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">Experience Fit</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-black">
              {jdAnalysis?.experience?.experience_match ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-300">Matched</span>
                </>
              ) : (
                <>
                  <CircleAlert size={16} className="text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-300">Needs Improvement</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">Education Match</p>
            <p className="mt-2 text-sm font-semibold text-[#1e293b] dark:text-white">
              Required: {jdAnalysis?.education?.required_education || "Not specified"}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#1e293b] dark:text-white">
              Candidate: {jdAnalysis?.education?.candidate_education || "Not available"}
            </p>
            <p className="mt-2 inline-flex rounded-full bg-[#0ea5e9] px-2.5 py-1 text-xs font-bold text-white">
              {jdAnalysis?.education?.education_match ? "Education Matched" : "Education Gap"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748b] dark:text-[#94a3b8]">Keyword Match</p>
            <div className="mt-2 flex items-center justify-between text-sm font-semibold text-[#1e293b] dark:text-white">
              <span>Matched Keywords</span>
              <span>
                {jdAnalysis?.keyword_match?.matched_keywords ?? 0}/{jdAnalysis?.keyword_match?.total_keywords ?? 0}
              </span>
            </div>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
              <TrendingUp size={13} /> {jdAnalysis?.keyword_match?.percentage ?? 0}% coverage
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-black text-emerald-600 dark:text-emerald-300">
              <Target size={15} /> Matched Skills
            </p>
            <ul className="space-y-2 text-sm text-[#475569] dark:text-[#cbd5e1]">
              {matchedSkills.length ? (
                matchedSkills.map((skill, idx) => <li key={`${skill}-${idx}`}>- {skill}</li>)
              ) : (
                <li>No matched skills found.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-black text-rose-600 dark:text-rose-300">
              <CircleAlert size={15} /> Missing Skills
            </p>
            <ul className="space-y-2 text-sm text-[#475569] dark:text-[#cbd5e1]">
              {missingSkills.length ? (
                missingSkills.map((skill, idx) => <li key={`${skill}-${idx}`}>- {skill}</li>)
              ) : (
                <li>No major missing skills detected.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
            <p className="mb-2 inline-flex items-center gap-2 text-sm font-black text-indigo-600 dark:text-indigo-300">
              <Briefcase size={15} /> Extra Skills
            </p>
            <ul className="space-y-2 text-sm text-[#475569] dark:text-[#cbd5e1]">
              {extraSkills.length ? (
                extraSkills.map((skill, idx) => <li key={`${skill}-${idx}`}>- {skill}</li>)
              ) : (
                <li>No additional skills listed.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 dark:border-[#334155] dark:bg-[#111827]">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-black text-[#7c3aed] dark:text-[#c4b5fd]">
            <Lightbulb size={15} /> Suggestions
          </p>
          <ul className="space-y-2 text-sm text-[#475569] dark:text-[#cbd5e1]">
            {suggestions.length ? (
              suggestions.map((item, idx) => <li key={`${item}-${idx}`}>- {item}</li>)
            ) : (
              <li>No suggestions generated yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default JobAnalysisView;