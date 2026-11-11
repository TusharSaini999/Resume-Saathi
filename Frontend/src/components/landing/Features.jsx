import { createElement } from "react";
import { Gauge, FileSearch, MessageSquare, ShieldCheck, Building2, Binary } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const features = [
  {
    icon: Building2,
    title: "Official ATS portal discovery",
    description:
      "Direct indexing of live requisitions from Greenhouse, Lever, SmartRecruiters, and company career boards with live URL verification.",
  },
  {
    icon: Binary,
    title: "Inferred roles and tech stack extraction",
    description:
      "Automated extraction of candidate frameworks, databases, and core stacks to match jobs beyond simple keyword queries.",
  },
  {
    icon: Gauge,
    title: "Format and parser diagnostics",
    description:
      "Identifies multi-column structures, problematic glyphs, header/footer traps, and spacing anomalies that trip automated parsers.",
  },
  {
    icon: FileSearch,
    title: "Job description comparative scoring",
    description:
      "Side-by-side gap analysis mapping required hard skills, qualifications, and domain terms directly against your resume text.",
  },
  {
    icon: MessageSquare,
    title: "Context-aware resume assistant",
    description:
      "Interactive assistant loaded with your parsed resume context to rewrite bullet points with quantifiable metrics and active verbs.",
  },
  {
    icon: ShieldCheck,
    title: "Private session control",
    description:
      "Client-focused session management with full auditability and the option to clear uploaded document states at any time.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="scroll-mt-28 relative bg-[#fafafa] dark:bg-[#141415] py-20 border-t border-zinc-200/80 dark:border-zinc-800/80"
    >
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-2xl">
            <p className="text-xs font-mono font-medium text-[#fe3e91]">
              Capabilities
            </p>

            <h2 className="mt-2 text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
              Diagnostic tools built for technical and professional applications
            </h2>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Accurate ATS parsing audits, direct employer portal syncing, and real-time resume revision.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 60}>
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-5 h-full flex flex-col">
                <div className="inline-flex rounded-lg p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 w-fit mb-4">
                  {createElement(Icon, { size: 18 })}
                </div>

                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 flex-1">
                  {description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
