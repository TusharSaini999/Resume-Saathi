import { Check } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const tips = [
  "Use a single-column layout. Multi-column tables and text boxes frequently scramble section hierarchy in parser outputs.",
  "Include standard section headings like Experience, Education, and Skills so parsers map fields to their schema correctly.",
  "Match target job keywords directly in bullet points where you have demonstrated real production experience.",
  "Avoid embedding critical contact details or skills inside document headers, footers, or non-standard graphical shapes.",
  "Quantify impact with verifiable metrics (latencies, percentages, revenue figures) to improve recruiter evaluation scores.",
  "Use standard cross-platform fonts (e.g. Inter, Helvetica, Arial) and clean UTF-8 bullet characters rather than decorative icons.",
];

const AtsTips = () => {
  return (
    <section
      id="ats-tips"
      className="scroll-mt-28 relative bg-[#fafafa] dark:bg-[#141415] py-20 border-t border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-6 sm:p-8 md:p-10">
          <p className="text-xs font-mono font-medium text-[#fe3e91]">
            ATS guidelines
          </p>

          <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
            Key criteria evaluated by applicant tracking systems
          </h2>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Guidelines to ensure your resume parses accurately into recruiter databases without losing structural context.
          </p>

          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {tips.map((tip, index) => (
              <ScrollReveal key={tip} as="li" delay={index * 50}>
                <div className="h-full flex items-start gap-3 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40 p-4">
                  <div className="rounded p-1 bg-rose-50 dark:bg-rose-950/40 text-[#fe3e91] shrink-0 mt-0.5">
                    <Check size={14} />
                  </div>
                  <span className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
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
