import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import SignupSidePanel from "../components/layout/SignupSidePanel";
import SocialLogin from "../components/layout/SocialLogin";
import FormFooter from "../components/layout/FormFooter";
import AuthService from "../services/authService";
import ErrorForm from "../components/layout/ErrorForm";
import { BUTTON_ACCENT_CLASS } from "../constants/style";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.registerUser(data);
      if (response.success) {
        navigate("/auth/login");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setTimeout(() => {
        setError(null);
      }, 5000);
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-9 pr-4 py-2 rounded-lg text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 bg-white dark:bg-zinc-900 border focus:border-[#fe3e91] focus:outline-none transition-colors";

  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#fafafa] dark:bg-[#141415] px-4">
      {/* Container */}
      <div className="relative w-full max-w-5xl h-[88vh] rounded-xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#19191b] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* LEFT SIDE - Side Panel */}
          <SignupSidePanel />

          {/* RIGHT SIDE - Form */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Create an account
              </h1>
              <p className="mt-1 text-xs text-zinc-500">
                Sign up to audit your resume and track verified career openings.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name */}
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Full name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Alex Vance"
                    disabled={loading}
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 characters",
                      },
                    })}
                    className={`${inputClass} ${
                      errors.fullName
                        ? "border-red-500"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className={errorClass}>{errors.fullName.message}</p>
                )}
              </div>

              {/* Email */}
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
                  <p className={errorClass}>{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loading}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Minimum 8 characters",
                      },
                    })}
                    className={`${inputClass} pr-10 ${
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
                {errors.password && (
                  <p className={errorClass}>{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Confirm password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loading}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`${inputClass} pr-10 ${
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
                {errors.confirmPassword && (
                  <p className={errorClass}>{errors.confirmPassword.message}</p>
                )}
              </div>

              <ErrorForm error={error} />

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${BUTTON_ACCENT_CLASS}`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create account</span>
                  </>
                )}
              </button>
            </form>

            <SocialLogin />
            <FormFooter type="signup" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
