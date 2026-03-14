const About = () => {
  return (
    <section id="about" className="scroll-mt-28 relative bg-white dark:bg-[#111827] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#803AD1]">About Resume Saathi</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#1E293B] dark:text-white">
              Helping Job Seekers
              <span className="bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1] bg-clip-text text-transparent">
                {" "}Get Seen Faster
              </span>
            </h2>
            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              Resume Saathi is built to bridge the gap between strong candidate profiles and ATS filtering systems.
              We combine Resume ATS Analyzer, Job Description Matcher, realtime chatbot help,
              and resume-based interview preparation to help applicants present their value clearly.
            </p>
            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              From freshers to experienced professionals, the platform supports practical improvements that recruiters
              can recognize quickly.
            </p>

            <p className="mt-4 text-[#64748B] dark:text-[#94A3B8] leading-7">
              The experience is designed to feel precise, modern, and useful at every step, from the first upload to
              the final interview round. Instead of generic advice, Resume Saathi focuses on role-specific insights
              that help candidates present stronger applications with clarity and confidence.
            </p>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] dark:border-[#374151] bg-[#F8FAFC] dark:bg-[#1F2937] p-8">
            <h3 className="text-xl font-bold text-[#CA25AF] dark:text-[#FF5FA7]">Our Focus</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              We focus on high-value improvements that make resumes easier to shortlist, easier to understand,
              and stronger in competitive hiring pipelines.
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
              <li>Improve ATS score with clear and actionable recommendations</li>
              <li>Increase relevance by aligning resumes to specific job descriptions</li>
              <li>Get instant support using realtime chatbot guidance</li>
              <li>Prepare interviews based on your resume and target role</li>
              <li>Support confident applications with role-based resume improvements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
