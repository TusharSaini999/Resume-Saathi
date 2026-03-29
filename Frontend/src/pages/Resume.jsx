import { use, useEffect, useState } from "react";
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
      className="min-h-screen bg-linear-to-br from-[#f8fafc] to-[#f1f5f9] px-4 pb-10 pt-24 dark:from-[#111827] dark:to-[#0f172a]"
    >
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl items-center">
        {/* Header
        <div className="text-center mb-10">
          <h1
            className="mb-4 text-4xl font-black tracking-tight text-[#1E293B] md:text-5xl dark:text-white"
          >
            Resume
            <span className="bg-linear-to-r from-[#fe3e91] via-[#ca25af] to-[#803ad1] bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p
            className="text-lg text-[#64748b] dark:text-[#cbd5e1]"
          >
            Upload your resume to get instant ATS analysis and personalized recommendations
          </p>
        </div> */}

        
        <section className="w-full">


{
          loading ?
            (
              <ResumeLoading
                loadingStage={loadingStage}
              />
            ) : error ? (
              <AnalysisError
                error={error}
                onReupload={handleReUpload}
              />
            ) : analysisData ? (
              <ResumeAnalysis
                data={analysisData}
                onReupload={handleReUpload}
                loading={loading}
              />
            ) : (
              <ResumeUpload
                onUpload={handleUpload}
                loading={loading}
              />
            )
        }


        </section>
      </div>
    </div>
  );
};

export default Resume;



// {currentView === "upload" || flag && (
//             <ResumeUpload
//               onUpload={handleResumeUpload}
//               loading={loading}
//               hasAnalysis={Boolean(user?.resumeResp?.length)}
//             />
//           )}

//           {currentView === "analysis" && !flag && (
//             <ResumeAnalysis
//               data={analysisData}
//               onReupload={handleReUpload}
//               loading={loading}
//             />
//           )}

//           {currentView === "error" && (
//             <AnalysisError
//               error={error}
//               onReupload={handleReUpload}
//             />
//           )}