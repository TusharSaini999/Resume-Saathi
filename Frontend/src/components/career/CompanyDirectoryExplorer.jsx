import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Search,
  Globe,
  Briefcase,
  Linkedin,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  X,
  ChevronRight,
  Filter,
  Zap,
  MapPin,
} from "lucide-react";
import careerService from "../../services/careerService";

const POPULAR_COMPANIES = [
  "Razorpay",
  "Swiggy",
  "Zomato",
  "CRED",
  "Flipkart",
  "PhonePe",
  "Groww",
  "Zepto",
  "TCS",
  "Infosys",
  "Wipro",
  "Zoho",
  "Postman",
  "Hasura",
  "Google",
  "Microsoft",
  "Amazon",
  "Databricks",
  "Stripe",
  "DevRev",
  "SigNoz",
  "Ather Energy",
  "Delhivery",
  "LTIMindtree",
  "Persistent",
  "Slice",
];

const SPIDER_CLUSTERS = [
  { id: "all", label: "🌐 All India Tech", type: "all" },
  { id: "unicorns", label: "🦄 Indian Unicorns (40+)", type: "sector", key: "unicorns" },
  { id: "bengaluru", label: "🏙️ Bengaluru Hubs (30+)", type: "hub", key: "bengaluru" },
  { id: "hyderabad", label: "⚡ Hyderabad HITEC City (18+)", type: "hub", key: "hyderabad" },
  { id: "pune", label: "🏢 Pune Infotech (13+)", type: "hub", key: "pune" },
  { id: "delhi_ncr", label: "🌐 Delhi NCR Corridors (20+)", type: "hub", key: "delhi_ncr" },
  { id: "saas_devtools", label: "💼 SaaS & DevTools (33+)", type: "sector", key: "saas_devtools" },
  { id: "global_mnc", label: "🌍 Global Tech MNCs (44+)", type: "sector", key: "global_mnc" },
];

