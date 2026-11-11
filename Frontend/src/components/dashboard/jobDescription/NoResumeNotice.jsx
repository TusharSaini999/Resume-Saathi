import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { BUTTON_CLASS } from "../../../constants/style";

function NoResumeNotice() {
  return (
    <div className="flex min-h-[48vh] w-full items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-zinc-200/80 bg-white p-6 sm:p-8 text-center shadow-xs dark:border-zinc-800 dark:bg-[#19191b]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <AlertCircle size={22} />
        </div>

        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Resume required for comparison
        </h3>
        
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          To calculate keyword density, hard skill gaps, and ATS fit scores for target job listings, upload your resume first.
        </p>

        <div className="mt-6 flex justify-center">
          <Link to="/dashboard" className={BUTTON_CLASS}>
            <span>Go to resume upload</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NoResumeNotice;
