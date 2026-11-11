import { useEffect, useState } from "react";
import { Mail, CheckCircle, RefreshCw, Loader2, ArrowLeft, Inbox as InboxIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import AuthService from "../services/authService";
import { BUTTON_ACCENT_CLASS } from "../constants/style";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      navigate("/auth/login");
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      if (parsed?.email_verified) {
        navigate("/dashboard");
        return;
      }
      setEmail(parsed?.email || "");
      setUserId(parsed?._id || parsed?.id || null);
    } catch {
      navigate("/auth/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleResend = async () => {
    if (!userId || cooldown > 0) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await AuthService.resendVerificationEmail(userId);
      if (response.success) {
        setSuccess(true);
        setCooldown(120);
      } else {
        setError(response.message || "Failed to resend verification email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#fafafa] dark:bg-[#141415] px-4">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#19191b] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* LEFT SIDE - Decorative Panel */}
          <div className="hidden lg:flex flex-col justify-center items-center p-12 h-full relative overflow-hidden bg-[#fe3e91]/[0.03] dark:bg-[#19191b] border-r border-zinc-200/80 dark:border-zinc-800">
            <div className="relative z-10 text-center max-w-sm">
              <div className="mb-6 flex justify-center">
                <div className="w-12 h-12 rounded-lg bg-[#fe3e91]/10 text-[#fe3e91] flex items-center justify-center border border-[#fe3e91]/25">
                  <Mail size={22} />
                </div>
              </div>

              <h2 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                Verify your email
              </h2>
              <p className="text-xs text-zinc-500 mb-8">
                Confirm your account address to begin resume audits
              </p>

              <div className="space-y-3 text-left">
                {[
                  { step: "01", label: "Check your inbox", sub: "Look for an email from Resume Saathi" },
                  { step: "02", label: "Open the link", sub: "Click the secure verification token" },
                  { step: "03", label: "Access dashboard", sub: "Start your live ATS resume audits" },
                ].map(({ step, label, sub }) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 p-3.5 rounded-lg bg-white dark:bg-[#141415] border border-zinc-200/80 dark:border-zinc-800"
                  >
                    <div className="w-8 h-8 rounded-md bg-[#fe3e91]/10 border border-[#fe3e91]/20 flex items-center justify-center shrink-0 text-[#fe3e91] font-mono text-xs">
                      {step}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 text-xs">{label}</p>
                      <p className="text-[11px] text-zinc-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Content */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Check your inbox
              </h1>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We sent a verification link to{" "}
                {email ? (
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{email}</span>
                ) : (
                  "your email address"
                )}
                . Click the link to complete account setup.
              </p>
            </div>

            <div className="mb-6 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="flex items-start gap-3">
                <InboxIcon className="w-4 h-4 text-[#fe3e91] shrink-0 mt-0.5" />
                <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <p>Check your spam or junk folder if the email does not arrive promptly.</p>
                  <p>The verification link remains active for 15 minutes.</p>
                </div>
              </div>
            </div>

            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Verification email resent. Please check your inbox.</span>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-950/30 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {userId && (
              <>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || cooldown > 0}
                  className={`w-full ${BUTTON_ACCENT_CLASS}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Sending...</span>
                    </>
                  ) : cooldown > 0 ? (
                    <>
                      <RefreshCw size={14} />
                      <span>Resend in {formatCountdown(cooldown)}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      <span>Resend verification email</span>
                    </>
                  )}
                </button>
              </>
            )}

            <div className="mt-6 flex items-center justify-between text-xs">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
