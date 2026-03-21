import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router";
import PasswordRecoveryPanel from "../components/layout/PasswordRecoveryPanel";
import FormFooter from "../components/layout/FormFooter";
import ErrorForm from "../components/layout/ErrorForm";
import AuthService from "../services/authService";

const VerifyToken = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    if (!token) {
      navigate("/error", {
        state: {
          status: 400,
          statusText: "Invalid or Missing Token",
        },
      });
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const response = await AuthService.resetPassword(token, data.password);
      if (response.success) {
        setSuccessMessage(response.message || "Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#FFFFFF] dark:bg-[#111827] px-4">
      <div className="absolute inset-0 opacity-20 blur-3xl pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#803AD1] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FE3E91] rounded-full"></div>
      </div>

      <div
        className="relative w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl border border-[#E5E7EB] dark:border-[#374151] overflow-hidden bg-[#FFFFFF] dark:bg-[#1F2937]"
        style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          <PasswordRecoveryPanel mode="verify" />

          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-white">
                Verify Token
              </h1>
              <p className="mt-1 text-sm text-[#475569] dark:text-[#94A3B8]">
                Set your new password to complete account recovery
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                  New Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    disabled={loading}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#64748B] dark:text-[#94A3B8] hover:text-[#FE3E91] dark:hover:text-[#FF5FA7] transition"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-[#1E293B] dark:text-white">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    disabled={loading}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-[#1E293B] dark:text-white placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-[#F9FAFB] dark:bg-[#374151] border border-[#E5E7EB] dark:border-[#374151] focus:ring-2 focus:ring-[#FE3E91] dark:focus:ring-[#FF5FA7] focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[#64748B] dark:text-[#94A3B8] hover:text-[#FE3E91] dark:hover:text-[#FF5FA7] transition"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              {successMessage && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300">
                  {successMessage}
                </p>
              )}

              <ErrorForm error={error} />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold
                bg-linear-to-r from-[#FE3E91] via-[#CA25AF] to-[#803AD1]
                dark:from-[#FF5FA7] dark:via-[#D340BD] dark:to-[#9D65D5]
                hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "0 8px 20px rgba(254, 62, 145, 0.25)" }}
              >
                {loading ? "Updating Password..." : (
                  <>
                    <ShieldCheck className="inline mr-2 w-4 h-4" />
                    Update Password
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
