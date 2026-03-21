import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ResumeUpload from "../components/dashboard/ResumeUpload";
import ResumeAnalysis from "../components/dashboard/ResumeAnalysis";
import AnalysisError from "../components/dashboard/AnalysisError";

const Resume = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const user = useSelector((state) => state.auth.user);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.resume_id || !Array.isArray(user?.resumeResp) || user.resumeResp.length === 0) {
      return;
    }

    const matchedResumeAnalysis =
      user.resumeResp.find((item) => item.resume_id === user.resume_id) || user.resumeResp[0];

    if (matchedResumeAnalysis) {
      setAnalysisData((previous) => previous || matchedResumeAnalysis);
      setError(null);
    }
  }, [user]);

  const handleResumeUpload = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      // Call your API endpoint here
      const response = await fetch("/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
      setAnalysisData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReupload = () => {
    setAnalysisData(null);
    setError(null);
  };

  const currentView = analysisData ? "analysis" : error ? "error" : "upload";

  return (
    <div
      className={`min-h-screen pt-24 pb-12 px-4 ${
        isDark
          ? "bg-linear-to-br from-[#111827] to-[#0f172a]"
          : "bg-linear-to-br from-[#f8fafc] to-[#f1f5f9]"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${
              isDark ? "text-white" : "text-[#1E293B]"
            }`}
          >
            Resume
            <span className="bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p
            className={`text-lg ${
              isDark ? "text-[#cbd5e1]" : "text-[#64748b]"
            }`}
          >
            Upload your resume to get instant ATS analysis and personalized recommendations
          </p>
        </div>

        <section>
          <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#fe3e91] border-[#fe3e91]/40 bg-[#fe3e91]/10">
            {currentView === "upload" ? "Step 1" : "Step 2"}
            <span className={isDark ? "text-[#cbd5e1]" : "text-[#475569]"}>
              {currentView === "upload" ? "Upload Resume" : "Review Analysis"}
            </span>
          </div>

          {currentView === "upload" && (
            <ResumeUpload
              onUpload={handleResumeUpload}
              loading={loading}
              hasAnalysis={false}
            />
          )}

          {currentView === "analysis" && (
            <ResumeAnalysis
              data={analysisData}
              onReupload={handleReupload}
              loading={loading}
            />
          )}

          {currentView === "error" && (
            <AnalysisError
              error={error}
              onReupload={handleReupload}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Resume;
