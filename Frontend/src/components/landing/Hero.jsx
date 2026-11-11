import { ArrowRight, Briefcase, CheckCircle2, ShieldCheck, Cpu } from "lucide-react";
import { BUTTON_CLASS, BUTTON_SECONDARY_CLASS } from "../../constants/style";
import { Link } from "react-router";
import { useSelector } from "react-redux";

const Hero = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;

  return (
    <section
      id="overview"
      className="scroll-mt-28 relative overflow-hidden bg-[#fafafa] dark:bg-[#141415] pt-24 pb-16 md:pt-32 md:pb-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 max-w-2xl">
            
            {/* Signature Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-mono font-medium rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#fe3e91]"></span>
              ATS Diagnostic Engine &middot; Live Career Openings
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.08]">
              Resume analysis and verified job openings, verified against real ATS boards
            </h1>

            {/* Subhead */}
            <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Check your resume formatting traps and keyword density against actual job descriptions. Discover live openings indexed directly from official ATS boards like Greenhouse, Lever, and SmartRecruiters.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                to={isLoggedIn ? "/dashboard" : "/auth/login"}
                className={BUTTON_CLASS}
              >
                <span>Analyze resume</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to={isLoggedIn ? "/dashboard/careers" : "/auth/login"}
                className={BUTTON_SECONDARY_CLASS}
              >
                <Briefcase size={16} className="text-zinc-500 dark:text-zinc-400" />
                <span>Explore live openings</span>
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-rose-50 dark:bg-rose-950/60 text-[#fe3e91] border border-rose-200/60 dark:border-rose-900/60">
                  {isLoggedIn ? "Live" : "Portal sync"}
                </span>
              </Link>
            </div>

            {/* Stat Line */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-zinc-200/80 dark:border-zinc-800/80">
              <div>
                <p className="text-xl sm:text-2xl font-mono font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                  0-100
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                  ATS score criteria
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-mono font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                  100%
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                  Client-side private
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-mono font-medium text-[#fe3e91] tabular-nums">
                  Live ATS
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">
                  Direct employer portals
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Unslop Moment (Crafted ATS Diagnostic Dossier Preview) */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-[#19191b] p-5 shadow-xs">
              
              {/* Dossier Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      ATS Parse Diagnostic
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500">
                      alex_vance_cv.pdf &middot; 2.4 MB
                    </div>
                  </div>
                </div>

                <div className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  92/100 PASS
                </div>
              </div>

              {/* Diagnostic Metrics */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                  <div className="text-[11px] text-zinc-500">Keyword compatibility</div>
                  <div className="text-lg font-mono font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                    88.4%
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">19 of 22 target terms</div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60">
                  <div className="text-[11px] text-zinc-500">Format structure</div>
                  <div className="text-lg font-mono font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                    Standard
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">Single-column compliant</div>
                </div>
              </div>

              {/* Detected Roles & Skills */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-mono text-zinc-500">
                  Inferred stack &middot; MERN &middot; Distributed systems
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Redis"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Verified Portal Match */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <div className="text-[11px] text-zinc-500 mb-2 flex items-center justify-between">
                  <span>Verified Requisition Match</span>
                  <span className="font-mono text-[#fe3e91]">Greenhouse ATS</span>
                </div>
                <div className="p-2.5 rounded-lg border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      Senior Frontend Engineer
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Vercel &middot; Remote &middot; Verified 2h ago
                    </div>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#fe3e91]">
                    94% match
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
