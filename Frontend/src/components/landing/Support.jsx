import ScrollReveal from "../ScrollReveal";

const Support = () => {

  const handleScrollToOverview = (e) => {
    e.preventDefault();
    const section = document.getElementById("overview");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="support"
      className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20 pb-28"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8 md:p-10 text-center">
          
          <p className="text-sm font-bold uppercase tracking-widest text-[#FE3E91]">
            Support
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
            Need Help With
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}Resume Optimization?
            </span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-[#64748B] dark:text-[#94A3B8]">
            Our team is here to support product questions, scoring clarifications,
            and resume improvement guidance.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 text-left">

            <ScrollReveal delay={0}>
              <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                  Realtime Chatbot Support
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Get instant AI help for resume analysis, section improvements,
                  and scoring clarification while editing.
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                  Resume-Based Interview Help
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Practice interview questions generated from your resume and role
                  to improve confidence before interviews.
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                  Resume ATS Analyzer
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Check ATS score, keyword gaps, and structure quality to increase
                  resume shortlist chances.
                </p>
              </article>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <article className="rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                <h3 className="text-base font-bold text-[#1E293B] dark:text-white">
                  Job Description Matcher
                </h3>
                <p className="mt-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
                  Match your resume with job descriptions to find missing
                  requirements and improve role relevance.
                </p>
              </article>
            </ScrollReveal>

          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

            <a
              href="mailto:support@resumesaathi.com"
              className="px-6 py-3 font-semibold rounded-xl text-white bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-[#CA25AF]/30"
            >
              Email Support
            </a>

            <button
              onClick={handleScrollToOverview}
              className="px-6 py-3 font-semibold rounded-xl border border-[#E5E7EB] dark:border-[#374151] text-[#1E293B] dark:text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white dark:hover:bg-[#111827] hover:shadow-lg hover:shadow-[#111827]/10"
            >
              Back to Overview
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;