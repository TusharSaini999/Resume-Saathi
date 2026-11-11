import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import ResumeUpload from "../components/dashboard/ResumeUpload";
import ResumeAnalysis from "../components/dashboard/ResumeAnalysis";
import AnalysisError from "../components/dashboard/AnalysisError";
import { submitResume } from "../context/Thunk/UploadResume.js";
import { setLogout } from "../context/resumeSlice.js";
import ResumeLoading from "../components/dashboard/ResumeLoading.jsx";


const Resume = () => {
  const dispatch = useDispatch();
  const analysisData = useSelector((state) => state.resume.resume);
  const loadingStage = useSelector((state) => state.resume.loadingStage);
  const loading = useSelector((state) => state.resume.loading);
  const error = useSelector((state) => state.resume.error);

  const handleUpload = (file) => {
    dispatch(submitResume(file));
  }
  const handleReUpload = () => {
    dispatch(setLogout());
  }
  return (
    <div
      className="min-h-screen bg-[#fafafa] dark:bg-[#141415] px-4 pb-12 pt-20"
    >
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center">
        <section className="w-full">
          {loading ? (
            <ResumeLoading loadingStage={loadingStage} />
          ) : error ? (
            <AnalysisError error={error} onReupload={handleReUpload} />
          ) : analysisData ? (
            <ResumeAnalysis
              data={analysisData}
              onReupload={handleReUpload}
              loading={loading}
            />
          ) : (
            <ResumeUpload onUpload={handleUpload} loading={loading} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Resume;