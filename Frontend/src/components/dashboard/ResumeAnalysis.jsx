import { useState } from "react";
import {
  ChevronDown,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  BarChart3,
  Briefcase,
  FileText,
  Type,
  Languages,
  KeyRound,
  Lightbulb,
} from "lucide-react";
import { useSelector } from "react-redux";

const ResumeAnalysis = ({ data, onReupload, loading }) => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [expandedSections, setExpandedSections] = useState({
    ats: true,
    experience: true,
    sectionCoverage: true,
    baseFormat: true,
    format: true,
    englishProblems: true,
    keywords: true,
    suggestions: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const asArray = (value) => (Array.isArray(value) ? value : []);

  const getScoreValueOnTen = (score) => {
    const numeric = Number(score);
    if (Number.isNaN(numeric)) return 0;
    return numeric <= 10 ? numeric : numeric / 10;
  };

  const getScoreColor = (score) => {
    const scoreOnTen = getScoreValueOnTen(score);
    if (scoreOnTen >= 8) return "text-emerald-500";
    if (scoreOnTen >= 6) return "text-amber-500";
    return "text-rose-500";
  };

  const formatScore = (score) => {
    const numeric = Number(score);
    if (Number.isNaN(numeric)) return "N/A";
    return numeric <= 10 ? `${numeric}/10` : `${numeric}/100`;
  };

  const panel = isDark
    ? "border-[#334155] bg-[#111827]/80"
    : "border-[#e2e8f0] bg-white";

  const tile = isDark
    ? "border-[#334155] bg-[#0f172a]"
    : "border-[#e2e8f0] bg-[#f8fafc]";

  const muted = isDark ? "text-[#cbd5e1]" : "text-[#64748b]";
  const heading = isDark ? "text-white" : "text-[#1E293B]";

  const AnalysisSection = ({ title, sectionKey, children, icon: Icon }) => (
    <div className={`rounded-2xl border shadow-sm transition-all ${panel}`}>
      <button
        onClick={() => toggleSection(sectionKey)}
        className={`w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between transition-all ${
          isDark ? "hover:bg-[#0b1220]" : "hover:bg-[#f8fafc]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-2 bg-linear-to-r from-[#fe3e91]/20 via-[#ca25af]/20 to-[#803ad1]/20">
            <Icon size={18} className="text-[#fe3e91]" />
          </div>
          <span className={`font-extrabold tracking-wide text-sm md:text-base ${heading}`}>
            {title}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-300 ${expandedSections[sectionKey] ? "rotate-180" : "rotate-0"} ${muted}`}
        />
      </button>

      {expandedSections[sectionKey] && (
        <div className={`border-t px-5 md:px-6 py-5 md:py-6 ${isDark ? "border-[#334155]" : "border-[#e2e8f0]"}`}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {data.summary && (
        <div className={`rounded-3xl border p-6 md:p-8 shadow-sm ${panel}`}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className={`text-xs uppercase tracking-widest font-bold ${muted}`}>AI Resume Snapshot</p>
              <h3 className={`text-2xl md:text-3xl font-black mt-1 ${heading}`}>Overall Analysis</h3>
            </div>
            <div className="rounded-2xl px-4 py-2 bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] text-white font-bold text-sm">
              {data.summary.ats_compatibility} Compatibility
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>Overall Score</p>
              <p className={`text-3xl mt-2 font-black ${getScoreColor(data.summary.overall_rating)}`}>
                {formatScore(data.summary.overall_rating)}
              </p>
            </div>
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>ATS Compatibility</p>
              <p className="text-2xl mt-2 font-black text-[#fe3e91]">{data.summary.ats_compatibility}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>Keyword Match</p>
              <p className={`text-3xl mt-2 font-black ${getScoreColor(data.keyword_analysis?.keyword_score)}`}>
                {formatScore(data.keyword_analysis?.keyword_score)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className="text-sm font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <CheckCircle size={15} /> Strengths
              </p>
              <ul className="space-y-2">
                {asArray(data.summary.strengths).map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                <AlertCircle size={15} /> Weaknesses
              </p>
              <ul className="space-y-2">
                {asArray(data.summary.weaknesses).map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {data.ats_analysis && (
        <AnalysisSection title="ATS Analysis" sectionKey="ats" icon={BarChart3}>
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-xs font-bold uppercase ${muted}`}>ATS Score</p>
                <p className={`text-2xl mt-2 font-black ${getScoreColor(data.ats_analysis.ats_score)}`}>
                  {formatScore(data.ats_analysis.ats_score)}
                </p>
              </div>
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-xs font-bold uppercase ${muted}`}>Compatibility</p>
                <p className="text-2xl mt-2 font-black text-[#fe3e91]">{data.ats_analysis.compatibility}</p>
              </div>
            </div>

            {asArray(data.ats_analysis.recommendations).length > 0 && (
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-sm font-bold mb-3 ${heading}`}>Recommendations</p>
                <ul className="space-y-2">
                  {asArray(data.ats_analysis.recommendations).map((item, idx) => (
                    <li key={idx} className={`text-sm leading-relaxed ${muted}`}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AnalysisSection>
      )}

      {asArray(data.experience_analysis).length > 0 && (
        <AnalysisSection title="Experience Analysis" sectionKey="experience" icon={Briefcase}>
          <div className="space-y-4">
            {asArray(data.experience_analysis).map((exp, idx) => (
              <div key={idx} className={`rounded-xl border p-5 ${tile}`}>
                <div className="flex flex-wrap justify-between gap-3 mb-3">
                  <div>
                    <p className={`text-base font-bold ${heading}`}>{exp.role} @ {exp.company}</p>
                    <p className={`text-sm ${muted}`}>{exp.duration}</p>
                  </div>
                  <p className={`text-xl font-black ${getScoreColor(exp.depth_score)}`}>
                    {formatScore(exp.depth_score)}
                  </p>
                </div>

                {asArray(exp.achievements).length > 0 && (
                  <div className="mb-3">
                    <p className={`text-xs font-bold uppercase mb-2 ${muted}`}>Achievements</p>
                    <ul className="space-y-2">
                      {asArray(exp.achievements).map((item, i) => (
                        <li key={i} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {asArray(exp.recommendations).length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase mb-2 text-amber-500">Recommendations</p>
                    <ul className="space-y-2">
                      {asArray(exp.recommendations).map((item, i) => (
                        <li key={i} className={`text-sm leading-relaxed ${muted}`}>→ {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {(asArray(data.sections_present).length > 0 || asArray(data.missing_sections).length > 0) && (
        <AnalysisSection title="Section Coverage" sectionKey="sectionCoverage" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Sections Present</p>
              <ul className="space-y-2">
                {asArray(data.sections_present).map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className="text-sm font-bold mb-2 text-amber-500">Missing Sections</p>
              <ul className="space-y-2">
                {asArray(data.missing_sections).map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </AnalysisSection>
      )}

      {data.format_analysis && (
        <AnalysisSection title="Format Issues Analysis" sectionKey="baseFormat" icon={Type}>
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>Format Score</p>
              <p className={`text-2xl mt-2 font-black ${getScoreColor(data.format_analysis.format_score)}`}>
                {formatScore(data.format_analysis.format_score)}
              </p>
            </div>

            {asArray(data.format_analysis.format_issues).length > 0 && (
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-sm font-bold mb-2 ${heading}`}>Detected Issues</p>
                <ul className="space-y-2">
                  {asArray(data.format_analysis.format_issues).map((item, idx) => (
                    <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AnalysisSection>
      )}

      {data.formated_analysis && (
        <AnalysisSection title="Detailed Layout Analysis" sectionKey="format" icon={Type}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Font Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Avg: {data.formated_analysis.font_analysis?.avg_font_size}pt</p>
                <p>Min: {data.formated_analysis.font_analysis?.min_font_size}pt</p>
                <p>Max: {data.formated_analysis.font_analysis?.max_font_size}pt</p>
                <p>Variations: {data.formated_analysis.font_analysis?.font_variations}</p>
                <p>Inconsistent fonts: {data.formated_analysis.font_analysis?.inconsistent_fonts ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Spacing Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Avg line height: {data.formated_analysis.spacing_analysis?.avg_line_height}</p>
                <p>Min line height: {data.formated_analysis.spacing_analysis?.min_line_height}</p>
                <p>Max line height: {data.formated_analysis.spacing_analysis?.max_line_height}</p>
                <p>Excessive spacing: {data.formated_analysis.spacing_analysis?.excessive_spacing_detected ? "Yes" : "No"}</p>
                <p>Compressed spacing: {data.formated_analysis.spacing_analysis?.compressed_spacing_detected ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Column Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Column count: {data.formated_analysis.column_analysis?.column_count}</p>
                <p>Multi-column detected: {data.formated_analysis.column_analysis?.multi_column_detected}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Margin Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Left margin: {data.formated_analysis.margin_analysis?.left_margin}</p>
                <p>Right margin: {data.formated_analysis.margin_analysis?.right_margin}</p>
                <p>Top margin: {data.formated_analysis.margin_analysis?.top_margin}</p>
                <p>Bottom margin: {data.formated_analysis.margin_analysis?.bottom_margin}</p>
                <p>Margin issue detected: {data.formated_analysis.margin_analysis?.margin_issue_detected ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 md:col-span-2 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Alignment Analysis</p>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ${muted}`}>
                <p>Centered text detected: {data.formated_analysis.alignment_analysis?.centered_text_detected ? "Yes" : "No"}</p>
                <p>Inconsistent alignment: {data.formated_analysis.alignment_analysis?.inconsistent_alignment ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 md:col-span-2 ${tile}`}>
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className={`text-xs font-bold uppercase ${muted}`}>Layout Score</p>
                  <p className={`text-2xl font-black mt-1 ${getScoreColor(data.formated_analysis.layout_score)}`}>
                    {formatScore(data.formated_analysis.layout_score)}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  data.formated_analysis.ats_risk_level === "Low"
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-amber-500/20 text-amber-500"
                }`}>
                  {data.formated_analysis.ats_risk_level} ATS Risk
                </span>
              </div>
              {data.formated_analysis.suggestions && (
                <p className={`text-sm leading-relaxed mt-3 ${muted}`}>
                  {data.formated_analysis.suggestions}
                </p>
              )}
            </div>
          </div>
        </AnalysisSection>
      )}

      {asArray(data.english_problem).length > 0 && (
        <AnalysisSection title="English Problems" sectionKey="englishProblems" icon={Languages}>
          <div className="space-y-4">
            {asArray(data.english_problem).map((item, idx) => (
              <div key={idx} className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-sm font-bold mb-2 ${heading}`}>{item.problem_type}</p>
                <p className={`text-sm leading-relaxed mb-2 ${muted}`}><span className="font-bold">Issue:</span> {item.issue_description}</p>
                <p className={`text-sm leading-relaxed mb-2 ${muted}`}><span className="font-bold">Sentence:</span> {item.sentence}</p>
                <p className="text-sm leading-relaxed text-emerald-500"><span className="font-bold">Suggested Fix:</span> {item.suggested_fix}</p>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      {data.keyword_analysis && (
        <AnalysisSection title="Keywords Analysis" sectionKey="keywords" icon={KeyRound}>
          <div className={`rounded-xl border p-4 ${tile}`}>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <p className={`text-sm font-bold ${heading}`}>Keyword Score</p>
              <p className={`text-2xl font-black ${getScoreColor(data.keyword_analysis.keyword_score)}`}>
                {formatScore(data.keyword_analysis.keyword_score)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {asArray(data.keyword_analysis.keywords_found).map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-[#fe3e91]/20 via-[#ca25af]/20 to-[#803ad1]/20 text-[#fe3e91]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </AnalysisSection>
      )}

      {asArray(data.suggestions).length > 0 && (
        <AnalysisSection title="Improvement Suggestions" sectionKey="suggestions" icon={Lightbulb}>
          <div className="space-y-4">
            {asArray(data.suggestions).map((suggestion, idx) => (
              <div
                key={idx}
                className={`rounded-xl border-l-4 p-4 ${
                  suggestion.priority === "High"
                    ? "border-l-rose-500 bg-rose-500/10"
                    : suggestion.priority === "Medium"
                    ? "border-l-amber-500 bg-amber-500/10"
                    : "border-l-blue-500 bg-blue-500/10"
                }`}
              >
                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                  <p className={`text-sm font-bold ${heading}`}>{suggestion.issue}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    suggestion.priority === "High"
                      ? "bg-rose-500/20 text-rose-500"
                      : suggestion.priority === "Medium"
                      ? "bg-amber-500/20 text-amber-500"
                      : "bg-blue-500/20 text-blue-500"
                  }`}>
                    {suggestion.priority}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${muted}`}>{suggestion.recommendation}</p>
                <p className={`text-xs mt-2 ${muted}`}>Section: <span className="font-bold">{suggestion.section}</span></p>
              </div>
            ))}
          </div>
        </AnalysisSection>
      )}

      <button
        onClick={onReupload}
        disabled={loading}
        className={`w-full py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
          loading
            ? "bg-[#fe3e91]/50 text-white cursor-not-allowed"
            : "bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] text-white hover:scale-[1.01] active:scale-95"
        }`}
      >
        <RotateCcw size={18} />
        Upload New Resume
      </button>
    </div>
  );
};

export default ResumeAnalysis;
