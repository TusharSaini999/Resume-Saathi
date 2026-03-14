import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section id="overview" className="scroll-mt-28 relative overflow-hidden bg-white dark:bg-[#111827]">

      {/* Gradient Background Glow */}
      <div className="absolute inset-0 opacity-20 blur-3xl">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#FE3E91] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#803AD1] rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:flex lg:items-center lg:justify-between">

        {/* Left Content */}
        <div className="max-w-2xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full
          bg-[#F9FAFB] dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] dark:text-[#ffffff]">
            <Sparkles className="w-4 h-4 text-[#FE3E91]" />
            AI Powered ATS Resume Analyzer
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-[#1E293B] dark:text-white">
            Improve Your
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}Resume Match Score{" "}
            </span>
            <span className="text-[#803AD1] dark:text-[#FF5FA7]">Before You Apply</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg text-[#475569] dark:text-[#94A3B8]">
            Resume Saathi helps you analyze your resume against job descriptions,
            uncover ATS issues, and get actionable AI suggestions to boost interview chances.
            Use realtime chatbot guidance and resume-based interview practice to prepare end-to-end.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">

            {/* Primary CTA */}
            <button className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl
            bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1]
            hover:scale-105 transition shadow-lg"
            style={{boxShadow:"0 10px 25px rgba(254,62,145,0.25)"}}>
              Analyze Resume
              <ArrowRight size={18}/>
            </button>

          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12 text-sm text-[#64748B] dark:text-[#94A3B8]">
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

        {/* Right Side Image */}
        <div className="mt-16 lg:mt-0 lg:ml-12">

          <div className="relative p-4 rounded-2xl bg-[#F9FAFB] dark:bg-[#1F2937]
          border border-[#E5E7EB] dark:border-[#374151]
          shadow-xl">

            <img
              src="/resume-preview.png"
              alt="Resume Saathi ATS analysis preview"
              className="rounded-xl w-105"
            />

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;