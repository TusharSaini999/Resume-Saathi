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
              Level Up Your Career
              <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
                {" "}With Confidence
              </span>
            </h2>
            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              Resume Saathi was built to eliminate the frustration of the modern job search. Stop wondering why you aren't getting callbacks—our AI bridges the gap between your true potential and the rigid ATS filters standing in your way.
            </p>
            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              Whether you're landing your first role or stepping into a senior leadership position, our secure platform delivers actionable, data-driven insights that instantly elevate your professional profile.
            </p>

            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              No more generic resume templates or vague advice. We provide role-specific strategies and real-time AI guidance so you can hit "Apply" with absolute certainty.
            </p>

          </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
          <div className="group rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#803AD1]/10 hover:border-[#CA25AF]/40 dark:hover:border-[#CA25AF]/50">
            <h3 className="text-xl font-bold text-[#CA25AF] dark:text-[#FF5FA7]">Your Edge</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              We focus on exactly what recruiters and automated systems are looking for, turning your application from a "maybe" to an absolute "must-interview".
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              <li className="transition-transform duration-300 group-hover:translate-x-1">Skyrocket your ATS scores with pixel-perfect formatting fixes</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Tailor your experience to match any Job Description instantly</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Draft compelling bullet points with your personal AI assistant</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Maintain total privacy with robust, enterprise-grade security</li>
              <li className="transition-transform duration-300 group-hover:translate-x-1">Eliminate grammar mistakes before they cost you an opportunity</li>
            </ul>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default About;
