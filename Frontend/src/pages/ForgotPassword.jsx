import { useState } from "react";
import { Mail, Send, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";
import { set, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import PasswordRecoveryPanel from "../components/layout/PasswordRecoveryPanel";
import FormFooter from "../components/layout/FormFooter";
import AuthService from "../services/authService";
import ErrorForm from "../components/layout/ErrorForm";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [captchaA, setCaptchaA] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaB, setCaptchaB] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const isCaptchaValid = Number(captchaInput) === captchaA + captchaB;

  const refreshCaptcha = () => {
    setCaptchaA(Math.floor(Math.random() * 9) + 1);
    setCaptchaB(Math.floor(Math.random() * 9) + 1);
    setCaptchaInput("");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const response = await AuthService.forgotPassword(data.email);
      if (response.success) {
        setSuccessMessage(
          response.message || "If this email exists, we sent a password reset link."
        );
      } else {
        setError(response.message || "Unable to process request");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      refreshCaptcha();
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#FFFFFF] dark:bg-[#111827] px-4">
      <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#FE3E91] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#803AD1] rounded-full"></div>
      </div>

      <div
        className="relative w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#374151] overflow-hidden bg-[#FFFFFF] dark:bg-[#1F2937]"
        style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <PasswordRecoveryPanel mode="forgot" />

          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                Forgot Password?
              </h1>
              <p className="mt-1 text-sm text-[#475569] dark:text-[#94A3B8]">
                Enter your email to receive a verification token
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    disabled={loading}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                  Security Check (Captcha)
                </label>
                <div className="mt-1 flex items-stretch gap-2">
                  <div className="flex items-center gap-2 px-3 rounded-lg bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] min-w-30">
                    <ShieldCheck className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8]" />
                    <span className="text-sm font-semibold text-[#1E293B] dark:text-white select-none">
                      {captchaA} + {captchaB} = ?
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Answer"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={loading}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    disabled={loading}
                    className="px-3 rounded-lg border border-[#E5E7EB] dark:border-[#374151] bg-[#FFFFFF] dark:bg-[#1F2937] text-[#64748B] dark:text-[#94A3B8] hover:text-[#FE3E91] dark:hover:text-[#FF5FA7] transition"
                    aria-label="Refresh captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Solve the captcha to continue.
                </p>
              </div>

              {successMessage && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300">
                  {successMessage}
                </p>
              )}

              <ErrorForm error={error} />

              <button
                type="submit"
                disabled={!isCaptchaValid || loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold
                bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1]
                dark:from-[#FF5FA7] dark:via-[#D340BD] dark:to-[#9D65D5]
                hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ boxShadow: "0 8px 20px rgba(254, 62, 145, 0.25)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="inline mr-2 w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="inline mr-2 w-4 h-4" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <FormFooter type="forgot" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
