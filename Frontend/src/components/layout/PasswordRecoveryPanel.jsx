import { KeyRound, ShieldCheck, MailCheck, RefreshCcw } from "lucide-react";

const PasswordRecoveryPanel = ({ mode = "forgot" }) => {
  const isVerify = mode === "verify";

  return (
    <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full relative overflow-hidden
    bg-linear-to-br from-[#FE3E91]/10 via-[#CA25AF]/10 to-[#803AD1]/10
    dark:from-[#FF5FA7]/15 dark:via-[#D340BD]/15 dark:to-[#9D65D5]/15
    border-r border-[#E5E7EB] dark:border-[#374151]">

      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FE3E91] dark:bg-[#FF5FA7] rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#803AD1] dark:bg-[#9D65D5] rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 text-center max-w-sm">
        <div className="mb-8 flex justify-center">
          <div
            className="w-24 h-24 rounded-3xl bg-linear-to-br from-[#FE3E91] to-[#803AD1] dark:from-[#FF5FA7] dark:to-[#9D65D5] flex items-center justify-center shadow-2xl animate-pulse"
            style={{ boxShadow: "0 10px 30px rgba(254, 62, 145, 0.35)" }}
          >
            <KeyRound className="w-12 h-12 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-[#1E293B] dark:text-white mb-4">
          {isVerify ? "Set New Password" : "Recover Your Account"}
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#FE3E91] to-[#CA25AF] dark:from-[#FF5FA7] dark:to-[#D340BD] flex items-center justify-center shrink-0">
              <MailCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Secure Email Flow
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Token sent to your inbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#803AD1] to-[#CA25AF] dark:from-[#9D65D5] dark:to-[#D340BD] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Protected Access
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Your account stays safe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl
          bg-[#FFFFFF]/70 dark:bg-[#1F2937]/70 backdrop-blur-md border border-[#E5E7EB]/60 dark:border-[#374151]/60
          hover:scale-[1.02] hover:shadow-md transition">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#CA25AF] to-[#FE3E91] dark:from-[#D340BD] dark:to-[#FF5FA7] flex items-center justify-center shrink-0">
              <RefreshCcw className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1E293B] dark:text-white text-sm">
                Quick Reset
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Back to work in minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryPanel;
