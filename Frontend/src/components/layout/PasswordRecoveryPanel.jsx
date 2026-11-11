import { KeyRound, ShieldCheck, MailCheck } from "lucide-react";

const PasswordRecoveryPanel = ({ mode = "forgot" }) => {
  const isVerify = mode === "verify";

  return (
    <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full relative overflow-hidden bg-[#fe3e91]/[0.03] dark:bg-[#19191b] border-r border-zinc-200/80 dark:border-zinc-800">
      <div className="relative z-10 text-center max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-[#fe3e91]/10 text-[#fe3e91] flex items-center justify-center border border-[#fe3e91]/25">
            <KeyRound size={22} />
          </div>
        </div>

        <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          {isVerify ? "Set new password" : "Reset your password"}
        </h2>
        <p className="text-xs text-zinc-500 mb-8">
          Follow the security steps to regain access to your account
        </p>

        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-md bg-[#fe3e91]/10 border border-[#fe3e91]/20 flex items-center justify-center text-[#fe3e91] shrink-0">
              <MailCheck size={16} />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">
                Verification link
              </p>
              <p className="text-[11px] text-zinc-500">
                Single-use secure token delivered to your inbox
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800">
            <div className="w-8 h-8 rounded-md bg-[#fe3e91]/10 border border-[#fe3e91]/20 flex items-center justify-center text-[#fe3e91] shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">
                Session termination
              </p>
              <p className="text-[11px] text-zinc-500">
                Invalidates stale sessions upon reset
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryPanel;
