import { Rocket, BarChart2, Target, Sparkles } from "lucide-react";

const SignupSidePanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full relative overflow-hidden
    bg-linear-to-br from-[#803AD1]/10 via-[#CA25AF]/10 to-[#FE3E91]/10
    dark:from-[#9D65D5]/15 dark:via-[#D340BD]/15 dark:to-[#FF5FA7]/15
    border-r border-[#E5E7EB] dark:border-[#374151]">

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#803AD1] dark:bg-[#9D65D5] rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#FE3E91] dark:bg-[#FF5FA7] rounded-full blur-3xl opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-sm">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#803AD1] to-[#FE3E91] dark:from-[#9D65D5] dark:to-[#FF5FA7] flex items-center justify-center shadow-2xl animate-pulse"
            style={{ boxShadow: "0 10px 30px rgba(128, 58, 209, 0.35)" }}
          >
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#1E293B] dark:text-white mb-4">
          Start Your Career Journey
        </h2>

        {/* Features */}
        <div className="space-y-4">

          {/* Feature 1 */}
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#803AD1] to-[#CA25AF] dark:from-[#9D65D5] dark:to-[#D340BD] flex items-center justify-center shrink-0">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Upload & Analyze
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Instant AI resume feedback
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#CA25AF] to-[#FE3E91] dark:from-[#D340BD] dark:to-[#FF5FA7] flex items-center justify-center shrink-0">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                ATS Match Score
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Beat applicant filters
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#FE3E91] to-[#CA25AF] dark:from-[#FF5FA7] dark:to-[#D340BD] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Job-Fit Insights
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Tailored improvement tips
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SignupSidePanel;
