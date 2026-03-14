import { CheckCircle2 } from "lucide-react";

const tips = [
  "Run Resume ATS Analyzer first to identify formatting, keyword, and structure issues.",
  "Use Job Description Matcher to tailor your resume for every role before applying.",
  "Use role-specific keywords from the job description naturally in your experience bullets.",
  "Use the realtime chatbot to improve weak sections with instant AI suggestions.",
  "Practice resume-based interview questions to prepare concise role-relevant answers.",
  "Avoid heavy graphics, tables, and multi-column layouts in ATS-sensitive resumes.",
];

const AtsTips = () => {
  return (
    <section id="ats-tips" className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8 md:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#CA25AF]">ATS Tips</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
            Quick Wins
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}Before You Hit Apply
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-[#64748B] dark:text-[#94A3B8]">
            Improve results in minutes with ATS checks, job matching, chatbot guidance, and interview readiness tips.
          </p>

          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] dark:border-[#374151] bg-white dark:bg-[#111827] p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FE3E91]" />
                <span className="text-sm leading-6 text-[#475569] dark:text-[#CBD5E1]">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AtsTips;
