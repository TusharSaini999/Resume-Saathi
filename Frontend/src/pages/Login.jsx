import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import LoginSidePanel from "../components/layout/LoginSidePanel";
import SocialLogin from "../components/layout/SocialLogin";
import FormFooter from "../components/layout/FormFooter";
import AuthService from "../services/authService";
import ErrorForm from "../components/layout/ErrorForm";
import { useDispatch } from "react-redux";
import { Login as LoginThunk } from "../context/Thunk/Auth.js";
import { BUTTON_ACCENT_CLASS } from "../constants/style";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(data);
      if (response.success) {
        dispatch(LoginThunk(response.data));
        if (response.statusCode == 200 && response?.data?.email_verified) {
          const redirectPath = location.state?.from?.pathname || "/dashboard";
          navigate(redirectPath, { replace: true });
        } else {
          navigate("/auth/verify-email");
        }
      } else {
        setError(response.message || "Login failed");
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
          <LoginSidePanel />

          {/* RIGHT SIDE - Form */}
          <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-6 overflow-y-auto">
            {/* Header */}
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-2xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Sign in to your account
              </h1>
              <p className="mt-1 text-xs text-zinc-500">
                Enter your credentials to access your saved resume diagnostics.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3.5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Email address
                </label>

                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
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

              {/* Forgot Password */}
              <div className="text-right text-xs">
                <Link
                  to="/auth/forgot-password"
                  className="text-[#fe3e91] hover:underline"
                >
                  Forgot password?
                </Link>
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>

            <SocialLogin />
            <FormFooter type="login" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
