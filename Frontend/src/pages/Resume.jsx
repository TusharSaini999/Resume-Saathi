import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import ResumeUpload from "../components/dashboard/ResumeUpload";
import ResumeAnalysis from "../components/dashboard/ResumeAnalysis";
import AnalysisError from "../components/dashboard/AnalysisError";
import { submitResume } from "../context/Thunk/UploadResume.js";
import { setErrorClear } from "../context/authSlice.js";


const Resume = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const user = useSelector((state) => state.auth.user);
  const [analysisData, setAnalysisData] = useState(null);
  const loading = useSelector((state) => state.auth.loading || false);
  const [loadingStage, setLoadingStage] = useState("uploading");
  const error = useSelector((state) => state.auth.error || null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user?.resume_id || !Array.isArray(user?.resumeResp) || user.resumeResp.length === 0) {
      return;
    }

    const matchedResumeAnalysis =
      user.resumeResp.find((item) => item.resume_id === user.resume_id) || user.resumeResp[0];

    if (matchedResumeAnalysis) {
      setAnalysisData((previous) => previous || matchedResumeAnalysis);
    }
  }, [user]);

  const handleResumeUpload = async (file) => {
    setLoadingStage("uploading");

    const processingTimeout = setTimeout(() => {
      setLoadingStage("processing");
    }, 1000);

    const finalizingTimeout = setTimeout(() => {
      setLoadingStage("finalizing");
    }, 3000);

    const processingTimeout = setTimeout(() => {
      setLoadingStage("processing");
    }, 1000);

    const finalizingTimeout = setTimeout(() => {
      setLoadingStage("finalizing");
    }, 3000);

    const processingTimeout = setTimeout(() => {
      setLoadingStage("processing");
    }, 1000);

    const finalizingTimeout = setTimeout(() => {
      setLoadingStage("finalizing");
    }, 3000);

    try {
      const response = await dispatch(submitResume(file)).unwrap();
      if(response && response.analysis) {
        setAnalysisData(response.analysis);
      }
    } catch {
      // Error is handled by authSlice
    } finally {
      clearTimeout(processingTimeout);
      clearTimeout(finalizingTimeout);
    }
  };

  const handleReUpload = () => {
    setAnalysisData(null);
    dispatch(setErrorClear());
    setLoadingStage("uploading");
  };

  const currentView = loading ? "loading" : analysisData ? "analysis" : error ? "error" : "upload";
  const loadingTitle =
    loadingStage === "processing"
      ? "Processing your resume..."
      : loadingStage === "finalizing"
        ? "Finalizing your report..."
        : "Uploading your resume...";
  const loadingDescription =
    loadingStage === "processing"
      ? "We are analyzing sections, keywords, ATS compatibility, and formatting. Do not leave this page."
      : loadingStage === "finalizing"
        ? "Almost done. Preparing your final results for display. Do not leave this page."
        : "Your PDF is being uploaded securely. This usually takes a few seconds. Do not leave this page.";
  const loadingStepText =
    loadingStage === "processing"
      ? "Step 2 of 3: Processing"
      : loadingStage === "finalizing"
        ? "Step 3 of 3: Finalizing"
        : "Step 1 of 3: Uploading";

  return (
    <div
      className={`min-h-screen pt-24 pb-12 px-4 ${isDark
        ? "bg-linear-to-br from-[#111827] to-[#0f172a]"
        : "bg-linear-to-br from-[#f8fafc] to-[#f1f5f9]"
        }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${isDark ? "text-white" : "text-[#1E293B]"
              }`}
          >
            Resume
            <span className="bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p
            className={`text-lg ${isDark ? "text-[#cbd5e1]" : "text-[#64748b]"
              }`}
          >
            Upload your resume to get instant ATS analysis and personalized recommendations
          </p>
        </div>

        <section>
          {currentView === "loading" && (
            <div className="w-full max-w-3xl mx-auto">
              <div
                className={`relative overflow-hidden rounded-3xl border p-8 md:p-10 shadow-2xl ${isDark
                  ? "border-[#334155] bg-[#0f172a]"
                  : "border-[#e2e8f0] bg-white"
                  }`}
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#fe3e91]/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#803ad1]/10 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-r from-[#fe3e91]/20 via-[#ca25af]/20 to-[#803ad1]/20">
                    <Loader2 size={36} className="animate-spin text-[#fe3e91]" />
                  </div>

                  <h3 className={`text-2xl md:text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-[#1E293B]"}`}>
                    {loadingTitle}
                  </h3>
                  <p className={`mt-3 max-w-xl text-sm md:text-base ${isDark ? "text-[#cbd5e1]" : "text-[#64748b]"}`}>
                    {loadingDescription}
                  </p>

                  <div className={`mt-6 rounded-full px-4 py-2 text-xs font-bold ${isDark ? "bg-[#1e293b] text-[#cbd5e1]" : "bg-[#f8fafc] text-[#475569]"}`}>
                    {loadingStepText}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === "upload" && (
            <ResumeUpload
              onUpload={handleResumeUpload}
              loading={loading}
              hasAnalysis={Boolean(user?.resumeResp?.length)}
            />
          )}

          {currentView === "analysis" && (
            <ResumeAnalysis
              data={analysisData}
              onReupload={handleReUpload}
              loading={loading}
            />
          )}

          {currentView === "error" && (
            <AnalysisError
              error={error}
              onReupload={handleReUpload}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Resume;
