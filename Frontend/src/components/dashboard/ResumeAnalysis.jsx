import { createElement, memo, useCallback, useMemo, useState } from "react";
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

const DEFAULT_EXPANDED_SECTIONS = {
  ats: true,
  experience: true,
  sectionCoverage: true,
  baseFormat: true,
  format: true,
  englishProblems: true,
  keywords: true,
  suggestions: true,
};

const EMPTY_ARRAY = [];

const asArray = (value) => (Array.isArray(value) ? value : EMPTY_ARRAY);

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

const AnalysisSection = ({
  title,
  sectionKey,
  children,
  icon,
  panel,
  hoverBg,
  heading,
  muted,
  borderColor,
  expanded,
  onToggle,
}) => (
  <div className={`rounded-2xl hover:rounded-2xl overflow-hidden border shadow-sm transition-all ${panel}`}>
    <button
      onClick={() => onToggle(sectionKey)}
      className={`w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between transition-all ${hoverBg}`}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl p-2 bg-linear-to-r from-[#fe3e91]/20 via-[#ca25af]/20 to-[#803ad1]/20">
          {createElement(icon, { size: 18, className: "text-[#fe3e91]" })}
        </div>
        <span className={`font-extrabold tracking-wide text-sm md:text-base ${heading}`}>
          {title}
        </span>
      </div>
      <ChevronDown
        size={20}
        className={`transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"} ${muted}`}
      />
    </button>

    {expanded && (
      <div className={`border-t px-5 md:px-6 py-5 md:py-6 ${borderColor}`}>
        {children}
      </div>
    )}
  </div>
);

const ResumeAnalysis = ({ data, onReupload, loading }) => {
  const isDark = useSelector((state) => state.theme.isDark);
  const [expandedSections, setExpandedSections] = useState(DEFAULT_EXPANDED_SECTIONS);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const { panel, tile, muted, heading, hoverBg, borderColor } = useMemo(
    () => ({
      panel: isDark
        ? "border-[#334155] bg-[#111827]/80"
        : "border-[#e2e8f0] bg-white",
      tile: isDark
        ? "border-[#334155] bg-[#0f172a]"
        : "border-[#e2e8f0] bg-[#f8fafc]",
      muted: isDark ? "text-[#cbd5e1]" : "text-[#64748b]",
      heading: isDark ? "text-white" : "text-[#1E293B]",
      hoverBg: isDark ? "hover:bg-[#0b1220]" : "hover:bg-[#f8fafc]",
      borderColor: isDark ? "border-[#334155]" : "border-[#e2e8f0]",
    }),
    [isDark],
  );

  const summary = data?.summary;
  const atsAnalysis = data?.ats_analysis;
  const formatAnalysis = data?.format_analysis;
  const formatedAnalysis = data?.formated_analysis;
  const keywordAnalysis = data?.keyword_analysis;
  const experienceAnalysis = useMemo(() => asArray(data?.experience_analysis), [data?.experience_analysis]);
  const sectionsPresent = useMemo(() => asArray(data?.sections_present), [data?.sections_present]);
  const missingSections = useMemo(() => asArray(data?.missing_sections), [data?.missing_sections]);
  const englishProblems = useMemo(() => asArray(data?.english_problem), [data?.english_problem]);
  const improvementSuggestions = useMemo(() => asArray(data?.suggestions), [data?.suggestions]);
  const strengths = useMemo(() => asArray(summary?.strengths), [summary?.strengths]);
  const weaknesses = useMemo(() => asArray(summary?.weaknesses), [summary?.weaknesses]);
  const atsRecommendations = useMemo(() => asArray(atsAnalysis?.recommendations), [atsAnalysis?.recommendations]);
  const formatIssues = useMemo(() => asArray(formatAnalysis?.format_issues), [formatAnalysis?.format_issues]);
  const keywordsFound = useMemo(() => asArray(keywordAnalysis?.keywords_found), [keywordAnalysis?.keywords_found]);

  return (
    <div className="space-y-6">
      {summary && (
        <div className={`rounded-3xl border p-6 md:p-8 shadow-sm ${panel}`}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className={`text-xs uppercase tracking-widest font-bold ${muted}`}>AI Resume Snapshot</p>
              <h3 className={`text-2xl md:text-3xl font-black mt-1 ${heading}`}>Overall Analysis</h3>
            </div>
            <div className="rounded-2xl px-4 py-2 bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] text-white font-bold text-sm">
              {summary.ats_compatibility} Compatibility
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>Overall Score</p>
              <p className={`text-3xl mt-2 font-black ${getScoreColor(summary.overall_rating)}`}>
                {formatScore(summary.overall_rating)}
              </p>
            </div>
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>ATS Compatibility</p>
              <p className="text-2xl mt-2 font-black text-[#fe3e91]">{summary.ats_compatibility}</p>
            </div>
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>Keyword Match</p>
              <p className={`text-3xl mt-2 font-black ${getScoreColor(keywordAnalysis?.keyword_score)}`}>
                {formatScore(keywordAnalysis?.keyword_score)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className="text-sm font-bold text-emerald-500 mb-2 flex items-center gap-2">
                <CheckCircle size={15} /> Strengths
              </p>
              <ul className="space-y-2">
                {strengths.map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-2xl border p-4 ${tile}`}>
              <p className="text-sm font-bold text-amber-500 mb-2 flex items-center gap-2">
                <AlertCircle size={15} /> Weaknesses
              </p>
              <ul className="space-y-2">
                {weaknesses.map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {atsAnalysis && (
        <AnalysisSection
          title="ATS Analysis"
          sectionKey="ats"
          icon={BarChart3}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.ats}
          onToggle={toggleSection}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-xs font-bold uppercase ${muted}`}>ATS Score</p>
                <p className={`text-2xl mt-2 font-black ${getScoreColor(atsAnalysis.ats_score)}`}>
                  {formatScore(atsAnalysis.ats_score)}
                </p>
              </div>
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-xs font-bold uppercase ${muted}`}>Compatibility</p>
                <p className="text-2xl mt-2 font-black text-[#fe3e91]">{atsAnalysis.compatibility}</p>
              </div>
            </div>

            {atsRecommendations.length > 0 && (
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-sm font-bold mb-3 ${heading}`}>Recommendations</p>
                <ul className="space-y-2">
                  {atsRecommendations.map((item, idx) => (
                    <li key={idx} className={`text-sm leading-relaxed ${muted}`}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AnalysisSection>
      )}

      {experienceAnalysis.length > 0 && (
        <AnalysisSection
          title="Experience Analysis"
          sectionKey="experience"
          icon={Briefcase}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.experience}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            {experienceAnalysis.map((exp, idx) => (
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

      {(sectionsPresent.length > 0 || missingSections.length > 0) && (
        <AnalysisSection
          title="Section Coverage"
          sectionKey="sectionCoverage"
          icon={FileText}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.sectionCoverage}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Sections Present</p>
              <ul className="space-y-2">
                {sectionsPresent.map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className="text-sm font-bold mb-2 text-amber-500">Missing Sections</p>
              <ul className="space-y-2">
                {missingSections.map((item, idx) => (
                  <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </AnalysisSection>
      )}

      {formatAnalysis && (
        <AnalysisSection
          title="Format Issues Analysis"
          sectionKey="baseFormat"
          icon={Type}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.baseFormat}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-xs font-bold uppercase ${muted}`}>Format Score</p>
              <p className={`text-2xl mt-2 font-black ${getScoreColor(formatAnalysis.format_score)}`}>
                {formatScore(formatAnalysis.format_score)}
              </p>
            </div>

            {formatIssues.length > 0 && (
              <div className={`rounded-xl border p-4 ${tile}`}>
                <p className={`text-sm font-bold mb-2 ${heading}`}>Detected Issues</p>
                <ul className="space-y-2">
                  {formatIssues.map((item, idx) => (
                    <li key={idx} className={`text-sm leading-relaxed ${muted}`}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AnalysisSection>
      )}

      {formatedAnalysis && (
        <AnalysisSection
          title="Detailed Layout Analysis"
          sectionKey="format"
          icon={Type}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.format}
          onToggle={toggleSection}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Font Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Avg: {formatedAnalysis.font_analysis?.avg_font_size}pt</p>
                <p>Min: {formatedAnalysis.font_analysis?.min_font_size}pt</p>
                <p>Max: {formatedAnalysis.font_analysis?.max_font_size}pt</p>
                <p>Variations: {formatedAnalysis.font_analysis?.font_variations}</p>
                <p>Inconsistent fonts: {formatedAnalysis.font_analysis?.inconsistent_fonts ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Spacing Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Avg line height: {formatedAnalysis.spacing_analysis?.avg_line_height}</p>
                <p>Min line height: {formatedAnalysis.spacing_analysis?.min_line_height}</p>
                <p>Max line height: {formatedAnalysis.spacing_analysis?.max_line_height}</p>
                <p>Excessive spacing: {formatedAnalysis.spacing_analysis?.excessive_spacing_detected ? "Yes" : "No"}</p>
                <p>Compressed spacing: {formatedAnalysis.spacing_analysis?.compressed_spacing_detected ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Column Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Column count: {formatedAnalysis.column_analysis?.column_count}</p>
                <p>Multi-column detected: {formatedAnalysis.column_analysis?.multi_column_detected?"Yes":"No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Margin Analysis</p>
              <div className={`space-y-1 text-sm ${muted}`}>
                <p>Left margin: {formatedAnalysis.margin_analysis?.left_margin}</p>
                <p>Right margin: {formatedAnalysis.margin_analysis?.right_margin}</p>
                <p>Top margin: {formatedAnalysis.margin_analysis?.top_margin}</p>
                <p>Bottom margin: {formatedAnalysis.margin_analysis?.bottom_margin}</p>
                <p>Margin issue detected: {formatedAnalysis.margin_analysis?.margin_issue_detected ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 md:col-span-2 ${tile}`}>
              <p className={`text-sm font-bold mb-2 ${heading}`}>Alignment Analysis</p>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ${muted}`}>
                <p>Centered text detected: {formatedAnalysis.alignment_analysis?.centered_text_detected ? "Yes" : "No"}</p>
                <p>Inconsistent alignment: {formatedAnalysis.alignment_analysis?.inconsistent_alignment ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className={`rounded-xl border p-4 md:col-span-2 ${tile}`}>
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className={`text-xs font-bold uppercase ${muted}`}>Layout Score</p>
                  <p className={`text-2xl font-black mt-1 ${getScoreColor(formatedAnalysis.layout_score)}`}>
                    {formatScore(formatedAnalysis.layout_score)}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  formatedAnalysis.ats_risk_level === "Low"
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-amber-500/20 text-amber-500"
                }`}>
                  {formatedAnalysis.ats_risk_level} ATS Risk
                </span>
              </div>
              {formatedAnalysis.suggestions && (
                <p className={`text-sm leading-relaxed mt-3 ${muted}`}>
                  {formatedAnalysis.suggestions}
                </p>
              )}
            </div>
          </div>
        </AnalysisSection>
      )}

      {englishProblems.length > 0 && (
        <AnalysisSection
          title="English Problems"
          sectionKey="englishProblems"
          icon={Languages}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.englishProblems}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            {englishProblems.map((item, idx) => (
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

      {keywordAnalysis && (
        <AnalysisSection
          title="Keywords Analysis"
          sectionKey="keywords"
          icon={KeyRound}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.keywords}
          onToggle={toggleSection}
        >
          <div className={`rounded-xl border p-4 ${tile}`}>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <p className={`text-sm font-bold ${heading}`}>Keyword Score</p>
              <p className={`text-2xl font-black ${getScoreColor(keywordAnalysis.keyword_score)}`}>
                {formatScore(keywordAnalysis.keyword_score)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywordsFound.map((keyword, idx) => (
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

      {improvementSuggestions.length > 0 && (
        <AnalysisSection
          title="Improvement Suggestions"
          sectionKey="suggestions"
          icon={Lightbulb}
          panel={panel}
          hoverBg={hoverBg}
          heading={heading}
          muted={muted}
          borderColor={borderColor}
          expanded={expandedSections.suggestions}
          onToggle={toggleSection}
        >
          <div className="space-y-4">
            {improvementSuggestions.map((suggestion, idx) => (
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

export default memo(ResumeAnalysis);
