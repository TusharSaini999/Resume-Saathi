import { useState } from "react";
import { Mail, Send, RefreshCw, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import PasswordRecoveryPanel from "../components/layout/PasswordRecoveryPanel";
import FormFooter from "../components/layout/FormFooter";
import AuthService from "../services/authService";
import ErrorForm from "../components/layout/ErrorForm";
import { BUTTON_ACCENT_CLASS } from "../constants/style";

const ForgotPassword = () => {
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

  const inputClass =
    "w-full pl-9 pr-4 py-2 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white dark:bg-zinc-900 border focus:border-[#fe3e91] focus:outline-none transition-colors";

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#fafafa] dark:bg-[#141415] px-4">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#19191b] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <PasswordRecoveryPanel mode="forgot" />

          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Recover account
              </h1>
              <p className="mt-1 text-xs text-zinc-500">
                Enter your registered email to receive reset instructions.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Email address
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
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
                    className={`${inputClass} ${
                      errors.email
                        ? "border-red-500"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Security verification: {captchaA} + {captchaB} = ?
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    placeholder="Enter sum"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-[#fe3e91] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    disabled={loading}
                    className="px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    aria-label="Refresh captcha"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {successMessage && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {successMessage}
                </p>
              )}

              <ErrorForm error={error} />

              <button
                type="submit"
                disabled={!isCaptchaValid || loading}
                className={`w-full ${BUTTON_ACCENT_CLASS}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send reset link</span>
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
