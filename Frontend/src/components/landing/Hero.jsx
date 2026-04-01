import { ArrowRight, Sparkles } from "lucide-react";
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
            AI Powered ATS Resume Analyzer
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#1E293B] dark:text-white">
            Improve Your
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}Resume Match Score{" "}
            </span>
            <span className="text-[#803AD1] dark:text-[#FF5FA7]">
              Before You Apply
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base md:text-lg text-[#475569] dark:text-[#94A3B8]">
            Resume Saathi helps you analyze your resume against job descriptions,
            uncover ATS issues, and get actionable AI suggestions to boost interview chances.
            Use realtime chatbot guidance and resume-based interview practice to prepare end-to-end.
          </p>

          {/* Button */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to={isLoggedIn ? "/dashboard" : "/auth/login"}
              className={`flex items-center gap-2 ${BUTTON_CLASS}`}
              style={{ boxShadow: "0 10px 25px rgba(254,62,145,0.25)" }}
            >
              Analyze Resume
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-12 text-sm text-[#64748B] dark:text-[#94A3B8]">
            <div>
              <p className="text-2xl font-bold text-[#FE3E91]">98%</p>
              User Satisfaction
            </div>

            <div>
              <p className="text-2xl font-bold text-[#803AD1]">92%</p>
              Better ATS Alignment
            </div>

            <div>
              <p className="text-2xl font-bold text-[#CA25AF]">24/7</p>
              AI Career Assistance
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
              src="/Assets/1.png"
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