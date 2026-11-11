import { createElement } from "react";
import { FileUp, SearchCheck, Briefcase, BadgeCheck } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const steps = [
  {
    step: "01",
    icon: FileUp,
    title: "Upload resume",
    description:
      "Upload your PDF or DOCX file. Analysis is executed locally with private session storage.",
  },
  {
    step: "02",
    icon: SearchCheck,
    title: "ATS and format audit",
    description:
      "Audit formatting traps, calculate keyword density against target descriptions, and detect inferred tech stacks.",
  },
  {
    step: "03",
    icon: Briefcase,
    title: "Live ATS job discovery",
    description:
      "Browse verified openings fetched directly from employer portals across Greenhouse, Lever, and SmartRecruiters.",
  },
  {
    step: "04",
    icon: BadgeCheck,
    title: "Tailor and apply",
    description:
      "Align bullet points with missing target keywords, verify portal links, and apply directly to official listings.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="scroll-mt-28 relative bg-[#fafafa] dark:bg-[#141415] py-20 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-xs font-mono font-medium text-[#fe3e91]">
              Workflow
            </p>
            <h2 className="mt-2 text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Four steps from resume upload to verified application
            </h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              A structured diagnostic pipeline to check parse compatibility, inspect missing skills, and match direct employer requisitions.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 80}>
              <article className="how-card rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="how-card-icon inline-flex rounded-lg p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {createElement(Icon, { size: 18 })}
                    </div>
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                      {step}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {description}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
