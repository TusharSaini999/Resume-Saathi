import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Sparkles } from "lucide-react";
import { submitJD } from "../context/Thunk/CheckJD";
import JobHistoryPanel from "../components/dashboard/jobDescription/JobHistoryPanel";
import JobAnalysisForm from "../components/dashboard/jobDescription/JobAnalysisForm";
import JobAnalysisView from "../components/dashboard/jobDescription/JobAnalysisView";
import NoResumeNotice from "../components/dashboard/jobDescription/NoResumeNotice";
import JobAnalysisLoading from "../components/dashboard/jobDescription/JobAnalysisLoading";

function JobDescription() {
  const dispatch = useDispatch();
  const location = useLocation();

  const history = useSelector((state) => state.jobDec.jobDec);
  const loading = useSelector((state) => state.jobDec.loading);
  const loadingStage = useSelector((state) => state.jobDec.loadingStage);
  const error = useSelector((state) => state.jobDec.error);
  const user = useSelector((state) => state.auth.user);
  const resumeContext = useSelector((state) => state.resume.resume);

  const [selectedId, setSelectedId] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(
    Boolean(location.state?.prefillCompany || location.state?.prefillDescription)
  );
  const [hasSubmittedNew, setHasSubmittedNew] = useState(false);
  const [companyName, setCompanyName] = useState(location.state?.prefillCompany || "");
  const [description, setDescription] = useState(location.state?.prefillDescription || "");
  const [formError, setFormError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedHistory = useMemo(
    () =>
      [...(history || [])].sort((a, b) => {
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
      setTimeout(() => setSelectedId(null), 0);
      return;
    }

    if (isCreatingNew) {
      return;
    }

    const selectedStillExists = visibleHistory.some((item) => item?._id === selectedId);
    if (!selectedId || !selectedStillExists) {
      setTimeout(() => setSelectedId(visibleHistory[0]?._id || null), 0);
    }
  }, [visibleHistory, selectedId, isCreatingNew]);

  useEffect(() => {
    if (!hasSubmittedNew || !isCreatingNew || loading || error || !sortedHistory.length) {
      return;
    }

    setTimeout(() => {
      setSelectedId(sortedHistory[0]?._id || null);
      setIsCreatingNew(false);
      setHasSubmittedNew(false);
    }, 0);
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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#141415] px-4 pb-12 pt-20">
      <div className="mx-auto w-full max-w-7xl">
        {hasResumeContext && (
          <div className="mb-6 rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-[#19191b] md:p-6">
            <p className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-mono font-medium text-[#fe3e91] dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe3e91]"></span>
              Job Description Diagnostic
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Compare job description with your resume
            </h1>
            <p className="mt-1 max-w-3xl text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Select any previous JD from history or submit a new listing to audit match score, missing skills, and experience alignment.
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