export default function CompanyDirectoryExplorer({
  companies = [],
  onOpenCompanyProfile,
  onScanPortal,
  scanningPortalCompany,
  onSelectCompanyFilter,
  GRADIENT_PRIMARY,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCategory = "All";
  const [remoteCompanies, setRemoteCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Spider Engine State
  const [selectedSpiderCluster, setSelectedSpiderCluster] = useState("all");
  const [spidering, setSpidering] = useState(false);
  const [spiderMessage, setSpiderMessage] = useState(null);

  // When search query is entered, query the backend discovery service
  useEffect(() => {
    let active = true;
    const fetchSearchResults = async () => {
      if (!searchQuery.trim() && selectedCategory === "All") {
        setRemoteCompanies([]);
        return;
      }
      setLoading(true);
      try {
        const res = await careerService.getCompanies();
        if (active && res?.success && res?.data?.companies) {
          const list = res.data.companies;
          setRemoteCompanies(list);
        }
      } catch (err) {
        console.error("Failed to query companies", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(fetchSearchResults, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory]);

  const handleSpiderCluster = async () => {
    setSpidering(true);
    setSpiderMessage(null);
    try {
      const cluster = SPIDER_CLUSTERS.find((c) => c.id === selectedSpiderCluster) || SPIDER_CLUSTERS[0];
      const payload = {};
      if (cluster.type === "hub") payload.hub = cluster.key;
      else if (cluster.type === "sector") payload.sector = cluster.key;

      const res = await careerService.spiderIndiaTech(payload);
      if (res?.success) {
        const count = res.data?.totalDiscovered || res.data?.jobs?.length || 0;
        setSpiderMessage(`✅ Spidered & indexed ${count} live openings across ${cluster.label}!`);
      } else {
        setSpiderMessage(res?.message || "Spider crawl completed.");
      }
    } catch {
      setSpiderMessage("Network error during spider crawl.");
    } finally {
      setSpidering(false);
    }
  };

  // Combine initial companies with any resolved remote companies
  const activeList = useMemo(() => {
    const base = remoteCompanies.length > 0 ? remoteCompanies : companies;
    const q = searchQuery.toLowerCase().trim();

    return base.filter((comp) => {
      const nameMatch =
        !q ||
        comp.name?.toLowerCase().includes(q) ||
        comp.slug?.toLowerCase().includes(q) ||
        comp.category?.toLowerCase().includes(q);

      const catMatch =
        selectedCategory === "All" ||
        (comp.category || "").toLowerCase().includes(selectedCategory.toLowerCase());

      return nameMatch && catMatch;
    });
  }, [companies, remoteCompanies, searchQuery, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fe3e91]/10 flex items-center justify-center text-[#fe3e91]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Official Company &amp; Career Portals Directory
              </h2>
              <p className="text-xs text-zinc-500">
                Direct verified links to official company sites, career portals, and LinkedIn pages
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            {activeList.length} Tech Companies Operating in India
          </div>
        </div>

        {/* India Tech Multi-Company Spider Toolbar */}
        <div className="p-3 rounded-lg bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Zap className="w-4 h-4 text-[#fe3e91] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 block truncate">
                India Tech Crawling Engine
              </span>
              <span className="text-[10px] text-zinc-500 block truncate">
                Crawl &amp; spider live openings across 150+ tech employers operating in India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
            <select
              value={selectedSpiderCluster}
              onChange={(e) => setSelectedSpiderCluster(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-mono text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              {SPIDER_CLUSTERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <button
              onClick={handleSpiderCluster}
              disabled={spidering}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={spidering ? "animate-spin text-[#fe3e91]" : ""} />
              <span>{spidering ? "Crawling Hub..." : "Crawl Live Openings"}</span>
            </button>
          </div>
        </div>

        {spiderMessage && (
          <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-mono text-emerald-700 dark:text-emerald-300 animate-in fade-in">
            {spiderMessage}
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search company (e.g. Swiggy, Razorpay, Google, CRED, Databricks, TCS, Meesho)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/60 dark:bg-zinc-800/60 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#fe3e91] text-zinc-900 dark:text-white transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Company Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
            Quick Find:
          </span>
          {POPULAR_COMPANIES.map((name) => {
            const isSelected = searchQuery.toLowerCase() === name.toLowerCase();
            return (
              <button
                key={name}
                onClick={() => setSearchQuery(isSelected ? "" : name)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors shrink-0 border ${
                  isSelected
                    ? "bg-[#fe3e91] text-white dark:bg-[#fe3e91] dark:text-white border-[#fe3e91] shadow-2xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700/60 hover:border-zinc-400"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Verified Companies */}
      {loading ? (
        <div className="p-12 text-center text-zinc-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#fe3e91]" />
          <span className="text-xs font-mono">Searching official company portals...</span>
        </div>
      ) : activeList.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
          <Building2 className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No matching companies found for "{searchQuery}"
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Try a different keyword or explore our full registry of tech leaders operating in India.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeList.map((comp) => {
            const isScanning = scanningPortalCompany === (comp.slug || comp.id);
            const companyInitial = (comp.name || "C").charAt(0).toUpperCase();

            return (
              <div
                key={comp.id || comp.slug}
                className="p-4 rounded-xl bg-white dark:bg-[#19191b] border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex flex-col justify-between gap-3 shadow-2xs group"
              >
                <div>
                  {/* Top Bar: Logo + Name + Official Portal Badge */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 p-1 flex items-center justify-center shrink-0">
                      {comp.logo ? (
                        <img
                          src={comp.logo}
                          alt={comp.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {companyInitial}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h3
                          onClick={() => onOpenCompanyProfile(comp.slug || comp.id)}
                          className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-[#fe3e91] cursor-pointer truncate transition-colors"
                          title={comp.name}
                        >
                          {comp.name}
                        </h3>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
                          Official Portal
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-500 truncate">
                        {comp.category || "Tech & Innovation Leader"}
                      </div>
                    </div>
                  </div>

                  {/* Channel Links Grid (Company · Careers · LinkedIn) */}
                  <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] font-mono">
                    {/* 1. Official Company Website */}
                    <a
                      href={comp.companyPageUrl || comp.website || `https://${comp.slug}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-[#fe3e91]/40 hover:text-[#fe3e91] transition-colors flex items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 group/link"
                      title="Visit official company website"
                    >
                      <Globe size={11} className="text-[#fe3e91] shrink-0" />
                      <span className="truncate">Website</span>
                    </a>

                    {/* 2. Official Careers Portal */}
                    <a
                      href={
                        comp.careerPageUrl ||
                        comp.officialPortalUrl ||
                        `https://${comp.slug}.com/careers`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-[#fe3e91]/40 hover:text-[#fe3e91] transition-colors flex items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 group/link"
                      title="Visit official careers portal"
                    >
                      <Briefcase size={11} className="text-[#fe3e91] shrink-0" />
                      <span className="truncate">Careers</span>
                    </a>

                    {/* 3. Official LinkedIn Jobs */}
                    <a
                      href={
                        comp.linkedInJobsUrl ||
                        comp.linkedInUrl ||
                        (comp.slug
                          ? `https://www.linkedin.com/company/${comp.slug.replace(/[^a-z0-9]/g, "")}/jobs/`
                          : comp.name
                          ? `https://www.linkedin.com/company/${comp.name.toLowerCase().replace(/[^a-z0-9]/g, "")}/jobs/`
                          : "https://www.linkedin.com/jobs")
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-[#fe3e91]/40 hover:text-[#fe3e91] transition-colors flex items-center justify-center gap-1 text-zinc-600 dark:text-zinc-400 group/link"
                      title="View jobs on official LinkedIn page"
                    >
                      <Linkedin size={11} className="text-[#fe3e91] shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </a>
                  </div>
                </div>

                {/* Bottom Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => onScanPortal(comp.slug || comp.id)}
                    disabled={isScanning}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 transition-colors disabled:opacity-50"
                    title="Live crawl ATS portal for newly posted jobs"
                  >
                    <RefreshCw size={11} className={isScanning ? "animate-spin text-[#fe3e91]" : ""} />
                    <span>{isScanning ? "Scanning..." : "Scan Portal"}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onSelectCompanyFilter) {
                        onSelectCompanyFilter(comp.slug || comp.id);
                      } else {
                        onOpenCompanyProfile(comp.slug || comp.id);
                      }
                    }}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-mono font-medium text-white ${GRADIENT_PRIMARY || "bg-[#fe3e91] hover:bg-[#e11d48] dark:bg-[#fe3e91] dark:hover:bg-[#ff2aac]"} shadow-xs transition-all`}
                  >
                    <span>Openings</span>
                    <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
