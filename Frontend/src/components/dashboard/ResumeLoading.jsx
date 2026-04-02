import { Loader2 } from "lucide-react";
function ResumeLoading({ loadingStage }) {
    const loadingTitle =
        loadingStage === "processing"
            ? "Processing your resume..."
            : loadingStage === "finalizing"
                ? "Finalizing your report..."
                : "Uploading your resume...";
    const loadingDescription =
        loadingStage === "processing"
            ? "We are analyzing sections, keywords, ATS compatibility, and formatting. Do not leave this page."
            : loadingStage === "finalizing"
                ? "Almost done. Preparing your final results for display. Do not leave this page."
                : "Your PDF is being uploaded securely. This usually takes a few seconds. Do not leave this page.";
    const loadingStepText =
        loadingStage === "processing"
            ? "Step 2 of 3: Processing"
            : loadingStage === "finalizing"
                ? "Step 3 of 3: Finalizing"
                : "Step 1 of 3: Uploading";

    return (
        <>
            <div className="w-full max-w-3xl mx-auto">
                <div
                    className={"relative overflow-hidden rounded-3xl border p-8 md:p-10 shadow-2xl dark:border-[#334155] dark:bg-[#0f172a] border-[#e2e8f0] bg-white"}
                >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#fe3e91]/10 blur-3xl" />
                    <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#803ad1]/10 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-r from-[#fe3e91]/20 via-[#ca25af]/20 to-[#803ad1]/20">
                            <Loader2 size={36} className="animate-spin text-[#fe3e91]" />
                        </div>

                        <h3 className={"text-2xl md:text-3xl font-black tracking-tight dark:text-white text-[#1E293B]"}>
                            {loadingTitle}
                        </h3>
                        <p className={"mt-3 max-w-xl text-sm md:text-base dark:text-[#cbd5e1] text-[#64748b]"}>
                            {loadingDescription}
                        </p>

                        <div className={"mt-6 rounded-full px-4 py-2 text-xs font-bold dark:bg-[#1e293b] dark:text-[#cbd5e1] bg-[#f8fafc] text-[#475569]"}>
                            {loadingStepText}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResumeLoading;