import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sparkles } from "lucide-react";
import { submitJD } from "../context/Thunk/CheckJD";
import JobHistoryPanel from "../components/dashboard/jobDescription/JobHistoryPanel";
import JobAnalysisForm from "../components/dashboard/jobDescription/JobAnalysisForm";
import JobAnalysisView from "../components/dashboard/jobDescription/JobAnalysisView";
import NoResumeNotice from "../components/dashboard/jobDescription/NoResumeNotice";
import JobAnalysisLoading from "../components/dashboard/jobDescription/JobAnalysisLoading";

function JobDescription() {
  const dispatch = useDispatch();

  const history = useSelector((state) => state.jobDec.jobDec) || [];
  const loading = useSelector((state) => state.jobDec.loading);
  const loadingStage = useSelector((state) => state.jobDec.loadingStage);
  const error = useSelector((state) => state.jobDec.error);
  const user = useSelector((state) => state.auth.user);
  const resumeContext = useSelector((state) => state.resume.resume);

  const [selectedId, setSelectedId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [hasSubmittedNew, setHasSubmittedNew] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedHistory = useMemo(
    () =>
      [...history].sort((a, b) => {
        const aTime = new Date(a?.createdAt || 0).getTime();
        const bTime = new Date(b?.createdAt || 0).getTime();
        return bTime - aTime;
      }),
    [history],
  );

  const trimmedSearchQuery = searchQuery.trim();
  const isSearchMode = trimmedSearchQuery.length > 0;

  const visibleHistory = useMemo(() => {
    if (!isSearchMode) {
      return sortedHistory;
    }

    const query = trimmedSearchQuery.toLowerCase();
    return sortedHistory.filter((item) => {
      const title = (item?.title || "").toLowerCase();
      const company = (item?.company_name || "").toLowerCase();
      return title.includes(query) || company.includes(query);
    });
  }, [isSearchMode, sortedHistory, trimmedSearchQuery]);

  const hasResumeContext = useMemo(() => {
    const hasResumeId = Boolean(user?.resume_id);
    const hasContextArray = Array.isArray(resumeContext) && resumeContext.length > 0;
    const hasContextObject =
      resumeContext && typeof resumeContext === "object" && !Array.isArray(resumeContext)
        ? Object.keys(resumeContext).length > 0
        : false;

    return hasResumeId || hasContextArray || hasContextObject;
  }, [user?.resume_id, resumeContext]);

  useEffect(() => {
    if (!visibleHistory.length) {
      setSelectedId(null);
      return;
    }

    if (isCreatingNew) {
      return;
    }

    const selectedStillExists = visibleHistory.some((item) => item?._id === selectedId);
    if (!selectedId || !selectedStillExists) {
      setSelectedId(visibleHistory[0]?._id || null);
    }
  }, [visibleHistory, selectedId, isCreatingNew]);

  useEffect(() => {
    if (!hasSubmittedNew || !isCreatingNew || loading || error || !sortedHistory.length) {
      return;
    }

    setSelectedId(sortedHistory[0]?._id || null);
    setIsCreatingNew(false);
    setHasSubmittedNew(false);
  }, [hasSubmittedNew, isCreatingNew, loading, error, sortedHistory]);

  const selectedJob = useMemo(
    () => sortedHistory.find((item) => item?._id === selectedId) || null,
    [sortedHistory, selectedId],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!hasResumeContext) {
      setFormError("First upload the resume to analyze a job description.");
      return;
    }

    const trimmedDescription = description.trim();
    const trimmedCompanyName = companyName.trim();

    if (trimmedDescription.length < 20) {
      setFormError("Job description must be at least 20 characters.");
      return;
    }

    setFormError("");
    setIsCreatingNew(true);
    setHasSubmittedNew(true);
    dispatch(
      submitJD({
        company_name: trimmedCompanyName,
        description: trimmedDescription,
      }),
    );

    setDescription("");
    setCompanyName("");
  };

  const handleSelectHistory = (id) => {
    setIsCreatingNew(false);
    setHasSubmittedNew(false);
    setSelectedId(id);
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setHasSubmittedNew(false);
    setSelectedId(null);
    setFormError("");
  };

  const loadingTitle =
    loadingStage === "processing"
      ? "Analyzing your JD"
      : loadingStage === "finalizing"
        ? "Preparing recommendations"
        : "Submitting your JD";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffe4f2_0%,#f8fafc_42%,#e2e8f0_100%)] px-4 pb-10 pt-24 dark:bg-[radial-gradient(circle_at_top_left,#26142f_0%,#111827_45%,#0b1220_100%)]">
      <div className="mx-auto w-full max-w-7xl">
        {hasResumeContext && (
          <div className="mb-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg backdrop-blur-sm dark:border-[#334155] dark:bg-[#0f172a]/80 md:p-7">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#fce7f3] px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#be185d] dark:bg-[#4a1538] dark:text-[#f9a8d4]">
              <Sparkles size={12} /> Job Description Studio
            </p>
            <h1 className="mt-3 bg-[linear-gradient(120deg,#ff5f9b_0%,#f43f5e_35%,#9f3cff_100%)] bg-clip-text text-3xl font-black tracking-[-0.02em] text-transparent md:text-4xl">
              Compare Job Description With Your Resume
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-[#475569] dark:text-[#cbd5e1] md:text-base">
              Select any previous JD from history, or submit a new one to instantly see match score, missing skills,
              experience fit, education fit, and improvement tips.
            </p>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 ${hasResumeContext ? "lg:grid-cols-[320px_1fr]" : "min-h-[calc(100vh-8rem)] place-items-center"}`}>
          {hasResumeContext && (
            <JobHistoryPanel
              history={visibleHistory}
              selectedId={selectedId}
              onSelect={handleSelectHistory}
              onNew={handleCreateNew}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isSearchMode={isSearchMode}
            />
          )}

          <section className={hasResumeContext ? "space-y-6" : "w-full max-w-4xl"}>
            {!hasResumeContext ? (
              <NoResumeNotice />
            ) : loading ? (
              <JobAnalysisLoading loadingStage={loadingStage} />
            ) : isCreatingNew || !selectedJob ? (
              <JobAnalysisForm
                onSubmit={handleSubmit}
                companyName={companyName}
                setCompanyName={setCompanyName}
                description={description}
                setDescription={setDescription}
                loading={loading}
                loadingTitle={loadingTitle}
                error={formError || error}
              />
            ) : (
              <JobAnalysisView selectedJob={selectedJob} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default JobDescription;