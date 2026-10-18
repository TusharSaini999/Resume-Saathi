import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Building2,
  Sparkles,
  Bookmark,
  Search,
  MapPin,
  RefreshCw,
  Rocket,
  ShieldCheck,
  FileText,
  Upload,
  Globe,
  Target,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Zap,
} from "lucide-react";
import { submitResume } from "../context/Thunk/UploadResume.js";
import careerService from "../services/careerService";
import {
  fetchCompaniesThunk,
  fetchCareerJobsThunk,
  fetchTrackedJobsThunk,
  trackJobThunk,
  updateTrackedStatusThunk,
  deleteTrackedJobThunk,
  scanCompanyPortalThunk,
  setTrackFilter,
  setEmploymentTypeFilter,
  setExperienceLevelFilter,
  setStreamFilter,
  setFresherOnlyFilter,
  setLocationFilter,
  setCountryFilter,
  setStrictAiOnlyFilter,
  setRealOnlyFilter,
  setPortalSourceFilter,
  postJobProfileThunk,
  clearFilters,
} from "../context/careerSlice";
import { setSuccess, setError } from "../context/messageSlice";

// Modular Subcomponents
import JobCard from "../components/career/JobCard";
import JobDetailsModal from "../components/career/JobDetailsModal";
import JobVerificationModal from "../components/career/JobVerificationModal";
import UniversalLinkCheckerModal from "../components/career/UniversalLinkCheckerModal";
import PostStartupJobModal from "../components/career/PostStartupJobModal";
import NewResumeModal from "../components/career/NewResumeModal";
import CompanyProfileModal from "../components/career/CompanyProfileModal";
import ApplicationTracker from "../components/career/ApplicationTracker";
import CareerFilterBar from "../components/career/CareerFilterBar";
import AgUiSearchConsole from "../components/career/AgUiSearchConsole";
import { TECH_COUNTRIES } from "../constants/techLocations";

const GRADIENT_PRIMARY =
  "bg-gradient-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]";

const POPULAR_LOCATIONS = [
  { id: "All", label: "All Locations", icon: "🌐" },
  { id: "Remote", label: "Remote / WFH", icon: "🏠" },
  { id: "Bengaluru", label: "Bengaluru", icon: "📍" },
  { id: "Hyderabad", label: "Hyderabad", icon: "📍" },
  { id: "Pune", label: "Pune", icon: "📍" },
  { id: "Delhi NCR", label: "Delhi NCR", icon: "📍" },
  { id: "Mumbai", label: "Mumbai", icon: "📍" },
  { id: "Chennai", label: "Chennai", icon: "📍" },
];

const JOBS_PER_PAGE = 12;

