import { CheckCircle, Zap, Shield, Brain } from "lucide-react";

const LoginSidePanel = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full relative overflow-hidden
    bg-linear-to-br from-[#FE3E91]/10 via-[#CA25AF]/10 to-[#803AD1]/10
    dark:from-[#FF5FA7]/15 dark:via-[#D340BD]/15 dark:to-[#9D65D5]/15
    border-r border-[#E5E7EB] dark:border-[#374151]">

      {/* Gradient Orbs */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FE3E91] dark:bg-[#FF5FA7] rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#803AD1] dark:bg-[#9D65D5] rounded-full blur-3xl opacity-20"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-sm">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#FE3E91] to-[#803AD1] dark:from-[#FF5FA7] dark:to-[#9D65D5] flex items-center justify-center shadow-2xl animate-pulse"
               style={{ boxShadow: '0 10px 30px rgba(254, 62, 145, 0.35)' }}>
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-[#1E293B] dark:text-white mb-4">
          Ready to Ace Your Resume?
        </h2>

        {/* Description */}
        {/* <p className="text-[#64748B] dark:text-[#94A3B8] mb-8 leading-relaxed">
          Get AI-powered insights to improve your resume match score and land your dream job.
        </p> */}

        {/* Features */}
        <div className="space-y-4">

          {/* Feature 1 */}
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#FE3E91] to-[#CA25AF] dark:from-[#FF5FA7] dark:to-[#D340BD] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Fast Analysis
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Get results in seconds
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#803AD1] to-[#CA25AF] dark:from-[#9D65D5] dark:to-[#D340BD] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                100% Secure
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Your data is safe
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#CA25AF] to-[#FE3E91] dark:from-[#D340BD] dark:to-[#FF5FA7] flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Expert Tips
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Actionable advice
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginSidePanel;