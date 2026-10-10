import { createElement } from "react";
import { Gauge, FileSearch, Brain, ShieldCheck } from "lucide-react";
import ScrollReveal from "../ScrollReveal";

const features = [
  {
    icon: Gauge,
    title: "Beat the ATS Filters",
    description:
      "Stop getting rejected by bots. Our AI uncovers hidden formatting traps, fixes spacing inconsistencies, and polishes your grammar instantly.",
  },
  {
    icon: FileSearch,
    title: "Hyper-Targeted Matching",
    description:
      "Instantly discover missing keywords and skill gaps by comparing your resume directly against your dream job's exact description.",
  },
  {
    icon: Brain,
    title: "Your 24/7 AI Career Assistant",
    description:
      "Chat directly with an AI that knows your resume inside and out. Get instant feedback, rewrite bullet points, and prepare for interviews.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Privacy",
    description:
      "Your career data belongs to you. Enjoy seamless logins and total control over your active sessions across all devices.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-[#803AD1]">
              Features
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
              Everything You Need to
              <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
                {" "}
                Get Hired Faster
              </span>
            </h2>

            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8]">
              Stop guessing what recruiters want. Our powerful suite of tools ensures your application stands out from the competition.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 items-stretch">
          {features.map(({ icon: Icon, title, description }, index) => (
            <ScrollReveal key={title} delay={index * 110}>
              <article className="group h-full flex flex-col justify-center rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-6 bg-[#F8FAFC] dark:bg-[#1F2937] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FE3E91]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
                
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-xl p-2.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] transition-colors duration-300 group-hover:bg-[#FFF1F8] dark:group-hover:bg-[#2A1F38]">
                    {createElement(Icon, { className: "w-5 h-5 text-[#FE3E91] transition-transform duration-300 group-hover:scale-110" })}
                  </span>

                  <h3 className="text-lg font-bold text-[#1E293B] dark:text-white">
                    {title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
                  {description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;