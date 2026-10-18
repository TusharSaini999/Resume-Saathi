import React, { useState } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Target,
  Compass,
  Briefcase,
  TrendingUp,
  Building2,
  RefreshCw,
  Globe,
  Check,
} from "lucide-react";
import { TECH_COUNTRIES, getCountryData } from "../../constants/techLocations";

export default function CareerFilterBar({
  roleSearchInput,
  setRoleSearchInput,
  customCompanyInput,

  customLocationInput,
  setCustomLocationInput,
  countryFilter = "India",
  onCountryChange,
  availableCountries = [],
  locationFilter,
  onLocationChange,

  trackFilter,
  onTrackChange,
  candidateProfile,
  streamFilter,
  onStreamChange,
  availableStreams,
  employmentTypeFilter,
  onEmploymentTypeChange,
  experienceLevelFilter,
  onExperienceLevelChange,
  fresherOnlyFilter,
  onToggleFresherOnly,
  realOnlyFilter,
  onToggleRealOnly,
  strictAiOnlyFilter,
  onToggleStrictAi,
  portalSourceFilter = "All",
  onPortalSourceChange,
  portalCounts = {},
  categoryCounts = {},
  selectedCategory = "All",
  onCategoryChange,

  selectedCompanySlug,
  onSelectQuickCompany,
  filteredCompaniesList,
  onApplyFilters,
  onResetFilters,
  loading,
  GRADIENT_PRIMARY,
}) {
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Active Country & Available Countries dataset
  const allCountries = availableCountries?.length > 0 ? availableCountries : TECH_COUNTRIES;
  const activeCountryObj = getCountryData(countryFilter === "All" ? "India" : countryFilter);

  // Compute number of active filters
  const activeFiltersCount = [
    trackFilter !== "All",
    streamFilter !== "All" && streamFilter !== "my_stream",
    employmentTypeFilter !== "All",
    experienceLevelFilter !== "All",
    portalSourceFilter !== "All",
    fresherOnlyFilter,
    countryFilter !== "All" && countryFilter !== "India",
    locationFilter !== "All" || customLocationInput.trim(),
    selectedCategory !== "All",
    selectedCompanySlug || customCompanyInput.trim(),
  ].filter(Boolean).length;

  // Extract candidate's genuine resume keywords, inferred stacks, and derived roles strictly from candidateProfile
  const roleKeywords = candidateProfile?.roleKeywords || [];
  const resumeSkills = candidateProfile?.resumeKeywords || candidateProfile?.skills || [];
  const inferredStacks = candidateProfile?.inferredStacks || [];
  const derivedRoleTitles = candidateProfile?.derivedRoleTitles || [];


  const extractedResumeKeywords = Array.from(
    new Set([...roleKeywords, ...resumeSkills])
  ).filter((k) => !derivedRoleTitles.includes(k) && Boolean(k)).slice(0, 25);

  const isAllInferredSelected =
    Boolean(roleSearchInput) &&
    (roleSearchInput.toLowerCase().includes("all inferred") ||
      roleSearchInput.toLowerCase().includes("all_inferred") ||
      roleSearchInput.toLowerCase().includes("all-inferred"));

  return (
    <div className="space-y-3">
      {/* Primary Search Container */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3">
          {/* Role / Title Search */}
          <div className="md:col-span-4 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search role (e.g. Full Stack, Backend, PM)..."
              value={roleSearchInput}
              onChange={(e) => setRoleSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onApplyFilters && onApplyFilters(roleSearchInput)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
            />
            {roleSearchInput && (
              <button
                onClick={() => {
                  setRoleSearchInput("");
                  onApplyFilters && onApplyFilters("");
                }}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Country Selector + Location / Tech Hub Input */}
          <div className="md:col-span-5 flex items-center gap-1.5">
            {/* Country Selector Dropdown */}
            <div className="relative shrink-0 w-32 sm:w-36">
              <select
                value={countryFilter || "India"}
                onChange={(e) => onCountryChange && onCountryChange(e.target.value)}
                className="w-full pl-2.5 pr-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white appearance-none cursor-pointer"
                title="Filter jobs by country"
              >
                <option value="All">🌐 All Countries</option>
                {allCountries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-3.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* City / Tech Hub / Area Input */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={countryFilter === "India" ? "City or Tech Hub (e.g. Bengaluru, Pune)..." : "City or 'Remote'..."}
                value={customLocationInput || (locationFilter !== "All" ? locationFilter : "")}
                onChange={(e) => {
                  setCustomLocationInput(e.target.value);
                  if (locationFilter !== "All") onLocationChange("All");
                }}
                onKeyDown={(e) => e.key === "Enter" && onApplyFilters && onApplyFilters()}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              />
              {(customLocationInput || locationFilter !== "All") && (
                <button
                  onClick={() => {
                    setCustomLocationInput("");
                    onLocationChange("All");
                  }}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Search CTA + Filters Toggle */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => onApplyFilters && onApplyFilters(roleSearchInput)}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white ${GRADIENT_PRIMARY} shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50`}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>

            <button
              onClick={() => setIsAdvancedFiltersOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                isAdvancedFiltersOpen || activeFiltersCount > 0
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-700"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle advanced filters"
            >
              <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
              {isAdvancedFiltersOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* ─── Tech Sectors of Country Ribbon (User Requirement: Filter by country & major tech sector areas) ─── */}
        {activeCountryObj?.techHubs?.length > 0 && (
          <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shrink-0 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{activeCountryObj.flag} {activeCountryObj.name} Tech Sectors:</span>
              </span>

              <button
                onClick={() => {
                  setCustomLocationInput("");
                  onLocationChange("All");
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  locationFilter === "All" && !customLocationInput
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                All Tech Areas
              </button>

              {activeCountryObj.techHubs.map((hub) => {
                const isSelected = (locationFilter || "").toLowerCase() === hub.id.toLowerCase() && !customLocationInput;
                return (
                  <button
                    key={hub.id}
                    onClick={() => {
                      setCustomLocationInput("");
                      onLocationChange(hub.id);
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-xs scale-105"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                    }`}
                    title={`${hub.subtitle} • Key tech zones: ${hub.majorAreas.slice(0, 3).join(", ")}`}
                  >
                    <span>{hub.icon}</span>
                    <span>{hub.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Inferred Tech Stacks & Derived Roles Ribbon (User Requirement: Dynamic Stack & Role Derivation) ─── */}
        {(inferredStacks.length > 0 || derivedRoleTitles.length > 0) && (
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 shrink-0 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Inferred Roles &amp; Stacks:</span>
              </span>

              {/* Option: Search based on ALL Inferred Roles & Stacks (All in One) */}
              <button
                onClick={() => {
                  const nextVal = isAllInferredSelected ? "" : "All Inferred Roles & Stacks";
                  setRoleSearchInput(nextVal);
                  onApplyFilters && onApplyFilters(nextVal);
                }}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border shadow-2xs ${
                  isAllInferredSelected
                    ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white border-transparent shadow-md scale-105 ring-2 ring-cyan-400"
                    : "bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 text-cyan-950 dark:text-cyan-100 border-cyan-300 dark:border-cyan-700/80 hover:border-cyan-400 hover:scale-[1.02]"
                }`}
                title="Search based on ALL inferred roles & stacks together using all derived keywords (All-in-One)"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-300 animate-pulse" />
                <span>⚡ All Inferred Roles &amp; Stacks ({derivedRoleTitles.length + inferredStacks.length})</span>
                {isAllInferredSelected && <X className="w-3 h-3 ml-0.5" />}
              </button>

              {/* Inferred Stack Pills (e.g. ⚛️ MERN Stack, 🐍 Python & Django Full Stack, etc.) */}
              {inferredStacks.map((stack) => {
                const isSelected = (roleSearchInput || "").toLowerCase().includes(stack.name.toLowerCase());
                return (
                  <button
                    key={stack.id}
                    onClick={() => {
                      const nextVal = isSelected ? "" : stack.name;
                      setRoleSearchInput(nextVal);
                      onApplyFilters && onApplyFilters(nextVal);
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-xs scale-105"
                        : "bg-cyan-50/90 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800/80 hover:border-cyan-400 hover:scale-[1.02]"
                    }`}
                    title={`Dynamically inferred from skills: ${stack.matchedComponents?.join(", ")} (${stack.confidence}% fit)`}
                  >
                    <span>{stack.icon || "⚡"}</span>
                    <span>{stack.name}</span>
                    <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-200/60 dark:bg-cyan-900/60 font-semibold text-cyan-900 dark:text-cyan-100">
                      {stack.confidence}%
                    </span>
                    {isSelected && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}

              {/* Derived Industry Role Titles (e.g. Full Stack Developer, MERN Stack Developer, SDE, React Developer) */}
              {derivedRoleTitles.map((role) => {
                const isSelected = (roleSearchInput || "").toLowerCase().trim() === role.toLowerCase().trim();
                return (
                  <button
                    key={role}
                    onClick={() => {
                      const nextVal = isSelected ? "" : role;
                      setRoleSearchInput(nextVal);
                      onApplyFilters && onApplyFilters(nextVal);
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-xs scale-105"
                        : "bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800/70 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
                    }`}
                    title={`Derived industry role: click to search live "${role}" openings`}
                  >
                    <span>🎯</span>
                    <span>{role}</span>
                    {isSelected && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Dedicated Resume Keywords Strip (User Requirement: Show extracted resume keywords & filter by them) ─── */}
        {extractedResumeKeywords.length > 0 && (
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800 shrink-0 shadow-2xs">
                <Target className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Extracted from Resume:</span>
              </span>

              {/* All Roles / Clear Filter */}
              <button
                onClick={() => {
                  setRoleSearchInput("");
                  onApplyFilters && onApplyFilters("");
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  !roleSearchInput
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                All Jobs
              </button>

              {/* Individual Extracted Keyword Chips (SDE, FSD, SE, Java, Python, AWS, Docker, React, etc.) */}
              {extractedResumeKeywords.map((kw) => {
                const isSelected = (roleSearchInput || "").toLowerCase().trim() === kw.toLowerCase().trim();
                return (
                  <button
                    key={kw}
                    onClick={() => {
                      const nextVal = isSelected ? "" : kw;
                      setRoleSearchInput(nextVal);
                      onApplyFilters && onApplyFilters(nextVal);
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 border ${
                      isSelected
                        ? "bg-gradient-to-r from-[#fe3e91] to-[#803ad1] text-white border-transparent shadow-xs scale-105"
                        : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700/80 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
                    }`}
                    title={`Click to filter jobs matching resume keyword "${kw}"`}
                  >
                    <span>{kw}</span>
                    {isSelected && <X className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Filter Chips (One Sleek Line) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Quick:
          </span>

          {/* Remote Chip */}
          <button
            onClick={() => onLocationChange(locationFilter === "Remote" ? "All" : "Remote")}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
              locationFilter === "Remote"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            🏠 Remote / WFH
          </button>

          {/* Fresher Only Chip */}
          <button
            onClick={onToggleFresherOnly}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
              fresherOnlyFilter
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            🌱 Fresher Friendly
          </button>

          {/* Dynamic Resume Skills Quick Chips (Taken directly from candidate's resume: Python, Java, React, Docker, etc.) */}
          {extractedResumeKeywords.slice(0, 3).map((tech) => {
            const isSelected = (roleSearchInput || "").toLowerCase().trim() === tech.toLowerCase().trim();
            return (
              <button
                key={`quick-${tech}`}
                onClick={() => {
                  const nextVal = isSelected ? "" : tech;
                  setRoleSearchInput(nextVal);
                  onApplyFilters && onApplyFilters(nextVal);
                }}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 border ${
                  isSelected
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-xs"
                    : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900/60 hover:bg-purple-100"
                }`}
                title={`Filter live jobs matching your resume skill "${tech}"`}
              >
                ⚡ {tech}
              </button>
            );
          })}

          {/* Tech Track Chip */}
          <button
            onClick={() => onTrackChange(trackFilter === "tech" ? "All" : "tech")}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
              trackFilter === "tech"
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            💻 Tech Domain
          </button>

          {/* Management Track Chip */}
          <button
            onClick={() => onTrackChange(trackFilter === "management" ? "All" : "management")}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
              trackFilter === "management"
                ? "bg-amber-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            👔 Management &amp; PM
          </button>

          {/* Real Openings Toggle */}
          <button
            onClick={onToggleRealOnly}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              realOnlyFilter
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                realOnlyFilter ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>{realOnlyFilter ? "Real Openings (ON)" : "Real Openings (OFF)"}</span>
          </button>

          {/* AI Strict Toggle */}
          <button
            onClick={onToggleStrictAi}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              strictAiOnlyFilter
                ? "bg-purple-600 text-white shadow-2xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>AI Strict</span>
          </button>

          {/* Portal Source Segmented Control with Live Counts */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shrink-0">
            {[
              { id: "All", label: "🌐 All", count: portalCounts?.all },
              { id: "official", label: "🏢 Official ATS", count: portalCounts?.official },
              { id: "linkedin", label: "💼 LinkedIn", count: portalCounts?.linkedin },
              { id: "third_party", label: "🚀 Third-Party", count: portalCounts?.third_party },
            ].map((p) => {
              const isSelected = (portalSourceFilter || "All") === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onPortalSourceChange && onPortalSourceChange(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? p.id === "linkedin"
                        ? "bg-[#0077b5] text-white shadow-xs"
                        : p.id === "official"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : p.id === "third_party"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-purple-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{p.label}</span>
                  {typeof p.count === "number" && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                      {p.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Ecosystem / Company Category Chips */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onCategoryChange && onCategoryChange(selectedCategory === "Indian Startups & Unicorns" ? "All" : "Indian Startups & Unicorns")}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === "Indian Startups & Unicorns"
                  ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-2xs"
                  : "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/60 hover:bg-orange-100"
              }`}
            >
              <span>🚀 Indian Startups</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                {categoryCounts?.startups || 85}
              </span>
            </button>

            <button
              onClick={() => onCategoryChange && onCategoryChange(selectedCategory === "Small Startups & Emerging Tech" ? "All" : "Small Startups & Emerging Tech")}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === "Small Startups & Emerging Tech"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-2xs"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60 hover:bg-emerald-100"
              }`}
            >
              <span>🌱 Small Startups</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                {categoryCounts?.smallStartups || 23}
              </span>
            </button>

            <button
              onClick={() => onCategoryChange && onCategoryChange(selectedCategory === "Indian Tech Giants & IT Leaders" ? "All" : "Indian Tech Giants & IT Leaders")}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedCategory === "Indian Tech Giants & IT Leaders"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xs"
                  : "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100"
              }`}
            >
              <span>🇮🇳 Tech Giants</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/20">
                {categoryCounts?.techGiants || 20}
              </span>
            </button>
          </div>

          {/* Reset Filters Link */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-xs font-bold text-red-500 hover:underline shrink-0 ml-auto whitespace-nowrap pl-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Advanced Collapsible Filter Drawer */}
      {isAdvancedFiltersOpen && (
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Section 1: Domain Track & Streams */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-500" />
                Domain Track (Tech vs Management)
              </span>
              {candidateProfile?.track && (
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  Resume Track: {candidateProfile.track.label}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onTrackChange("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  trackFilter === "All"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                🌐 All Domains
              </button>
              <button
                onClick={() => onTrackChange("tech")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  trackFilter === "tech"
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60"
                }`}
              >
                💻 Tech &amp; Engineering
              </button>
              <button
                onClick={() => onTrackChange("management")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  trackFilter === "management"
                    ? "bg-amber-600 text-white shadow-2xs"
                    : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                }`}
              >
                👔 Management &amp; Product
              </button>
            </div>
          </div>

          {/* Section 2: Specialization Streams */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-500" />
                Specialization Stream
              </span>
              {candidateProfile?.primaryStream && (
                <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  Target: {candidateProfile.primaryStream.label}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onStreamChange("All")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  streamFilter === "All"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                All Streams
              </button>

              {availableStreams
                .filter((s) => trackFilter === "All" || s.track === trackFilter)
                .map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onStreamChange(st.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      streamFilter === st.id
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    <span>{st.icon}</span>
                    <span>{st.label}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Section 2: Job Origin / Portal Source */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-500" /> Job Origin &amp; Portal Source
              </span>
              <span className="text-[11px] text-slate-500">Filter by direct ATS vs LinkedIn vs Portals</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                {
                  id: "All",
                  title: "All Sources",
                  icon: "🌐",
                  desc: "Unified feed of all verified openings",
                  badge: typeof portalCounts?.all === "number" ? `${portalCounts.all} Jobs` : "All Portals",
                  color: "purple",
                },
                {
                  id: "official",
                  title: "Official Career ATS",
                  icon: "🏢",
                  desc: "Greenhouse, Lever, SmartRecruiters, TCS iON",
                  badge: typeof portalCounts?.official === "number" ? `${portalCounts.official} Openings` : "Direct ATS",
                  color: "emerald",
                },
                {
                  id: "linkedin",
                  title: "LinkedIn Requisitions",
                  icon: "💼",
                  desc: "Direct company page posts & live openings",
                  badge: typeof portalCounts?.linkedin === "number" ? `${portalCounts.linkedin} Openings` : "LinkedIn",
                  color: "blue",
                },
                {
                  id: "third_party",
                  title: "Third-Party & Startups",
                  icon: "🚀",
                  desc: "Startup direct posts & partner aggregators",
                  badge: typeof portalCounts?.third_party === "number" ? `${portalCounts.third_party} Openings` : "External",
                  color: "amber",
                },
              ].map((p) => {
                const isSelected = (portalSourceFilter || "All") === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onPortalSourceChange && onPortalSourceChange(p.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? p.color === "blue"
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#0077b5] text-slate-900 dark:text-white shadow-xs"
                          : p.color === "emerald"
                          ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white shadow-xs"
                          : p.color === "amber"
                          ? "bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 text-slate-900 dark:text-white shadow-xs"
                          : "bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 text-slate-900 dark:text-white shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{p.icon}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <span className="text-xs font-bold leading-tight">{p.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Company Segments & Startup Ecosystems */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-500" /> Company Segments &amp; Startups
              </span>
              <span className="text-[11px] text-slate-500">Filter by company category</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {[
                {
                  id: "All",
                  title: "All Categories",
                  icon: "🌐",
                  desc: "All Indian companies, unicorns, & MNCs",
                  badge: "All Ecosystems",
                  color: "purple",
                },
                {
                  id: "Indian Startups & Unicorns",
                  title: "🚀 Indian Startups",
                  icon: "🦄",
                  desc: "Razorpay, Swiggy, Meesho, CRED, Groww, Zomato",
                  badge: `${categoryCounts?.startups || 85} Companies`,
                  color: "orange",
                },
                {
                  id: "Small Startups & Emerging Tech",
                  title: "🌱 Small Startups",
                  icon: "🌱",
                  desc: "Pocket FM, DevRev, Slice, SigNoz, Devtron, Hasura",
                  badge: `${categoryCounts?.smallStartups || 23} Teams`,
                  color: "emerald",
                },
                {
                  id: "Indian Tech Giants & IT Leaders",
                  title: "🇮🇳 Tech Giants",
                  icon: "🏢",
                  desc: "TCS, Infosys, Wipro, Zoho, Jio, HCLTech",
                  badge: `${categoryCounts?.techGiants || 20} Leaders`,
                  color: "blue",
                },
              ].map((c) => {
                const isSelected = (selectedCategory || "All") === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onCategoryChange && onCategoryChange(c.id)}
                    className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? c.color === "orange"
                          ? "bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 text-slate-900 dark:text-white shadow-xs"
                          : c.color === "emerald"
                          ? "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-slate-900 dark:text-white shadow-xs"
                          : c.color === "blue"
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-slate-900 dark:text-white shadow-xs"
                          : "bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 text-slate-900 dark:text-white shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{c.icon}</span>
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {c.badge}
                      </span>
                    </div>
                    <span className="text-xs font-bold leading-tight">{c.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {c.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Job Type & Experience Level Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Job Type
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "All", label: "All Types" },
                  { id: "Full-time", label: "💼 Full-Time" },
                  { id: "Internship", label: "🎓 Internships" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onEmploymentTypeChange(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      employmentTypeFilter === t.id
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> Experience Level
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "All", label: "All Levels" },
                  { id: "Fresher", label: "🌱 Fresher" },
                  { id: "Junior", label: "⚡ Junior (1-3 yrs)" },
                  { id: "Mid", label: "🚀 Mid (3-5 yrs)" },
                  { id: "Senior", label: "👑 Senior (5+ yrs)" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => onExperienceLevelChange(lvl.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      experienceLevelFilter === lvl.id
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Country & Tech Sector Hubs of the Nation */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" /> Country &amp; Major Tech Sector Hubs
              </span>
              <span className="text-[11px] text-slate-500">
                Filter by country and high-density tech parks / engineering clusters
              </span>
            </div>

            {/* Country Selector Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onCountryChange && onCountryChange("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  countryFilter === "All"
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                🌐 All Countries
              </button>
              {allCountries.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCountryChange && onCountryChange(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    countryFilter === c.id
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            {/* Tech Hubs Grid for Active Country */}
            {activeCountryObj?.techHubs?.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <span>Major Tech Sectors in {activeCountryObj.flag} {activeCountryObj.name}:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {activeCountryObj.techHubs.map((hub) => {
                    const isSelected = (locationFilter || "").toLowerCase() === hub.id.toLowerCase() && !customLocationInput;
                    return (
                      <div
                        key={hub.id}
                        onClick={() => {
                          setCustomLocationInput("");
                          onLocationChange(hub.id);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? "bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 shadow-xs ring-1 ring-blue-500"
                            : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-blue-400 hover:bg-slate-100"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">{hub.icon}</span>
                            {isSelected && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                                Active Hub
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {hub.name}
                          </div>
                          <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                            {hub.subtitle}
                          </div>
                        </div>
                        {/* Major Tech Areas / Campuses */}
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                          {hub.majorAreas.slice(0, 4).map((area, i) => (
                            <span
                              key={i}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {area}
                            </span>
                          ))}
                          {hub.majorAreas.length > 4 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded text-slate-400 font-medium">
                              +{hub.majorAreas.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Company / Sector Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-purple-500" /> Filter by Company
              </span>
              {selectedCompanySlug && (
                <button
                  onClick={() => onSelectQuickCompany(selectedCompanySlug)}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Clear Company Filter
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {filteredCompaniesList.map((comp) => {
                const isSelected =
                  selectedCompanySlug === comp.slug || selectedCompanySlug === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => onSelectQuickCompany(comp.slug || comp.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-400"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {comp.logo && (
                      <img
                        src={comp.logo}
                        alt=""
                        className="w-3.5 h-3.5 object-contain"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <span>{comp.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

