import { CheckCircle2 } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const tips = [
  "Run the Deep ATS Analyzer to uncover hidden issues like font inconsistencies, tight spacing, and misalignments.",
  "Ensure your resume strictly matches the Job Description. The Analyzer will assign a 0-100 Match Score.",
  "Extract exact missing skills directly from the Matcher and weave them naturally into your experience bullets.",
  "Address any flagged grammatical errors or awkward phrasing identified by the AI analysis engine.",
  "Consult your persistent AI Chatbot assistant for section-by-section improvements before you hit apply.",
  "Avoid multi-column layouts, as the format analyzer specifically flags them for ATS risk.",
];

const AtsTips = () => {
  return (
    <section
      id="ats-tips"
      className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#CA25AF]">
            ATS Tips
          </p>

          <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
            Quick Wins
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}
              Before You Hit Apply
            </span>
          </h2>

          <p className="mt-4 max-w-3xl text-[#64748B] dark:text-[#94A3B8]">
            Improve results in minutes with ATS checks, job matching, chatbot
            guidance, and interview readiness tips.
          </p>

          <ul className="mt-8 grid gap-4 md:grid-cols-2 items-stretch">
            {tips.map((tip, index) => (
              <ScrollReveal key={tip} as="li" delay={index * 80}>
                <div className="group h-full flex items-center gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#803AD1]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                  
                  <CheckCircle2 className="h-5 w-5 text-[#FE3E91] transition-transform duration-300 group-hover:scale-110 shrink-0" />

                  <span className="text-sm leading-6 text-[#475569] dark:text-[#CBD5E1]">
                    {tip}
                  </span>

                </div>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AtsTips;