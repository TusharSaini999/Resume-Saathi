import { AlertCircle } from "lucide-react";

export default function NoResumeNotice() {
  return (
    <div className="flex min-h-[56vh] w-full items-center justify-center rounded-3xl border border-amber-200 bg-amber-50/90 p-5 shadow-lg dark:border-amber-500/40 dark:bg-amber-500/10 sm:p-6 md:min-h-[60vh] md:p-8">
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
          <AlertCircle size={12} /> Action Required
        </p>
        <h3 className="mt-3 text-xl font-black text-[#1e293b] dark:text-white sm:text-2xl md:text-3xl">
          First Upload The Resume
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[#475569] dark:text-[#cbd5e1] md:text-base">
          You need to upload your resume before using the chat. Please upload your resume in the Resume tab, then come back here.
        </p>
      </div>
    </div>
  );
}
