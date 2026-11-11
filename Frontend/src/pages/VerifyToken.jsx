import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import PasswordRecoveryPanel from "../components/layout/PasswordRecoveryPanel";
import FormFooter from "../components/layout/FormFooter";
import AuthService from "../services/authService";
import ErrorForm from "../components/layout/ErrorForm";
import { BUTTON_ACCENT_CLASS } from "../constants/style";

const VerifyToken = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    if (!token) {
      setError("Invalid or expired reset token.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const response = await AuthService.verifyPasswordResetToken(token, data.password);
      if (response.success) {
        setSuccessMessage("Password reset successful. Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-9 pr-10 py-2 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white dark:bg-zinc-900 border focus:border-[#fe3e91] focus:outline-none transition-colors";

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#fafafa] dark:bg-[#141415] px-4">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#19191b] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <PasswordRecoveryPanel mode="verify" />

          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Set new password
              </h1>
              <p className="mt-1 text-xs text-zinc-500">
                Enter your new password to complete account recovery
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  New password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    disabled={loading}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Minimum 8 characters",
                      },
                    })}
                    className={`${inputClass} ${
                      errors.password
                        ? "border-red-500"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Confirm new password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    disabled={loading}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) => value === password || "Passwords do not match",
                    })}
                    className={`${inputClass} ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {successMessage && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                  {successMessage}
                </p>
              )}

              <ErrorForm error={error} />

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${BUTTON_ACCENT_CLASS}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Update password</span>
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

export default VerifyToken;
