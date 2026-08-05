import ScrollReveal from "../ScrollReveal";

const About = () => {
  return (
    <section id="about" className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <ScrollReveal>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#803AD1]">About Resume Saathi</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
              Helping Job Seekers
              <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
                {" "}Get Seen Faster
              </span>
            </h2>
            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              Resume Saathi is built to bridge the gap between strong candidate profiles and ATS filtering systems.
              Powered by the advanced Gemini AI engine, we provide deep format analysis, precision Job Description matching, and an intelligent Chatbot to help you present your absolute best.
            </p>
            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              From freshers to experienced professionals, the platform securely tracks your active sessions across devices while delivering practical improvements that recruiters recognize instantly.
            </p>

            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              The experience is designed to feel precise, modern, and highly secure at every step. Instead of generic advice, Resume Saathi focuses on role-specific AI insights that help candidates present stronger applications with clarity and confidence.
            </p>

          </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
          <div className="group rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#803AD1]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
            <h3 className="text-xl font-bold text-[#CA25AF] dark:text-[#FF5FA7]">Our Focus</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              We focus on high-value improvements that make resumes easier to shortlist, easier to understand,
              and stronger in competitive hiring pipelines.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              <li className="transition-transform duration-300 group-hover:translate-x-1">Improve ATS score with deep formatting and font analysis</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Compare experience, education, and skills against your target JD</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Get instant support from our context-aware AI Chatbot</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Rest easy with OAuth security and IP-based session management</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Fix grammar and phrasing issues flagged by the AI engine</li>
            </ul>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