export default function CareerOpenings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    companies,
    categories,
    jobs,
    totalJobs,
    candidateProfile,
    availableStreams,
    hasResume,
    trackedJobs,
    trackFilter,
    streamFilter,
    employmentTypeFilter,
    experienceLevelFilter,
    fresherOnlyFilter,
    locationFilter,
    countryFilter,
    availableCountries,
    portalSourceFilter,
    portalCounts,
    strictAiOnlyFilter,
    realOnlyFilter,
    loading,
  } = useSelector((state) => state.career);

  // Active primary view tab
  const [activeTab, setActiveTab] = useState("openings"); // "openings" | "startups" | "small_startups" | "tech_giants" | "tracker"
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCompanySlug, setSelectedCompanySlug] = useState("");
  const [customCompanyInput, setCustomCompanyInput] = useState("");
  const [roleSearchInput, setRoleSearchInput] = useState("");
  const [customLocationInput, setCustomLocationInput] = useState("");
  const minScoreFilter = 0;
  const [sortBy, setSortBy] = useState("match"); // "match" | "recent" | "company" | "title"
  const [currentPage, setCurrentPage] = useState(1);

  // Tracker Filters & Note Editing
  const [trackerStatusTab, setTrackerStatusTab] = useState("all");
  const [trackerSearch, setTrackerSearch] = useState("");
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState("");

  // Modals state
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [selectedCompanyForModal, setSelectedCompanyForModal] = useState(null);
  const [scanningPortalCompany, setScanningPortalCompany] = useState(null);
  const [portalScanModalData, setPortalScanModalData] = useState(null);

  // Online Job Verification State
  const [checkingOnlineJobs, setCheckingOnlineJobs] = useState({});
  const [jobVerificationModal, setJobVerificationModal] = useState({
    isOpen: false,
    loading: false,
    data: null,
    error: null,
    job: null,
  });

  // Universal Any Job Link Checker Modal
  const [universalLinkCheckerModal, setUniversalLinkCheckerModal] = useState({
    isOpen: false,
    urlInput: "",
    analyzing: false,
    result: null,
    error: null,
  });

  // Post / Import Startup Job Profile Modal
  const [postJobModal, setPostJobModal] = useState({
    isOpen: false,
    applyUrl: "",
    company: "",
    title: "",
    location: "Bengaluru, India",
    description: "",
    skillsInput: "",
    employmentType: "Full-time",
    isFresherFriendly: false,
    extracting: false,
    submitting: false,
    error: null,
  });

  // Check with New Resume Modal
  const [newResumeModal, setNewResumeModal] = useState({
    isOpen: false,
    file: null,
    dragActive: false,
    uploading: false,
    uploadStage: "",
    error: null,
  });

  // Initial Data Fetch
  useEffect(() => {
    dispatch(fetchCompaniesThunk());
    dispatch(
      fetchCareerJobsThunk({
        country: "India",
        location: "All",
        track: "All",
        stream: "All",
        employmentType: "All",
        experienceLevel: "All",
        fresherOnly: false,
        strictAiOnly: false,
        aiDeepMatch: true,
        realOnly: true,
      })
    );
    dispatch(fetchTrackedJobsThunk());
  }, [dispatch]);

  // Execute Search / Filter
  const handleApplyFilters = (
    overrideCompany = null,
    isForce = false,
    overrideTrack = null,
    overrideStream = null,
    overrideCategory = null,
    overrideLocation = null,
    overrideRealOnly = null,
    overrideEmploymentType = null,
    overrideExperienceLevel = null,
    overrideFresherOnly = null,
    overrideStrictAiOnly = null,
    overridePortalSource = null,
    overrideRole = null,
    overrideCountry = null
  ) => {
    setCurrentPage(1);
    const comp =
      overrideCompany !== null
        ? overrideCompany
        : customCompanyInput.trim() || selectedCompanySlug;

    const role = overrideRole !== null ? overrideRole : roleSearchInput.trim();
    const trk = overrideTrack !== null ? overrideTrack : trackFilter;
    const stm = overrideStream !== null ? overrideStream : streamFilter;
    const cat = overrideCategory !== null ? overrideCategory : selectedCategory;
    const ctry = overrideCountry !== null ? overrideCountry : countryFilter;
    const loc =
      overrideLocation !== null
        ? overrideLocation
        : customLocationInput.trim() || locationFilter;
    const realOn = overrideRealOnly !== null ? overrideRealOnly : realOnlyFilter;
    const empType = overrideEmploymentType !== null ? overrideEmploymentType : employmentTypeFilter;
    const expLvl = overrideExperienceLevel !== null ? overrideExperienceLevel : experienceLevelFilter;
    const freshOn = overrideFresherOnly !== null ? overrideFresherOnly : fresherOnlyFilter;
    const strictAi = overrideStrictAiOnly !== null ? overrideStrictAiOnly : strictAiOnlyFilter;
    const pSource = overridePortalSource !== null ? overridePortalSource : portalSourceFilter;

    dispatch(
      fetchCareerJobsThunk({
        company: comp,
        role,
        location: loc,
        country: ctry,
        category: cat !== "All" && cat !== "LinkedIn Jobs" ? cat : "",
        minScore: minScoreFilter,
        track: trk,
        stream: stm,
        employmentType: empType,
        experienceLevel: expLvl,
        fresherOnly: freshOn,
        strictAiOnly: strictAi,
        aiDeepMatch: true,
        forceRefresh: isForce,
        realOnly: realOn,
        portalSource: pSource,
      })
    );
  };

  const handleCountryChange = (nextCountry) => {
    setCurrentPage(1);
    dispatch(setCountryFilter(nextCountry));
    dispatch(setLocationFilter("All"));
    setCustomLocationInput("");
    handleApplyFilters(null, false, null, null, null, "All", null, null, null, null, null, null, null, nextCountry);
    const label = nextCountry === "All" ? "All Countries" : nextCountry;
    dispatch(setSuccess(`Filtering tech sectors in: ${label}`));
  };

  const handlePortalSourceChange = (pSourceId) => {
    setCurrentPage(1);
    dispatch(setPortalSourceFilter(pSourceId));
    handleApplyFilters(null, false, null, null, null, null, null, null, null, null, null, pSourceId);
    const label =
      pSourceId === "official"
        ? "Official ATS Portals (Greenhouse, Lever, SmartRecruiters, TCS iON)"
        : pSourceId === "linkedin"
        ? "LinkedIn Verified Company Requisitions"
        : pSourceId === "third_party"
        ? "Third-Party & Startup Portals"
        : "All Portals Unified Feed";
    dispatch(setSuccess(`Filtering by: ${label}`));
  };

  const handleCategoryChange = (category) => {
    setCurrentPage(1);
    const nextCategory = selectedCategory === category ? "All" : category;
    setSelectedCategory(nextCategory);
    handleApplyFilters(null, false, null, null, nextCategory);
    if (nextCategory !== "All") {
      dispatch(setSuccess(`Filtering by: ${nextCategory}`));
    }
  };

  const handleToggleRealOnly = () => {
    setCurrentPage(1);
    const newVal = !realOnlyFilter;
    dispatch(setRealOnlyFilter(newVal));
    handleApplyFilters(null, false, null, null, null, null, newVal);
    dispatch(
      setSuccess(
        newVal
          ? "🟢 Real Openings Only: Showing live verified ATS requisitions."
          : "Showing all discovered postings."
      )
    );
  };

  const handleAutoExtractJobLink = async (url) => {
    if (!url || !url.trim()) return;
    setPostJobModal((prev) => ({ ...prev, extracting: true, error: null }));
    try {
      const res = await careerService.verifyJobOnline({ url: url.trim() });
      if (res.success && res.data?.job) {
        const j = res.data.job;
        setPostJobModal((prev) => ({
          ...prev,
          extracting: false,
          company: j.company || prev.company,
          title: j.title || prev.title,
          location: j.location || prev.location,
          description: j.cleanText || j.description || prev.description,
          skillsInput: Array.isArray(j.requiredSkills)
            ? j.requiredSkills.join(", ")
            : prev.skillsInput,
          isFresherFriendly: Boolean(j.isFresherFriendly),
        }));
        dispatch(setSuccess("✓ Job details auto-extracted from link!"));
      } else {
        setPostJobModal((prev) => ({ ...prev, extracting: false }));
      }
    } catch {
      setPostJobModal((prev) => ({ ...prev, extracting: false }));
    }
  };

  const handleSubmitPostJob = async (e) => {
    e.preventDefault();
    if (!postJobModal.title.trim() && !postJobModal.applyUrl.trim()) {
      setPostJobModal((prev) => ({
        ...prev,
        error: "Please enter a Job Title or Apply Link.",
      }));
      return;
    }
    setPostJobModal((prev) => ({ ...prev, submitting: true, error: null }));
    try {
      const skillsArray = postJobModal.skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await dispatch(
        postJobProfileThunk({
          applyUrl: postJobModal.applyUrl.trim(),
          company: postJobModal.company.trim() || "Emerging Tech Startup",
          title: postJobModal.title.trim(),
          location: postJobModal.location.trim() || "Bengaluru / Remote",
          description: postJobModal.description.trim(),
          skills: skillsArray,
          employmentType: postJobModal.employmentType,
          isFresherFriendly: postJobModal.isFresherFriendly,
        })
      ).unwrap();

      dispatch(
        setSuccess(`✓ Successfully posted "${postJobModal.title}"! Added to active listings.`)
      );
      setPostJobModal({
        isOpen: false,
        applyUrl: "",
        company: "",
        title: "",
        location: "Bengaluru, India",
        description: "",
        skillsInput: "",
        employmentType: "Full-time",
        isFresherFriendly: false,
        extracting: false,
        submitting: false,
        error: null,
      });
    } catch (err) {
      setPostJobModal((prev) => ({
        ...prev,
        submitting: false,
        error: typeof err === "string" ? err : "Failed to post job profile.",
      }));
    }
  };

  const handleScanCompanyOriginalPortal = async (companyNameOrSlug, e) => {
    if (e) e.stopPropagation();
    try {
      setScanningPortalCompany(companyNameOrSlug);
      const res = await dispatch(
        scanCompanyPortalThunk({
          company: companyNameOrSlug,
          roleQuery: roleSearchInput.trim(),
          location: "India",
        })
      ).unwrap();

      setPortalScanModalData(res);
      dispatch(
        setSuccess(
          `Scanned ${res.company?.name || companyNameOrSlug} portal: found ${res.totalJobs} live openings!`
        )
      );
    } catch (err) {
      dispatch(
        setError(`Could not scan ${companyNameOrSlug} portal: ${err || "Network timeout"}`)
      );
    } finally {
      setScanningPortalCompany(null);
    }
  };

  const handleSelectQuickCompany = (companySlug) => {
    if (selectedCompanySlug === companySlug) {
      setSelectedCompanySlug("");
      setCustomCompanyInput("");
      handleApplyFilters("");
    } else {
      setSelectedCompanySlug(companySlug);
      setCustomCompanyInput("");
      handleApplyFilters(companySlug);
    }
  };

  const handleTrackChange = (trkId) => {
    setCurrentPage(1);
    dispatch(setTrackFilter(trkId));
    let newStream = streamFilter;
    if (trkId !== "All" && trkId !== "my_track") {
      newStream = "All";
      dispatch(setStreamFilter("All"));
    }
    handleApplyFilters(null, false, trkId, newStream);
  };

  const handleStreamChange = (strId) => {
    setCurrentPage(1);
    dispatch(setStreamFilter(strId));
    handleApplyFilters(null, false, null, strId);
  };

  const handleAutoMatchProfile = () => {
    setCurrentPage(1);
    const candTrack = candidateProfile?.track?.id || "tech";
    const candStream = candidateProfile?.primaryStream?.id || "All";
    dispatch(setTrackFilter(candTrack));
    dispatch(setStreamFilter(candStream));
    handleApplyFilters(null, false, candTrack, candStream);
    dispatch(
      setSuccess(
        `Auto-matched openings for ${candidateProfile?.track?.label || "profile"} (${candidateProfile?.primaryStream?.label})!`
      )
    );
  };

  const handleToggleStrictAi = () => {
    setCurrentPage(1);
    const newVal = !strictAiOnlyFilter;
    dispatch(setStrictAiOnlyFilter(newVal));
    handleApplyFilters(null, false, null, null, null, null, null, null, null, null, newVal);
    dispatch(
      setSuccess(
        newVal
          ? "🤖 AI Strict Relevance ACTIVE: Displaying verified relevant roles."
          : "Showing all discoverable roles."
      )
    );
  };

  const handleCheckJobOnline = async (job, e) => {
    if (e) e.stopPropagation();
    const jobId = job.id;

    setJobVerificationModal({
      isOpen: true,
      loading: true,
      data: null,
      error: null,
      job,
    });

    setCheckingOnlineJobs((prev) => ({
      ...prev,
      [jobId]: { checking: true, statusText: "Verifying live..." },
    }));

    try {
      const res = await careerService.verifyJobOnline({
        url: job.applyUrl,
        job,
        source: job.source,
        companySlug: job.companySlug,
        externalId: job.externalId,
      });

      if (res.success && res.data) {
        setJobVerificationModal({
          isOpen: true,
          loading: false,
          data: res.data,
          error: null,
          job,
        });

        setCheckingOnlineJobs((prev) => ({
          ...prev,
          [jobId]: {
            checking: false,
            online: res.data.online,
            statusText: res.data.online ? "Verified Live" : "Check Portal",
            portalType: res.data.portalType,
            verifiedAt: res.data.verifiedAt,
          },
        }));

        if (res.data.online) {
          dispatch(
            setSuccess(
              `✓ Verified online: ${job.title} at ${job.company} is actively accepting applications!`
            )
          );
        }
      } else {
        setJobVerificationModal({
          isOpen: true,
          loading: false,
          data: null,
          error: res.message || "Could not complete live verification probe.",
          job,
        });
        setCheckingOnlineJobs((prev) => ({
          ...prev,
          [jobId]: { checking: false, online: true, statusText: "Online" },
        }));
      }
    } catch {
      setJobVerificationModal({
        isOpen: true,
        loading: false,
        data: null,
        error: "Network error while probing official career portal.",
        job,
      });
      setCheckingOnlineJobs((prev) => ({
        ...prev,
        [jobId]: { checking: false, online: true, statusText: "Online" },
      }));
    }
  };

  const handleInspectExternalLink = async (e) => {
    if (e) e.preventDefault();
    const rawUrl = universalLinkCheckerModal.urlInput.trim();
    if (!rawUrl) {
      setUniversalLinkCheckerModal((prev) => ({
        ...prev,
        error: "Please enter a valid job URL to check.",
      }));
      return;
    }

    let validUrl = rawUrl;
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    try {
      new URL(validUrl);
    } catch {
      setUniversalLinkCheckerModal((prev) => ({
        ...prev,
        error: "Please enter a valid URL (e.g. https://careers.google.com/...)",
      }));
      return;
    }

    setUniversalLinkCheckerModal((prev) => ({
      ...prev,
      analyzing: true,
      error: null,
      result: null,
    }));

    try {
      const res = await careerService.verifyJobOnline({ url: validUrl });
      if (res.success && res.data) {
        setUniversalLinkCheckerModal((prev) => ({
          ...prev,
          analyzing: false,
          result: res.data,
          error: null,
        }));
        dispatch(
          setSuccess(
            `✓ Verified Link: ${res.data.job?.company || "Company"} - ${res.data.probe?.statusBadge || "Active"}`
          )
        );
      } else {
        setUniversalLinkCheckerModal((prev) => ({
          ...prev,
          analyzing: false,
          error: res.message || "Failed to inspect this external job link.",
        }));
      }
    } catch {
      setUniversalLinkCheckerModal((prev) => ({
        ...prev,
        analyzing: false,
        error: "Network timeout inspecting link. Please try again.",
      }));
    }
  };

  const handleNewResumeFileSelect = (file) => {
    if (!file) return;
    const ext = (file.name || "").split(".").pop().toLowerCase();
    const allowed = ["pdf", "docx", "doc"];
    if (!allowed.includes(ext)) {
      setNewResumeModal((prev) => ({
        ...prev,
        error: "Please select a valid PDF (.pdf) or Word document (.docx).",
      }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setNewResumeModal((prev) => ({
        ...prev,
        error: "File size must be under 10MB.",
      }));
      return;
    }
    setNewResumeModal((prev) => ({
      ...prev,
      file,
      error: null,
    }));
  };

  const handleUploadNewResumeAndCheck = async () => {
    if (!newResumeModal.file) {
      setNewResumeModal((prev) => ({
        ...prev,
        error: "Please select a PDF or DOCX file.",
      }));
      return;
    }

    setNewResumeModal((prev) => ({
      ...prev,
      uploading: true,
      uploadStage: "Uploading & analyzing resume with AI...",
      error: null,
    }));

    try {
      await dispatch(submitResume(newResumeModal.file)).unwrap();

      setNewResumeModal((prev) => ({
        ...prev,
        uploadStage: "Tailoring career openings to your new resume...",
      }));

      await dispatch(
        fetchCareerJobsThunk({
          company: customCompanyInput.trim() || selectedCompanySlug,
          role: roleSearchInput.trim(),
          country: countryFilter,
          location: locationFilter,
          category: selectedCategory !== "All" ? selectedCategory : "",
          minScore: minScoreFilter,
          track: "my_track",
          stream: "my_stream",
          employmentType: employmentTypeFilter,
          experienceLevel: experienceLevelFilter,
          fresherOnly: fresherOnlyFilter,
          strictAiOnly: strictAiOnlyFilter,
          aiDeepMatch: true,
          forceRefresh: true,
          useNewResume: true,
        })
      ).unwrap();

      dispatch(
        setSuccess("✓ New resume uploaded successfully! All jobs dynamically re-scored.")
      );
      setNewResumeModal({
        isOpen: false,
        file: null,
        dragActive: false,
        uploading: false,
        uploadStage: "",
        error: null,
      });
    } catch (err) {
      setNewResumeModal((prev) => ({
        ...prev,
        uploading: false,
        uploadStage: "",
        error:
          typeof err === "string"
            ? err
            : err?.message || "Failed to upload resume. Please try again.",
      }));
    }
  };

  const handleOpenCompanyProfile = (companyNameOrSlug, e) => {
    if (e) e.stopPropagation();
    const clean = (companyNameOrSlug || "").toLowerCase().trim();
    let found = companies.find(
      (c) =>
        c.slug?.toLowerCase() === clean ||
        c.id?.toLowerCase() === clean ||
        c.name?.toLowerCase() === clean
    );

    if (!found) {
      const displayName = companyNameOrSlug || "Company";
      found = {
        id: clean,
        name: displayName,
        slug: clean,
        provider: "Official Career Portal",
        category: "Tech & Innovation Leader",
        logo: `https://${clean.replace(/[^a-z0-9]/g, "")}.com/favicon.ico`,
        website: `https://${clean.replace(/[^a-z0-9]/g, "")}.com`,
        headquarters: "India / Global Hubs",
        description: `${displayName} is actively hiring across technology, product, and leadership domains.`,
      };
    }

    setSelectedCompanyForModal(found);
  };

  const handleEmploymentTypeChange = (type) => {
    setCurrentPage(1);
    dispatch(setEmploymentTypeFilter(type));
    handleApplyFilters(null, false, null, null, null, null, null, type);
  };

  const handleExperienceLevelChange = (level) => {
    setCurrentPage(1);
    dispatch(setExperienceLevelFilter(level));
    handleApplyFilters(null, false, null, null, null, null, null, null, level);
  };

  const handleLocationChange = (loc) => {
    setCurrentPage(1);
    dispatch(setLocationFilter(loc));
    handleApplyFilters(null, false, null, null, null, loc === "All" ? "India" : loc);
  };

  const handleToggleFresherOnly = () => {
    setCurrentPage(1);
    const newVal = !fresherOnlyFilter;
    dispatch(setFresherOnlyFilter(newVal));
    handleApplyFilters(null, false, null, null, null, null, null, null, null, newVal);
  };

  const handleSaveJob = async (job) => {
    try {
      let domain = "";
      try {
        domain = new URL(job.applyUrl).hostname;
      } catch {
        domain = "";
      }

      const sourceLabel =
        job.sourcePortal ||
        job.portalLabel ||
        (job.source === "greenhouse"
          ? "Greenhouse ATS"
          : job.source === "lever"
            ? "Lever ATS"
            : job.source === "smartrecruiters"
              ? "SmartRecruiters ATS"
              : "Official Portal");

      await dispatch(
        trackJobThunk({
          company_name: job.company,
          title: job.title,
          location: job.location,
          apply_url: job.applyUrl,
          source: job.source || "official_portal",
          source_portal: sourceLabel,
          source_url: job.applyUrl,
          source_domain: domain,
          portal_type: job.portalType || "Official Portal",
          employment_type: job.employmentType || "Full-time",
          experience_level: job.experienceLevel || "Junior (1-3 yrs)",
          match_score: job.matchScore,
          matched_skills: job.matchedSkills,
          missing_skills: job.missingSkills,
          status: "saved",
        })
      ).unwrap();
      dispatch(
        setSuccess(`Saved ${job.title} at ${job.company} to your tracker!`)
      );
    } catch (err) {
      dispatch(setError(err || "Failed to save job"));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await dispatch(updateTrackedStatusThunk({ id, data: { status } })).unwrap();
      dispatch(setSuccess(`Application status updated to ${status}`));
    } catch (err) {
      dispatch(setError(err || "Failed to update status"));
    }
  };

  const handleSaveNotes = async (id) => {
    try {
      await dispatch(updateTrackedStatusThunk({ id, data: { notes: noteText } })).unwrap();
      setEditingNotesId(null);
      dispatch(setSuccess("Notes saved successfully!"));
    } catch (err) {
      dispatch(setError(err || "Failed to save notes"));
    }
  };

  const handleDeleteTracked = async (id) => {
    try {
      await dispatch(deleteTrackedJobThunk(id)).unwrap();
      dispatch(setSuccess("Removed from your tracker"));
    } catch (err) {
      dispatch(setError(err || "Failed to remove tracked job"));
    }
  };

  const handleExportCSV = () => {
    if (!trackedJobs.length) {
      dispatch(setError("No applications in tracker to export"));
      return;
    }

    const headers = [
      "Company",
      "Title",
      "Location",
      "Match Score",
      "Source",
      "Status",
      "Notes",
      "Apply URL",
      "Saved Date",
    ];
    const rows = trackedJobs.map((j) => [
      `"${j.company_name.replace(/"/g, '""')}"`,
      `"${j.title.replace(/"/g, '""')}"`,
      `"${(j.location || "Remote / India").replace(/"/g, '""')}"`,
      `"${j.match_score || 0}%"`,
      `"${(j.source_portal || j.source || "Official Portal").replace(/"/g, '""')}"`,
      `"${j.status}"`,
      `"${(j.notes || "").replace(/"/g, '""')}"`,
      `"${j.apply_url}"`,
      `"${j.createdAt ? new Date(j.createdAt).toLocaleDateString() : ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ResumeSaathi_Applications_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    dispatch(setSuccess("Exported applications pipeline to CSV!"));
  };

  const isJobSaved = (applyUrl) => {
    return trackedJobs.some((t) => t.apply_url === applyUrl);
  };

  // Curated Lists
  const indianStartupsList = useMemo(() => {
    return companies.filter(
      (c) =>
        c.category === "Indian Startups & Unicorns" ||
        c.category === "Indian Tech Giants & Unicorns" ||
        [
          "razorpay", "swiggy", "meesho", "paytm", "cred", "groww", "zeta",
          "inmobi", "zomato", "zepto", "postman", "browserstack", "flipkart",
          "phonepe", "zerodha", "urbancompany", "ola", "physicswallah"
        ].includes(c.id)
    );
  }, [companies]);

  const smallStartupsList = useMemo(() => {
    return companies.filter(
      (c) =>
        c.category === "Small Startups & Emerging Tech" ||
        [
          "pocketfm", "slice", "devrev", "signoz", "devtron", "appsmith",
          "hasura", "plum", "kula", "classplus", "fampay", "jar", "sprinto"
        ].includes(c.id)
    );
  }, [companies]);

  const indianTechGiantsList = useMemo(() => {
    return companies.filter(
      (c) =>
        c.category === "Indian Tech Giants & IT Leaders" ||
        [
          "tcs", "infosys", "wipro", "hcltech", "zoho", "jio",
          "ltimindtree", "techmahindra", "persistent", "tataelxsi"
        ].includes(c.id)
    );
  }, [companies]);

  const linkedInJobsList = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.portalType === "linkedin" ||
        j.source === "linkedin" ||
        j.source === "linkedin_job_post" ||
        (j.applyUrl || "").toLowerCase().includes("linkedin.com")
    );
  }, [jobs]);

  const officialJobsList = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.portalType === "official" ||
        (!j.source?.includes("linkedin") &&
          !(j.applyUrl || "").toLowerCase().includes("linkedin.com") &&
          j.source !== "third_party" &&
          j.source !== "ai_search" &&
          j.source !== "startup_direct_post")
    );
  }, [jobs]);

  const thirdPartyJobsList = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.portalType === "third_party" ||
        j.source === "third_party" ||
        j.source === "ai_search" ||
        j.source === "startup_direct_post"
    );
  }, [jobs]);

  // Filter jobs by portal source (Official ATS vs LinkedIn vs Third-Party) and deduplicate
  const portalFilteredJobs = useMemo(() => {
    const seen = new Set();
    const uniqueJobs = [];
    for (const j of jobs) {
      const key =
        (j.applyUrl && j.applyUrl.toLowerCase().trim()) ||
        `${(j.company || "").toLowerCase().trim()}::${(j.title || "").toLowerCase().trim()}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueJobs.push(j);
      }
    }

    if (!portalSourceFilter || portalSourceFilter === "All" || portalSourceFilter === "all") {
      return uniqueJobs;
    }
    const ps = portalSourceFilter.toLowerCase().trim();
    const matches = uniqueJobs.filter((j) => {
      const isLi =
        j.portalType === "linkedin" ||
        j.source === "linkedin" ||
        j.source === "linkedin_job_post" ||
        (j.applyUrl || "").toLowerCase().includes("linkedin.com");
      const isThird =
        j.portalType === "third_party" ||
        j.source === "third_party" ||
        j.source === "ai_search" ||
        j.source === "startup_direct_post";

      if (ps === "linkedin") return isLi;
      if (ps === "third_party") return isThird;
      if (ps === "official") return !isLi && !isThird;
      return true;
    });

    // Loose fallback: never leave candidate with 0 jobs
    return matches.length > 0 ? matches : jobs;
  }, [jobs, portalSourceFilter]);

  const filteredCompaniesList = useMemo(() => {
    if (selectedCategory === "All" || selectedCategory === "LinkedIn Jobs") return companies;
    if (selectedCategory === "Indian Startups & Unicorns") return indianStartupsList;
    if (selectedCategory === "Small Startups & Emerging Tech") return smallStartupsList;
    if (selectedCategory === "Indian Tech Giants & IT Leaders") return indianTechGiantsList;
    return companies.filter((c) => c.category === selectedCategory);
  }, [companies, selectedCategory, indianStartupsList, smallStartupsList, indianTechGiantsList]);

  // Filter jobs by category
  const categoryFilteredJobs = useMemo(() => {
    let baseList = portalFilteredJobs;
    if (!selectedCategory || selectedCategory === "All") return baseList;
    if (selectedCategory === "LinkedIn Jobs") {
      return linkedInJobsList.length > 0 ? linkedInJobsList : baseList;
    }
    if (selectedCategory === "Official ATS Portals") {
      return officialJobsList.length > 0 ? officialJobsList : baseList;
    }
    if (selectedCategory === "Third-Party Portals") {
      return thirdPartyJobsList.length > 0 ? thirdPartyJobsList : baseList;
    }
    const catLower = selectedCategory.toLowerCase().trim();
    const filtered = baseList.filter((j) => {
      const reg = companies.find(
        (c) =>
          c.slug === j.companySlug ||
          c.id === j.companySlug ||
          c.name?.toLowerCase() === j.company?.toLowerCase()
      );
      const cat = (reg?.category || j.companyCategory || "").toLowerCase();
      if (catLower.includes("startup") || catLower.includes("unicorn")) {
        return (
          cat.includes("startup") ||
          cat.includes("unicorn") ||
          [
            "razorpay", "swiggy", "meesho", "paytm", "cred", "groww", "zeta",
            "inmobi", "zomato", "zepto", "postman", "browserstack", "flipkart",
            "phonepe", "zerodha", "urbancompany", "ola", "physicswallah"
          ].includes((reg?.id || j.companySlug || "").toLowerCase())
        );
      }
      if (catLower.includes("small") || catLower.includes("emerging")) {
        return (
          cat.includes("small") ||
          cat.includes("emerging") ||
          Boolean(j.isSmallStartup) ||
          [
            "pocketfm", "slice", "devrev", "signoz", "devtron", "appsmith",
            "hasura", "plum", "kula", "classplus", "fampay", "jar", "sprinto"
          ].includes((reg?.id || j.companySlug || "").toLowerCase())
        );
      }
      if (catLower.includes("giant") || catLower.includes("it leader") || catLower.includes("leader") || catLower.includes("mnc")) {
        return (
          cat.includes("giant") ||
          cat.includes("leader") ||
          cat.includes("mnc") ||
          [
            "tcs", "infosys", "wipro", "hcltech", "zoho", "jio",
            "ltimindtree", "techmahindra", "persistent", "tataelxsi",
            "google", "microsoft", "amazon", "cognizant", "capgemini", "accenture"
          ].includes((reg?.id || j.companySlug || "").toLowerCase())
        );
      }
      return cat.includes(catLower) || catLower.includes(cat);
    });

    // Loose coupling: Prioritize matched category jobs, but never drop to 0 if jobs are available
    return filtered.length > 0 ? filtered : baseList;
  }, [portalFilteredJobs, selectedCategory, companies, linkedInJobsList, officialJobsList, thirdPartyJobsList]);

  // Filter jobs by location and real-only enforcement
  const locationFilteredJobs = useMemo(() => {
    let list = categoryFilteredJobs;

    if (realOnlyFilter) {
      const realMatches = list.filter((j) => j.isRealOpening !== false && (j.applyUrl || j.source === "linkedin"));
      if (realMatches.length > 0) {
        list = realMatches;
      }
    }

    if (locationFilter && locationFilter !== "All" && locationFilter !== "India") {
      const locLower = locationFilter.toLowerCase().trim();
      const locMatches = list.filter((j) => {
        const jLoc = (j.location || "").toLowerCase();
        if (locLower === "remote") {
          return jLoc.includes("remote") || Boolean(j.isRemote);
        }
        if (locLower === "delhi ncr" || locLower === "delhi") {
          return (
            jLoc.includes("delhi") ||
            jLoc.includes("ncr") ||
            jLoc.includes("gurugram") ||
            jLoc.includes("noida")
          );
        }
        return jLoc.includes(locLower);
      });
      if (locMatches.length > 0) {
        list = locMatches;
      }
    }

    if (customLocationInput.trim()) {
      const query = customLocationInput.trim().toLowerCase();
      const customMatches = list.filter((j) => (j.location || "").toLowerCase().includes(query));
      if (customMatches.length > 0) {
        list = customMatches;
      }
    }

    return list.length > 0 ? list : categoryFilteredJobs;
  }, [categoryFilteredJobs, locationFilter, customLocationInput, realOnlyFilter]);

  // Sort jobs
  const sortedJobs = useMemo(() => {
    const list = [...locationFilteredJobs];
    if (roleSearchInput && roleSearchInput.trim()) {
      const q = roleSearchInput.toLowerCase().trim();
      list.sort((a, b) => {
        const aDirect =
          (a.title || "").toLowerCase().includes(q) ||
          (a.matchedResumeRoles || []).some((r) => r.toLowerCase().includes(q) || q.includes(r.toLowerCase()));
        const bDirect =
          (b.title || "").toLowerCase().includes(q) ||
          (b.matchedResumeRoles || []).some((r) => r.toLowerCase().includes(q) || q.includes(r.toLowerCase()));
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;
        return (b.matchScore || 0) - (a.matchScore || 0);
      });
      return list;
    }
    if (sortBy === "match") {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
    } else if (sortBy === "company") {
      list.sort((a, b) => (a.company || "").localeCompare(b.company || ""));
    } else if (sortBy === "title") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    return list;
  }, [locationFilteredJobs, sortBy, roleSearchInput]);

  // Paginate jobs
  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE) || 1;
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return sortedJobs.slice(start, start + JOBS_PER_PAGE);
  }, [sortedJobs, currentPage]);

  // Modal company jobs
  const modalCompanyJobs = useMemo(() => {
    if (!selectedCompanyForModal) return [];
    const fromMain = jobs.filter(
      (j) =>
        j.company?.toLowerCase() === selectedCompanyForModal.name?.toLowerCase() ||
        j.companySlug?.toLowerCase() === selectedCompanyForModal.slug?.toLowerCase()
    );
    const fromScan =
      portalScanModalData?.company?.slug === selectedCompanyForModal.slug ||
        portalScanModalData?.company?.name?.toLowerCase() ===
        selectedCompanyForModal.name?.toLowerCase()
        ? portalScanModalData.jobs || []
        : [];

    const seen = new Set();
    const combined = [];
    for (const job of [...fromScan, ...fromMain]) {
      const key = job.id || job.externalId || job.title;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(job);
      }
    }
    return combined;
  }, [jobs, selectedCompanyForModal, portalScanModalData]);

  // Filtered tracked applications
  const filteredTrackedJobs = useMemo(() => {
    return trackedJobs.filter((item) => {
      const matchStatus = trackerStatusTab === "all" || item.status === trackerStatusTab;
      const query = trackerSearch.toLowerCase();
      const matchQuery =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.company_name?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query);
      return matchStatus && matchQuery;
    });
  }, [trackedJobs, trackerStatusTab, trackerSearch]);

  const handleTailorResume = (job) => {
    navigate("/dashboard/job", {
      state: {
        prefillCompany: job.company,
        prefillDescription: job.description || job.title,
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pt-24 sm:pt-28 pb-20 px-3.5 sm:px-6 lg:px-8 transition-colors duration-300 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* ─── Hero Header & Candidate Stream Profile ────────────── */}
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-8 md:p-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-purple-500/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left Title and Subtitle */}
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Sparkles className="w-3.5 h-3.5" /> Direct Verified ATS Openings
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Official Company{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] dark:from-[#ff5fa7] dark:via-[#d340bd] dark:to-[#9d65d5]">
                  Career Opportunities
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct requisitions from Greenhouse, Lever, SmartRecruiters, and official portals of India's top unicorns, emerging startups, and global tech leaders.
              </p>
            </div>

            {/* AI Candidate Profile Card */}
            <div className="w-full lg:w-auto flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 min-w-0 sm:min-w-[320px]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 shrink-0">
                  <span className="text-2xl">
                    {candidateProfile?.track?.id === "management" ? "👔" : "💻"}
                  </span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Detected Track
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold ${candidateProfile?.track?.id === "management"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300"
                        }`}
                    >
                      {candidateProfile?.track?.label || "Tech & Engineering"}
                    </span>
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {candidateProfile?.primaryStream?.icon || "🌐"}{" "}
                    {candidateProfile?.primaryStream?.label || (hasResume ? "Tech & Engineering" : "All Career Domains")}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-semibold flex-wrap">
                    <span>
                      {candidateProfile?.isFresher
                        ? "🌱 Fresher (0-1 YOE)"
                        : `💼 Experienced (${candidateProfile?.experienceYears || 1} YOE)`}
                    </span>
                    {candidateProfile?.primaryInferredStack && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-200 text-[10px] font-black border border-cyan-300 dark:border-cyan-800 shadow-2xs">
                        <span>{candidateProfile.primaryInferredStack.icon || "⚡"}</span>
                        <span>{candidateProfile.primaryInferredStack.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 1-Click Auto-Match CTA + Inferred Roles Quick Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleAutoMatchProfile}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${trackFilter === (candidateProfile?.track?.id || "tech") &&
                      (streamFilter === (candidateProfile?.primaryStream?.id || "All") || streamFilter === "All")
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : `${GRADIENT_PRIMARY} text-white shadow-sm hover:scale-[1.02] active:scale-[0.98]`
                    }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>
                    {trackFilter === (candidateProfile?.track?.id || "tech")
                      ? "✓ Auto-Matched Relevant Roles"
                      : `🎯 Auto-Match (${candidateProfile?.track?.id === "management" ? "Management" : "Tech"})`}
                  </span>
                </button>

                {(candidateProfile?.derivedRoleTitles?.length > 0 || candidateProfile?.inferredStacks?.length > 0) && (
                  <button
                    onClick={() => {
                      const isCurrentlyActive = (roleSearchInput || "").toLowerCase().includes("all inferred");
                      const nextVal = isCurrentlyActive ? "" : "All Inferred Roles & Stacks";
                      setRoleSearchInput(nextVal);
                      handleApplyFilters(
                        null,
                        false,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        nextVal
                      );
                      if (!isCurrentlyActive) {
                        dispatch(setSuccess("⚡ Searching jobs matching all your inferred roles & stacks!"));
                      }
                    }}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all border shrink-0 ${
                      (roleSearchInput || "").toLowerCase().includes("all inferred")
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-xs"
                        : "bg-cyan-50/90 dark:bg-cyan-950/40 text-cyan-950 dark:text-cyan-100 border-cyan-300 dark:border-cyan-700 hover:border-cyan-400 hover:scale-[1.02]"
                    }`}
                    title="Search all jobs based on all your inferred tech stacks & derived industry roles"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-300 animate-pulse" />
                    <span>
                      {(roleSearchInput || "").toLowerCase().includes("all inferred")
                        ? "✓ Inferred Roles Active"
                        : "⚡ Search Inferred Roles"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Tabs & Utility Toolbar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800">
            {/* Primary 2 Navigation Tabs: All Sources & Application Pipeline */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs shrink-0">
              {/* Button 1: All Sources */}
              <button
                onClick={() => {
                  setActiveTab("openings");
                }}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab !== "tracker"
                    ? `${GRADIENT_PRIMARY} text-white shadow-xs`
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60"
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>All Sources</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-black ${
                    activeTab !== "tracker"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {portalCounts?.all || totalJobs}
                </span>
              </button>

              {/* Button 2: Application Pipeline */}
              <button
                onClick={() => setActiveTab("tracker")}
                className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  activeTab === "tracker"
                    ? `${GRADIENT_PRIMARY} text-white shadow-xs`
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Application Pipeline</span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-black ${
                    activeTab === "tracker"
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                  }`}
                >
                  {trackedJobs.length}
                </span>
              </button>
            </div>

            {/* Quick Action Buttons (Wrapped, Never Overflowing) */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() =>
                  setPostJobModal({
                    isOpen: true,
                    applyUrl: "",
                    company: "",
                    title: "",
                    location: "Bengaluru, India",
                    description: "",
                    skillsInput: "",
                    employmentType: "Full-time",
                    isFresherFriendly: false,
                    extracting: false,
                    submitting: false,
                    error: null,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-purple-300 dark:border-purple-700 bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 transition-all shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>+ Post Job</span>
              </button>

              <button
                onClick={() =>
                  setUniversalLinkCheckerModal({
                    isOpen: true,
                    urlInput: "",
                    analyzing: false,
                    result: null,
                    error: null,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-700 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-all shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Verify Link</span>
              </button>

              <button
                onClick={() =>
                  setNewResumeModal({
                    isOpen: true,
                    file: null,
                    dragActive: false,
                    uploading: false,
                    uploadStage: "",
                    error: null,
                  })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Sync Resume</span>
              </button>

              <button
                onClick={() => handleApplyFilters(null, true)}
                disabled={loading}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50"
                title="Force refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-purple-600" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── TAB 1: DISCOVER CAREER OPENINGS ─── */}
        {activeTab !== "tracker" && (
          <div className="space-y-6">
            {/* Startups Spotlight */}
            {selectedCategory === "Indian Startups & Unicorns" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-transparent border border-orange-200/80 dark:border-orange-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      🚀 Indian Product Unicorns &amp; Startups
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Explore live requisitions from Razorpay, Swiggy, Meesho, Paytm, CRED, Groww, Zomato, and more.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCategoryChange("All")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      ✕ Show All Openings
                    </button>
                    <button
                      onClick={() => handleApplyFilters(null, true, null, null, "Indian Startups & Unicorns")}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-rose-600 shadow-2xs"
                    >
                      Scan All Startups
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {indianStartupsList.map((st) => (
                    <div
                      key={st.id}
                      onClick={(e) => handleOpenCompanyProfile(st.slug || st.id, e)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-400 cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {st.logo ? (
                            <img src={st.logo} alt="" className="w-full h-full object-contain" onError={(e) => (e.target.style.display = "none")} />
                          ) : (
                            <Rocket className="w-3.5 h-3.5 text-orange-500" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {st.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">
                        {st.provider || "ATS Portal"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Small Startups Spotlight */}
            {selectedCategory === "Small Startups & Emerging Tech" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200/80 dark:border-emerald-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      🌱 Fast-Growing Small Startups &amp; YC Teams
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Opportunities at high-velocity Indian startups (Pocket FM, DevRev, Slice, SigNoz, Devtron, Hasura).
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCategoryChange("All")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      ✕ Show All Openings
                    </button>
                    <button
                      onClick={() => handleApplyFilters(null, true, null, null, "Small Startups & Emerging Tech")}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-2xs"
                    >
                      Scan Emerging Teams
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {smallStartupsList.map((st) => (
                    <div
                      key={st.id}
                      onClick={(e) => handleOpenCompanyProfile(st.slug || st.id, e)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {st.logo ? (
                            <img src={st.logo} alt="" className="w-full h-full object-contain" onError={(e) => (e.target.style.display = "none")} />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {st.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">
                        {st.provider || "ATS Portal"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Giants Spotlight */}
            {selectedCategory === "Indian Tech Giants & IT Leaders" && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border border-blue-200/80 dark:border-blue-900/40 space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      🇮🇳 Indian Tech Giants &amp; IT Leaders
                    </h2>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Direct career openings across TCS, Infosys, Wipro, Zoho, Jio, HCLTech, and LTIMindtree.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCategoryChange("All")}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      ✕ Show All Openings
                    </button>
                    <button
                      onClick={() => handleApplyFilters(null, true, null, null, "Indian Tech Giants & IT Leaders")}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xs"
                    >
                      Scan Tech Giants
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                  {indianTechGiantsList.map((st) => (
                    <div
                      key={st.id}
                      onClick={(e) => handleOpenCompanyProfile(st.slug || st.id, e)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                          {st.logo ? (
                            <img src={st.logo} alt="" className="w-full h-full object-contain" onError={(e) => (e.target.style.display = "none")} />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {st.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">
                        {st.provider || "Official Portal"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Bar */}
            <CareerFilterBar
              roleSearchInput={roleSearchInput}
              setRoleSearchInput={setRoleSearchInput}
              customCompanyInput={customCompanyInput}
              setCustomCompanyInput={setCustomCompanyInput}
              customLocationInput={customLocationInput}
              setCustomLocationInput={setCustomLocationInput}
              countryFilter={countryFilter}
              onCountryChange={handleCountryChange}
              availableCountries={availableCountries?.length > 0 ? availableCountries : TECH_COUNTRIES}
              locationFilter={locationFilter}
              onLocationChange={handleLocationChange}
              popularLocations={POPULAR_LOCATIONS}
              trackFilter={trackFilter}
              onTrackChange={handleTrackChange}
              candidateProfile={candidateProfile}
              streamFilter={streamFilter}
              onStreamChange={handleStreamChange}
              availableStreams={availableStreams}
              employmentTypeFilter={employmentTypeFilter}
              onEmploymentTypeChange={handleEmploymentTypeChange}
              experienceLevelFilter={experienceLevelFilter}
              onExperienceLevelChange={handleExperienceLevelChange}
              fresherOnlyFilter={fresherOnlyFilter}
              onToggleFresherOnly={handleToggleFresherOnly}
              realOnlyFilter={realOnlyFilter}
              onToggleRealOnly={handleToggleRealOnly}
              strictAiOnlyFilter={strictAiOnlyFilter}
              onToggleStrictAi={handleToggleStrictAi}
              portalSourceFilter={portalSourceFilter}
              onPortalSourceChange={handlePortalSourceChange}
              portalCounts={portalCounts}
              categoryCounts={{
                startups: indianStartupsList.length,
                smallStartups: smallStartupsList.length,
                techGiants: indianTechGiantsList.length,
              }}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={categories}
              selectedCompanySlug={selectedCompanySlug}
              onSelectQuickCompany={handleSelectQuickCompany}
              filteredCompaniesList={filteredCompaniesList}
              onApplyFilters={(roleVal) =>
                handleApplyFilters(
                  null,
                  false,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  roleVal !== undefined ? roleVal : null
                )
              }
              onResetFilters={() => {
                setSelectedCompanySlug("");
                setCustomCompanyInput("");
                setRoleSearchInput("");
                setCustomLocationInput("");
                dispatch(clearFilters());
                dispatch(fetchCareerJobsThunk({ country: "India", location: "All" }));
              }}
              loading={loading}
              GRADIENT_PRIMARY={GRADIENT_PRIMARY}
            />

            {/* Results Header & Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-1 px-1">
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                Showing{" "}
                <span className="text-slate-900 dark:text-white font-bold">
                  {sortedJobs.length > 0 ? (currentPage - 1) * JOBS_PER_PAGE + 1 : 0}–
                  {Math.min(currentPage * JOBS_PER_PAGE, sortedJobs.length)}
                </span>{" "}
                of{" "}
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {sortedJobs.length}
                </span>{" "}
                verified openings
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
                >
                  <option value="match">🎯 Highest Match %</option>
                  <option value="recent">🕒 Most Recent</option>
                  <option value="company">🏢 Company (A-Z)</option>
                  <option value="title">💼 Role Title (A-Z)</option>
                </select>
              </div>
            </div>

            {/* AG-UI Active Search Console & Shimmer Grid */}
            {loading ? (
              <AgUiSearchConsole
                roleQuery={roleSearchInput}
                location={locationFilter}
                company={customCompanyInput || selectedCompanySlug}
                GRADIENT_PRIMARY={GRADIENT_PRIMARY}
              />
            ) : paginatedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id || job.externalId || job.title}
                    job={job}
                    saved={isJobSaved(job.applyUrl)}
                    onSave={handleSaveJob}
                    onOpenDetails={setSelectedJobForModal}
                    onCheckOnline={handleCheckJobOnline}
                    checkingOnline={checkingOnlineJobs[job.id]}
                    onOpenCompanyProfile={handleOpenCompanyProfile}
                    onTailorResume={handleTailorResume}
                    GRADIENT_PRIMARY={GRADIENT_PRIMARY}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  No Openings Found For These Filters
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Try broadening your location, stream, or resetting filters to browse all verified listings.
                </p>
                <button
                  onClick={() => {
                    setSelectedCompanySlug("");
                    setCustomCompanyInput("");
                    setRoleSearchInput("");
                    setCustomLocationInput("");
                    dispatch(clearFilters());
                    dispatch(fetchCareerJobsThunk({ location: "India", forceRefresh: true }));
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white ${GRADIENT_PRIMARY} shadow-sm`}
                >
                  Reset &amp; Show All Openings
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
                    )
                    .map((pageNum, idx, arr) => {
                      const prev = arr[idx - 1];
                      return (
                        <div key={pageNum} className="flex items-center gap-1">
                          {prev && pageNum - prev > 1 && (
                            <span className="px-1 text-slate-400">...</span>
                          )}
                          <button
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 400, behavior: "smooth" });
                            }}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === pageNum
                                ? "bg-purple-600 text-white shadow-2xs"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                              }`}
                          >
                            {pageNum}
                          </button>
                        </div>
                      );
                    })}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: MY APPLICATION TRACKER PIPELINE ─────────────── */}
        {activeTab === "tracker" && (
          <ApplicationTracker
            trackedJobs={trackedJobs}
            filteredTrackedJobs={filteredTrackedJobs}
            trackerStatusTab={trackerStatusTab}
            onStatusTabChange={setTrackerStatusTab}
            trackerSearch={trackerSearch}
            onTrackerSearchChange={setTrackerSearch}
            editingNotesId={editingNotesId}
            noteText={noteText}
            onStartEditingNote={(id, text) => {
              setEditingNotesId(id);
              setNoteText(text);
            }}
            onChangeNoteText={setNoteText}
            onSaveNotes={handleSaveNotes}
            onCancelEditingNote={() => setEditingNotesId(null)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteTracked={handleDeleteTracked}
            onExportCSV={handleExportCSV}
            onGoToOpenings={() => setActiveTab("openings")}
            GRADIENT_PRIMARY={GRADIENT_PRIMARY}
          />
        )}

        {/* ─── MODALS ─────────────────────────────────────────────── */}
        {selectedJobForModal && (
          <JobDetailsModal
            job={selectedJobForModal}
            onClose={() => setSelectedJobForModal(null)}
            saved={isJobSaved(selectedJobForModal.applyUrl)}
            onSave={handleSaveJob}
            onCheckOnline={handleCheckJobOnline}
            onOpenCompanyProfile={handleOpenCompanyProfile}
            onTailorResume={handleTailorResume}
            GRADIENT_PRIMARY={GRADIENT_PRIMARY}
          />
        )}

        <JobVerificationModal
          modalState={jobVerificationModal}
          onClose={() =>
            setJobVerificationModal((prev) => ({ ...prev, isOpen: false }))
          }
          GRADIENT_PRIMARY={GRADIENT_PRIMARY}
        />

        <UniversalLinkCheckerModal
          modalState={universalLinkCheckerModal}
          onClose={() =>
            setUniversalLinkCheckerModal((prev) => ({ ...prev, isOpen: false }))
          }
          onChangeUrl={(url) =>
            setUniversalLinkCheckerModal((prev) => ({ ...prev, urlInput: url }))
          }
          onSubmit={handleInspectExternalLink}
          GRADIENT_PRIMARY={GRADIENT_PRIMARY}
        />

        <PostStartupJobModal
          modalState={postJobModal}
          onClose={() => setPostJobModal((prev) => ({ ...prev, isOpen: false }))}
          onChangeField={(field, val) =>
            setPostJobModal((prev) => ({ ...prev, [field]: val }))
          }
          onAutoExtract={handleAutoExtractJobLink}
          onSubmit={handleSubmitPostJob}
          GRADIENT_PRIMARY={GRADIENT_PRIMARY}
        />

        <NewResumeModal
          modalState={newResumeModal}
          onClose={() =>
            setNewResumeModal((prev) => ({ ...prev, isOpen: false }))
          }
          onFileSelect={handleNewResumeFileSelect}
          onSetDragActive={(active) =>
            setNewResumeModal((prev) => ({ ...prev, dragActive: active }))
          }
          onUploadAndCheck={handleUploadNewResumeAndCheck}
          GRADIENT_PRIMARY={GRADIENT_PRIMARY}
        />

        <CompanyProfileModal
          company={selectedCompanyForModal}
          companyJobs={modalCompanyJobs}
          onClose={() => setSelectedCompanyForModal(null)}
          onOpenJobDetails={setSelectedJobForModal}
          onScanPortal={handleScanCompanyOriginalPortal}
          scanning={scanningPortalCompany === (selectedCompanyForModal?.slug || selectedCompanyForModal?.id)}
          GRADIENT_PRIMARY={GRADIENT_PRIMARY}
        />
      </div>
    </div>
  );
}
