import { createElement } from "react";
import { FileUp, SearchCheck, Briefcase, BadgeCheck } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const steps = [
  {
    icon: FileUp,
    title: "1. Upload Resume",
    description:
      "Upload your resume securely. We process everything in a private environment so your personal data stays safe.",
  },
  {
    icon: SearchCheck,
    title: "2. ATS & Stack Analysis",
    description:
      "AI extracts your genuine skills, flags formatting traps, and infers your target tech stacks and industry roles.",
  },
  {
    icon: Briefcase,
    title: "3. Live ATS Job Discovery",
    description:
      "Browse live openings from official Greenhouse, Lever, and LinkedIn portals, pre-scored for match compatibility.",
  },
  {
    icon: BadgeCheck,
    title: "4. Tailor & Apply",
    description:
      "Tailor your resume for any opening with 1-click, polish bullet points, and apply directly with confidence.",
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
            We've streamlined the entire job search into four powerful steps. Go from resume upload to interview-ready applications in minutes.
          </p>
        </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
