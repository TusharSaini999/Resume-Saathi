import { createElement } from "react";
import { FileUp, SearchCheck, BadgeCheck } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const steps = [
  {
    icon: FileUp,
    title: "1. Upload with Confidence",
    description:
      "Sign in seamlessly and upload your resume. We process everything in a highly secure, private environment so your data stays yours.",
  },
  {
    icon: SearchCheck,
    title: "2. Uncover Your True Score",
    description:
      "Paste your target job description and watch our AI instantly reveal your match score, missing skills, and hidden formatting traps.",
  },
  {
    icon: BadgeCheck,
    title: "3. Perfect and Apply",
    description:
      "Use your built-in AI assistant to rewrite weak bullet points, fill skill gaps, and generate the perfect resume ready for recruiters.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[#FE3E91]">How It Works</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
            Your Blueprint to
            <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
              {" "}Career Success
            </span>
          </h2>
          <p className="mt-4 text-[#64748B] dark:text-[#94A3B8]">
            We've streamlined the painful optimization process into three incredibly easy steps. Go from upload to interview-ready in minutes.
          </p>
        </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 120}>
              <article className="how-card rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-6 bg-[#F8FAFC] dark:bg-[#1F2937] h-full">
                <div className="how-card-icon inline-flex rounded-xl p-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151]">
                  {createElement(Icon, { className: "w-5 h-5 text-[#CA25AF]" })}
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#1E293B] dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">{description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
