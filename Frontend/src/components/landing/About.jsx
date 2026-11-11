import ScrollReveal from "../ScrollReveal";

const About = () => {
  return (
    <section id="about" className="scroll-mt-28 relative bg-[#fafafa] dark:bg-[#141415] py-20 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div>
                <p className="text-xs font-mono font-medium text-[#fe3e91]">
                  About the project
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                  Demystifying applicant tracking for job seekers
                </h2>
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Resume Saathi is an open-source platform designed to bring transparency to the modern hiring process. When candidates submit applications, algorithmic parsers often drop qualified talent due to arbitrary table structures, unrecognized formatting tokens, or misaligned vocabulary.
                </p>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  By pairing deep ATS diagnostics with direct portal discovery across Greenhouse, Lever, SmartRecruiters, and company career boards, we provide job seekers with clear, actionable diagnostics before they hit submit.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5">
            <ScrollReveal delay={100}>
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-6 shadow-xs">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Design and diagnostic principles
                </h3>
                
                <ul className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe3e91] mt-1.5 shrink-0"></span>
                    <span><strong>Accurate parser simulation:</strong> Matches actual ATS ingestion behaviors rather than arbitrary scoring metrics.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe3e91] mt-1.5 shrink-0"></span>
                    <span><strong>Live employer sync:</strong> Direct queries against official ATS boards to ensure job listings are actively recruiting.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe3e91] mt-1.5 shrink-0"></span>
                    <span><strong>Candidate privacy:</strong> Resumes and analysis contexts are kept secure within user-controlled sessions.</span>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
