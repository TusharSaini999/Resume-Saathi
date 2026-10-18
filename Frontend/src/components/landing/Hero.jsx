import { ArrowRight, Sparkles, Briefcase } from "lucide-react";
import { BUTTON_CLASS } from "../../constants/style";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const Hero = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  return (
    <section
      id="overview"
      className="scroll-mt-28 relative overflow-hidden bg-white dark:bg-[#111827] mt-4 sm:mt-2 md:mt-0"
    >
      {/* Gradient Background Glow */}
      <div className="absolute inset-0 opacity-20 blur-3xl">
        <div className="absolute top-20 left-10 md:left-20 w-60 md:w-72 h-60 md:h-72 bg-[#FE3E91] rounded-full"></div>
        <div className="absolute bottom-20 right-10 md:right-20 w-60 md:w-72 h-60 md:h-72 bg-[#803AD1] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24 lg:flex lg:items-center lg:justify-between gap-12">

        {/* Left Content */}
        <div className="max-w-2xl">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full
            bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] dark:text-white"
          >
            <Sparkles className="w-4 h-4 text-[#FE3E91]" />
            Your Personal AI Career Coach &amp; Live Job Finder
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#1E293B] dark:text-white">
            Transform Your Resume into an
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}Interview Magnet{" "}
            </span>
            <span className="text-[#803AD1] dark:text-[#FF5FA7]">
              Instantly
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base md:text-lg text-[#475569] dark:text-[#94A3B8]">
            Supercharge your job search with Resume Saathi. Our AI deeply analyzes your resume against target job descriptions, discovers live verified openings directly from official ATS boards (Greenhouse, Lever, SmartRecruiters, LinkedIn), and matches you by inferred tech stacks and industry roles.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              to={isLoggedIn ? "/dashboard" : "/auth/login"}
              className={`flex items-center gap-2 ${BUTTON_CLASS}`}
              style={{ boxShadow: "0 10px 25px rgba(254,62,145,0.25)" }}
            >
              <span>Analyze Resume</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to={isLoggedIn ? "/dashboard/careers" : "/auth/login"}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 rounded-xl transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Briefcase size={18} className="text-[#FE3E91]" />
              <span>Explore Live Openings</span>
              <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {isLoggedIn ? "Live ATS" : "Sign In to Access"}
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 text-sm text-[#64748B] dark:text-[#94A3B8]">
            <div>
              <p className="text-2xl font-bold text-[#FE3E91]">Deep</p>
              Formatting Analysis
            </div>

            <div>
              <p className="text-2xl font-bold text-[#803AD1]">100%</p>
              Data Privacy &amp; Security
            </div>

            <div>
              <p className="text-2xl font-bold text-[#CA25AF]">Context-Aware</p>
              Realtime AI Chat
            </div>

            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Live ATS</p>
              Direct Portal Job Sync
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="mt-12 lg:mt-0 flex justify-center lg:justify-end w-full">
          <div
            className="relative p-4 rounded-2xl bg-[#F9FAFB] dark:bg-[#1F2937]
            border border-[#E5E7EB] dark:border-[#374151]
            shadow-xl w-full max-w-lg"
          >
            <img
              src="https://res.cloudinary.com/cloud451752/image/upload/v1775133213/1_r5prct.webp"
              alt="Resume Saathi ATS analysis preview"
              className="rounded-xl w-full h-auto object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;